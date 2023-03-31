import {accountInfo} from '@haqq/provider-web3-utils';
import BN from 'bn.js';
import {curveN} from './constants';
import {hashPasswordToBN} from './hash-password-to-bn';
import {Share, ShareEncrypted} from './types';

export async function encryptShare(
  share: Share,
  password: string,
): Promise<ShareEncrypted> {
  const hash = await hashPasswordToBN(password);
  const nonce = new BN(share.share, 'hex').sub(hash).umod(curveN);

  const publicShare = await accountInfo(share.share);

  return {
    nonce: nonce.toString('hex'),
    publicShare: publicShare.publicKey,
    shareIndex: share.shareIndex,
    polynomialID: share.polynomialID,
  };
}
