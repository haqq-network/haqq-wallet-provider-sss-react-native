import BN from 'bn.js';
import {curveN} from './constants';

export function lagrangeInterpolation(shares: BN[], nodeIndex: BN[]): BN {
  let secret = new BN(0);
  for (let i = 0; i < shares.length; i += 1) {
    let upper = new BN(1);
    let lower = new BN(1);
    for (let j = 0; j < shares.length; j += 1) {
      if (i !== j) {
        upper = upper.mul(nodeIndex[j].neg()).umod(curveN);
        let temp = nodeIndex[i].sub(nodeIndex[j]);
        temp = temp.umod(curveN);
        lower = lower.mul(temp).umod(curveN);
      }
    }
    let delta = upper.mul(lower.invm(curveN)).umod(curveN);
    delta = delta.mul(shares[i]).umod(curveN);
    secret = secret.add(delta);
  }
  return secret.umod(curveN);
}
