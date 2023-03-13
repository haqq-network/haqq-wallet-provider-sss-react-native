import {hashMessage} from '@haqq/provider-web3-utils';
import BN from 'bn.js';

export async function hashPasswordToBN(message: string) {
  const hashed = await hashMessage(message);
  return new BN(hashed, 'hex');
}
