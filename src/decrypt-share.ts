import {
  SecurityQuestionsError,
  SecurityQuestionStore
} from '@tkey/security-questions';
import {ecCurve, Share, ShareStore} from '@tkey/common-types';
import {hashPasswordToBN} from './hash-password-to-bn';

export async function decryptShare(
  sqStore: SecurityQuestionStore,
  password: string,
): Promise<ShareStore> {
  const userInputHash = await hashPasswordToBN(password);
  let share = sqStore.nonce.add(userInputHash);
  share = share.umod(ecCurve.curve.n);

  const shareStore = new ShareStore(
    new Share(sqStore.shareIndex, share),
    sqStore.polynomialID,
  );

  const derivedPublicShare = shareStore.share.getPublicShare();
  if (
    derivedPublicShare.shareCommitment.x.cmp(
      sqStore.sqPublicShare.shareCommitment.x,
    ) !== 0
  ) {
    throw SecurityQuestionsError.incorrectAnswer();
  }

  return shareStore;
}
