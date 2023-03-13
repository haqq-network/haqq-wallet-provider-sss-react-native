import {hashPasswordToBN} from './hash-password-to-bn';
import {ecCurve, ShareStore} from '@tkey/common-types';
import {SecurityQuestionStore} from '@tkey/security-questions';

export async function encryptShare(
  shareStore: ShareStore,
  password: string,
): Promise<SecurityQuestionStore> {
  const hash = await hashPasswordToBN(password);
  let nonce = shareStore.share.share.sub(hash);
  nonce = nonce.umod(ecCurve.curve.n);

  return new SecurityQuestionStore({
    nonce,
    questions: '',
    sqPublicShare: shareStore.share.getPublicShare(),
    shareIndex: shareStore.share.shareIndex,
    polynomialID: shareStore.polynomialID,
  });
}
