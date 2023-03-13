import {StorageInterface} from './types';
import EncryptedStorage from 'react-native-encrypted-storage';
import {ITEM_KEY} from './constants';
import {decryptShare} from './decrypt-share';
import {SecurityQuestionStore} from '@tkey/security-questions';
import {ShareStore} from '@tkey/common-types';
import {lagrangeInterpolation} from '@tkey/core';
import BN from 'bn.js';
import {
  generateMnemonicFromEntropy,
  seedFromMnemonic
} from '@haqq/provider-web3-utils';

export async function getSeed(
  account: string,
  storage: StorageInterface,
  getPassword: () => Promise<string>,
) {
  let shares = [];

  const share1 = await EncryptedStorage.getItem(`${ITEM_KEY}_${account}`);

  if (share1) {
    const password = await getPassword();
    const shareStore = await decryptShare(
      SecurityQuestionStore.fromJSON(JSON.parse(share1)),
      password,
    );

    shares.push(shareStore);
  }

  const content = await storage.getItem(`haqq_${account}`);

  if (content) {
    shares.push(ShareStore.fromJSON(JSON.parse(content)));
  }

  shares = shares.filter(Boolean);

  if (shares.length < 2) {
    throw new Error('not enough shares');
  }

  const polynomialIDs = new Set(shares.map(s => s.polynomialID));

  if (polynomialIDs.size > 1) {
    throw new Error('polynomialID not equals');
  }

  const privKey = lagrangeInterpolation(
    shares.map(s => new BN(s.share.share, 'hex')),
    shares.map(s => new BN(s.share.shareIndex, 'hex')),
  );

  const mnemonic = await generateMnemonicFromEntropy(privKey.toBuffer());
  const seed = await seedFromMnemonic(mnemonic);
  return {seed};
}
