import {
  BytesLike,
  compressPublicKey,
  hexStringToByteArray,
  joinSignature,
  Provider,
  ProviderBaseOptions,
  ProviderInterface,
  stringToUtf8Bytes,
  TransactionRequest
} from '@haqq/provider-base';
import {ProviderMpcOptions, StorageInterface} from './types';
import ThresholdKey from '@tkey/core';
import ServiceProvider from '@tkey/service-provider-base';
import TorusStorageLayer from '@tkey/storage-layer-torus';
import {
  ServiceProviderArgs,
  ShareStore,
  TorusStorageLayerArgs
} from '@tkey/common-types';
import {ShareTransferModule} from '@tkey/share-transfer';
import {ShareSerializationModule} from '@tkey/share-serialization';
import SecurityQuestionsModule, {
  SecurityQuestionStore
} from '@tkey/security-questions';
import BN from 'bn.js';
import {
  accountInfo,
  derive,
  generateEntropy,
  sign
} from '@haqq/provider-web3-utils';
import EncryptedStorage from 'react-native-encrypted-storage';
import {ITEM_KEY} from './constants';
import {encryptShare} from './encrypt-share';
import {getSeed} from './get-seed';
import {decryptShare} from './decrypt-share';
import {hexConcat} from '@ethersproject/bytes';
import {serialize, UnsignedTransaction} from '@ethersproject/transactions';

export class ProviderMpcReactNative extends Provider<ProviderMpcOptions> implements ProviderInterface {
  static async initialize(
    web3privateKey: string,
    questionAnswer: string | null,
    cloudShare: string | null,
    privateKey: string | null,
    getPassword: () => Promise<string>,
    storage: StorageInterface,
    serviceProviderOptions: ServiceProviderArgs,
    storageOptions: TorusStorageLayerArgs,
    options: Omit<ProviderBaseOptions, 'getPassword'>,
  ): Promise<ProviderMpcReactNative> {
    let password = questionAnswer;

    const serviceProvider = new ServiceProvider(serviceProviderOptions);

    const storageLayer = new TorusStorageLayer(storageOptions);

    const shareTransferModule = new ShareTransferModule();
    const shareSerializationModule = new ShareSerializationModule();
    const securityQuestionsModule = new SecurityQuestionsModule();

    const tKey = new ThresholdKey({
      serviceProvider: serviceProvider,
      storageLayer,
      modules: {
        shareTransfer: shareTransferModule,
        shareSerializationModule: shareSerializationModule,
        securityQuestions: securityQuestionsModule,
      },
    });

    tKey.serviceProvider.postboxKey = new BN(web3privateKey, 16);
    await tKey.initialize();

    if (!questionAnswer && !cloudShare) {
      const bytes = privateKey
        ? Buffer.from(privateKey, 'hex')
        : await generateEntropy(32);

      await tKey._initializeNewKey({
        initializeModules: true,
        importedKey: new BN(bytes),
      });

      password = await getPassword();

      await securityQuestionsModule.generateNewShareWithSecurityQuestions(
        password,
        'whats your password?',
      );
    }

    if (questionAnswer) {
      await securityQuestionsModule.inputShareFromSecurityQuestions(
        password as string,
      );
    }

    if (cloudShare) {
      const share = ShareStore.fromJSON(JSON.parse(cloudShare));
      tKey.inputShareStore(share);
    }

    if (questionAnswer || cloudShare) {
      await tKey.reconstructKey();
    }

    const {address} = await accountInfo(web3privateKey.padStart(64, '0'));

    while (tKey.getAllShareStoresForLatestPolynomial().length < 5) {
      await tKey.generateNewShare();
    }

    const rootShareIndex = new BN(1);

    const applicants = tKey
      .getAllShareStoresForLatestPolynomial()
      .filter(s => s.share.shareIndex !== rootShareIndex)
      .map(s => ({
        key: Math.random(),
        share: s,
      }));

    applicants.sort((a, b) => a.key - b.key);

    const [cShare, deviceShare] = applicants;

    const stored = await storage.setItem(
      `haqq_${address.toLowerCase()}`,
      JSON.stringify(cShare.share),
    );

    if (stored) {
      const storages = await ProviderMpcReactNative.getStoragesForAccount(
        address.toLowerCase(),
      );

      await EncryptedStorage.setItem(
        `${ITEM_KEY}_storages_${address.toLowerCase()}`,
        JSON.stringify(storages.concat(storage.getName())),
      );
    }

    const pass = await getPassword();

    const sqStore = await encryptShare(
      ShareStore.fromJSON(deviceShare.share),
      pass,
    );

    await EncryptedStorage.setItem(
      `${ITEM_KEY}_${address.toLowerCase()}`,
      JSON.stringify(sqStore.toJSON()),
    );

    const accounts = await ProviderMpcReactNative.getAccounts();

    await EncryptedStorage.setItem(
      `${ITEM_KEY}_accounts`,
      JSON.stringify(accounts.concat(address.toLowerCase())),
    );

    return new ProviderMpcReactNative({
      ...options,
      getPassword,
      storage,
      account: address.toLowerCase(),
    });
  }

  static async getAccounts() {
    const storedKeys = await EncryptedStorage.getItem(`${ITEM_KEY}_accounts`);

    return JSON.parse(storedKeys ?? '[]') as string[];
  }

  static async getStoragesForAccount(accountId?: string): Promise<string[]> {
    if (!accountId) {
      return [];
    }
    const storageKeys = await EncryptedStorage.getItem(
      `${ITEM_KEY}_storages_${accountId}`,
    );
    return JSON.parse(storageKeys ?? '[]');
  }

