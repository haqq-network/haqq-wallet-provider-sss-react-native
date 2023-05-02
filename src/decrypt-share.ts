import {accountInfo} from '@haqq/provider-web3-utils';
import BN from 'bn.js';
import {curveN} from './constants';
import {hashPasswordToBN} from './hash-password-to-bn';
import {Share, ShareEncrypted} from './types';

export async function decryptShare(
  shareEncrypted: ShareEncrypted,
  password: string,
): Promise<Share> {
  const userInputHash = await hashPasswordToBN(password);
  const share = new BN(shareEncrypted.nonce, 'hex')
    .add(userInputHash)
    .umod(curveN)
    .toString('hex')
    .padStart(64, '0');

  const info = await accountInfo(share);

  if (info.publicKey !== shareEncrypted.publicShare) {
    throw new Error('Incorrect password');
  }

  return {
    share,
    shareIndex: shareEncrypted.shareIndex,
    polynomialID: shareEncrypted.polynomialID,
  };
}
