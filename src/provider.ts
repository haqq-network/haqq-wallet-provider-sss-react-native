import {hexConcat} from '@ethersproject/bytes';
import {serialize, UnsignedTransaction} from '@ethersproject/transactions';
import {
  compressPublicKey,
  hexStringToByteArray,
  joinSignature,
  prepareHashedEip712Data,
  stringToUtf8Bytes,
  BytesLike,
  Provider,
  ProviderBaseOptions,
  ProviderInterface,
  TransactionRequest,
  TypedData,
} from '@haqq/provider-base';
import {
  accountInfo,
  derive,
  generateEntropy,
  sign,
} from '@haqq/provider-web3-utils';
import {
  decryptShare,
  encryptShare,
  getMetadataValue,
  jsonrpcRequest,
  setMetadataValue,
  SharesResponse,
  ShareCreateResponse,
} from '@haqq/shared-react-native';
import BN from 'bn.js';
import EncryptedStorage from 'react-native-encrypted-storage';
import {ITEM_KEY} from './constants';
import {getSeed} from './get-seed';
import {lagrangeInterpolation} from './lagrange-interpolation';
import {Polynomial} from './polynomial';
import {ProviderSSSOptions, StorageInterface} from './types';

export class ProviderSSSReactNative
  extends Provider<ProviderSSSOptions>
  implements ProviderInterface
{
  /**
   * Initialize SSS provider
   * @param socialPrivateKey private key which we get from social service
   * @param cloudShare encrypted share from cloud storage
   * @param localShare encrypted share from local storage
   * @param privateKey private key which rewrite current shares
   * @param verifier verifier name
   * @param token token for verifier name
   * @param getPassword function which return password for decrypt share
   * @param storage storage for save share
   * @param options options for provider and metadata
   */
  static async initialize(
    socialPrivateKey: string | null,
    cloudShare: string | null,
    localShare: string | null,
    privateKey: string | null,
    verifier: string,
    token: string,
    getPassword: () => Promise<string>,
    storage: StorageInterface,
    options: Omit<ProviderBaseOptions, 'getPassword'> & {
      metadataUrl: string;
      generateSharesUrl: string;
    },
  ): Promise<ProviderSSSReactNative> {
    let keyPK = socialPrivateKey;
    let shares = [];

    if (cloudShare) {
      shares.push(JSON.parse(cloudShare));
    }

    if (localShare) {
      shares.push(JSON.parse(localShare));
    }

    if (socialPrivateKey) {
      const socialShareIndex = await getMetadataValue(
        options.metadataUrl,
        socialPrivateKey,
        'socialShareIndex',
      );

      if (socialShareIndex) {
        shares.push({
          ...socialShareIndex,
          share: socialPrivateKey,
        });
      }
    }

    if (shares.length < 2 || privateKey) {
      shares = [];
      const pk = privateKey
        ? Buffer.from(privateKey, 'hex')
        : await generateEntropy(32);

      const p = await Polynomial.initialize(pk, 2);

      for (let i = 0; i < 2; i++) {
        const index = await generateEntropy(32);
        shares.push(p.getShare(index.toString('hex')));
      }
    }

    const poly = await Polynomial.fromShares(shares);

    if (!socialPrivateKey || privateKey) {
      const index = await generateEntropy(32);
      const tmpSocialShare = poly.getShare(index.toString('hex'));

      const p = await Polynomial.initialize(
        new BN(tmpSocialShare.share, 'hex'),
        3,
      );

      const nodeDetailsRequest = await jsonrpcRequest<SharesResponse>(
        options.generateSharesUrl,
        'shares',
        [verifier, token, true],
      );

      const tmpPk = await generateEntropy(32);
      const info = await accountInfo(tmpPk.toString('hex'));
      const sharesTmp = await Promise.all(
        nodeDetailsRequest.shares.map(s =>
          jsonrpcRequest<ShareCreateResponse>(s[0], 'shareCreate', [
            verifier,
            token,
            info.publicKey,
            p.getShare(s[1]).share,
          ])
            .then(r => [r.hex_share, s[1]])
            .catch(() => [null, s[1]]),
        ),
      );

      const sharesTmp2 = sharesTmp.filter(s => s[0] !== null) as [
        string,
        string,
      ][];

      if (sharesTmp2.length < 2) {
        throw new Error('Not enought shares');
      }

      const newPk = lagrangeInterpolation(
        sharesTmp2.map(s => new BN(s[0], 'hex')),
        sharesTmp2.map(s => new BN(s[1], 'hex')),
      );

      if (newPk.toString('hex') !== tmpSocialShare.share) {
        throw new Error('Something went wrong');
      }

      keyPK = newPk.toString('hex');

      const {share, ...shareIndex} = tmpSocialShare;

      await setMetadataValue(
        options.metadataUrl,
        share,
        'socialShareIndex',
        shareIndex,
      );
    }

    if (keyPK === null) {
      throw new Error('keyPK is null');
    }

    const {address} = await accountInfo(keyPK);

    if (!cloudShare || privateKey) {
      const index = await generateEntropy(32);
      const tmpCloudShare = poly.getShare(index.toString('hex'));

      const stored = await storage.setItem(
        `haqq_${address.toLowerCase()}`,
        JSON.stringify(tmpCloudShare),
      );

      if (stored) {
        await ProviderSSSReactNative.setStorageForAccount(
          address.toLowerCase(),
          storage,
        );
      }
    }

    const deviceShareIndex = await generateEntropy(32);
    const deviceShare = poly.getShare(deviceShareIndex.toString('hex'));

    const pass = await getPassword();

    const sqStore = await encryptShare(deviceShare, pass);

    await EncryptedStorage.setItem(
      `${ITEM_KEY}_${address.toLowerCase()}`,
      JSON.stringify(sqStore),
    );

    const accounts = await ProviderSSSReactNative.getAccounts();

    await EncryptedStorage.setItem(
      `${ITEM_KEY}_accounts`,
      JSON.stringify(accounts.concat(address.toLowerCase())),
    );

    return new ProviderSSSReactNative({
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

  static async setStorageForAccount(
    accountId: string,
    storage: StorageInterface,
  ): Promise<string[]> {
    const storages = await ProviderSSSReactNative.getStoragesForAccount(
      accountId,
    );

    if (!storages.includes(storage.getName())) {
      await EncryptedStorage.setItem(
        `${ITEM_KEY}_storages_${accountId.toLowerCase()}`,
        JSON.stringify(storages.concat(storage.getName())),
      );
    }

    return storages;
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

  async signTypedData(hdPath: string, typedData: TypedData): Promise<string> {
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

      const {domainSeparatorHex, hashStructMessageHex} =
        prepareHashedEip712Data(typedData);
      const concatHash = hexConcat([
        '0x1901',
        domainSeparatorHex,
        hashStructMessageHex,
      ]);
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

        const share = await decryptShare(JSON.parse(share1), password);
        const share2 = await encryptShare(share, pin);

        await EncryptedStorage.setItem(
          `${ITEM_KEY}_${this.getIdentifier().toLowerCase()}`,
          JSON.stringify(share2),
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
    const shareLocal = await EncryptedStorage.getItem(
      `${ITEM_KEY}_${this._options.account}`,
    );
    if (!shareLocal) {
      return false;
    }

    const password = await this._options.getPassword();

    const localShare = await decryptShare(JSON.parse(shareLocal), password);

    const share = JSON.parse(item);

    if (share.polynomialID && share.polynomialID !== localShare.polynomialID) {
      return false;
    }

    await ProviderSSSReactNative.setStorageForAccount(
      this._options.account.toLowerCase(),
      store,
    );

    return true;
  }

  async tryToSaveShareToStore(storage: StorageInterface) {
    const shareTmp = await this._options.storage.getItem(
      `haqq_${this._options.account}`,
    );

    if (!shareTmp) {
      return;
    }

    const saved = await storage.setItem(
      `haqq_${this._options.account}`,
      shareTmp,
    );

    if (!saved) {
      return;
    }

    await ProviderSSSReactNative.setStorageForAccount(
      this._options.account.toLowerCase(),
      this._options.storage,
    );

    const file = await this._options.storage.getItem(
      `haqq_${this._options.account}`,
    );

    if (file === shareTmp && this._options.storage.getName() === 'local') {
      await this._options.storage.removeItem(`haqq_${this._options.account}`);
    }
  }

  /**
   * Get mnemonic phrase
   * @returns mnemonic
   */
  async getMnemonicPhrase(): Promise<string> {
    const {mnemonic} = await getSeed(
      this._options.account,
      this._options.storage,
      this._options.getPassword,
    );
    if (!mnemonic) {
      throw new Error('seed_not_found');
    }

    return mnemonic;
  }
}
