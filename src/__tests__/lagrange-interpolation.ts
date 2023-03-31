import BN from 'bn.js';
import {lagrangeInterpolation} from '../lagrange-interpolation';

describe('lagrangeInterpolation', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  test('should restore private key', async () => {
    const privateKey = lagrangeInterpolation(
      [
        new BN(
          '59fa608c1eab07826098cd94c3dd07450ca4ba632b98d7285915d0429e96fe3',
          'hex',
        ),
        new BN(
          '63eee228fcd2753b8cb25ccbc624d1bd56118226f25f441be20c7779e2065fe0',
          'hex',
        ),
      ],
      [new BN('14', 'hex'), new BN('0a', 'hex')],
    );

    expect(privateKey.toString('hex')).toEqual(
      'c23e1e4937ba39fef35b2cbe400bd3065b58b8a7b204fac53e8791ef9a234fdd',
    );
  });

  test('should not restore private key', async () => {
    const privateKey = lagrangeInterpolation(
      [
        new BN(
          '59fa608c1eab07826098cd94c3dd07450ca4ba632b98d7285915d0429e96fe3',
          'hex',
        ),
        new BN(
          '63eee228fcd2753b8cb25ccbc624d1bd56118226f25f441be20c7779e2065fe0',
          'hex',
        ),
      ],
      [new BN('15', 'hex'), new BN('0a', 'hex')],
    );

    expect(privateKey.toString('hex')).not.toEqual(
      'c23e1e4937ba39fef35b2cbe400bd3065b58b8a7b204fac53e8791ef9a234fdd',
    );
  });
});