  getIdentifier() {
    return this._options.account;
  }

  async getAccountInfo(hdPath: string) {
    let resp = {publicKey: '', address: ''};
    try {
      const {seed} = await getSeed(
        this._options.account,
        this._options.storage,
        this._options.getPassword,
      );

      if (!seed) {
        throw new Error('seed_not_found');
      }

      const privateKey = await derive(seed, hdPath);

      if (!privateKey) {
        throw new Error('private_key_not_found');
      }

      const account = await accountInfo(privateKey);

      resp = {
        publicKey: compressPublicKey(account.publicKey),
        address: account.address,
      };
      this.emit('getPublicKeyForHDPath', true);
    } catch (e) {
      if (e instanceof Error) {
        this.catchError(e, 'getPublicKeyForHDPath');
      }
    }
    return resp;
  }

  async signTransaction(
    hdPath: string,
    transaction: TransactionRequest,
  ): Promise<string> {
    let resp = '';
    try {
      const {seed} = await getSeed(
        this._options.account,
        this._options.storage,
        this._options.getPassword,
      );

      if (!seed) {
        throw new Error('seed_not_found');
      }

      const privateKey = await derive(seed, hdPath);

      if (!privateKey) {
        throw new Error('private_key_not_found');
      }

      const signature = await sign(
        privateKey,
        serialize(transaction as UnsignedTransaction),
      );

      const sig = hexStringToByteArray(signature);

      resp = serialize(transaction as UnsignedTransaction, sig);

      this.emit('signTransaction', true);
    } catch (e) {
      if (e instanceof Error) {
        this.catchError(e, 'signTransaction');
      }
    }

    return resp;
  }

  async signPersonalMessage(
    hdPath: string,
    message: BytesLike | string,
  ): Promise<string> {
    let resp = '';
    try {
      const {seed} = await getSeed(
        this._options.account,
        this._options.storage,
        this._options.getPassword,
      );
      if (!seed) {
        throw new Error('seed_not_found');
      }

      const privateKey = await derive(seed, hdPath);

      if (!privateKey) {
        throw new Error('private_key_not_found');
      }

      const m = Array.from(
        typeof message === 'string' ? stringToUtf8Bytes(message) : message,
      );

      const hash = Buffer.from(
        [
          25, 69, 116, 104, 101, 114, 101, 117, 109, 32, 83, 105, 103, 110, 101,
          100, 32, 77, 101, 115, 115, 97, 103, 101, 58, 10,
        ].concat(stringToUtf8Bytes(String(message.length)), m),
      ).toString('hex');
      const signature = await sign(privateKey, hash);
      resp = '0x' + joinSignature(signature);
      this.emit('signTransaction', true);
    } catch (e) {
      if (e instanceof Error) {
        this.catchError(e, 'signTransaction');
      }
    }

    return resp;
  }

  async signTypedData(
    hdPath: string,
    domainHash: string,
    valueHash: string,
  ): Promise<string> {
    let response = '';
    try {
      const {seed} = await getSeed(
        this._options.account,
        this._options.storage,
        this._options.getPassword,
      );

      if (!seed) {
        throw new Error('seed_not_found');
      }

      const privateKey = await derive(seed, hdPath);

      if (!privateKey) {
        throw new Error('private_key_not_found');
      }

      const concatHash = hexConcat(['0x1901', domainHash, valueHash]);
      response = await sign(privateKey, concatHash);
      this.emit('signTypedData', true);
    } catch (e) {
      if (e instanceof Error) {
        this.catchError(e, 'signTypedData');
      }
    }

    return response;
  }

  async updatePin(pin: string) {
    try {
      const share1 = await EncryptedStorage.getItem(
        `${ITEM_KEY}_${this._options.account.toLowerCase()}`,
      );

      if (share1) {
        const password = await this._options.getPassword();

        const sqStore = SecurityQuestionStore.fromJSON(JSON.parse(share1));

        const share = await decryptShare(sqStore, password);
        const share2 = await encryptShare(share, pin);

        await EncryptedStorage.setItem(
          `${ITEM_KEY}_${this.getIdentifier().toLowerCase()}`,
          JSON.stringify(share2.toJSON()),
        );
      }
    } catch (e) {
      if (e instanceof Error) {
        this.catchError(e, 'updatePin');
      }
    }
  }

  async isShareSaved(storage?: StorageInterface): Promise<boolean> {
    const store = storage ?? this._options.storage;
    const item = await store.getItem(`haqq_${this._options.account}`);

    if (!item) {
      return false;
    }
    let shareLocal = await EncryptedStorage.getItem(
      `${ITEM_KEY}_${this._options.account}`,
    );
    if (!shareLocal) {
      return false;
    }

    const password = await this._options.getPassword();

    const localShare = await decryptShare(
      SecurityQuestionStore.fromJSON(JSON.parse(shareLocal)),
      password,
    );

    const share = JSON.parse(item);

    return share.polynomialID && share.polynomialID === localShare.polynomialID;
  }

  async tryToSaveShareToStore(storage: StorageInterface) {
    let shareTmp = await this._options.storage.getItem(
      `haqq_${this._options.account}`,
    );

    if (shareTmp) {
      await storage.setItem(`haqq_${this._options.account}`, shareTmp);

      const file = await this._options.storage.getItem(
        `haqq_${this._options.account}`,
      );

      if (file === shareTmp && this._options.storage.getName() === 'local') {
        await this._options.storage.removeItem(`haqq_${this._options.account}`);
      }
    }
  }
}
