import BN from 'bn.js';
import {Polynomial} from '../polynomial';

jest.mock('@haqq/provider-web3-utils', () => {
  return {
    __esModule: true,
    hashMessage: jest.fn(
      () => '9b7fe0884f96d96dbe3b481e9c69e40f9f5b4430cb9eabe6785c83ef2877922a',
    ),
    generateEntropy: jest
      .fn()
      .mockReturnValueOnce(
        new BN(
          '102b46c993b59f860f5584ce27027fdef88a5d7097f6b0f509ef2068b59c21ba',
          'hex',
        ),
      )
      .mockReturnValueOnce(
        new BN(
          '65eb5869d55919265fa7abe4e93dbea48e4282ccb3ff36426525b7f84cd46036',
          'hex',
        ),
      ),
  };
});

describe('polymonial', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('should initialize', async () => {
    const poly = await Polynomial.initialize(
      new BN(
        'c23e1e4937ba39fef35b2cbe400bd3065b58b8a7b204fac53e8791ef9a234fdd',
        'hex',
      ),
      2,
    );

    expect(poly.getPrivateKey().toString('hex')).toEqual(
      'c23e1e4937ba39fef35b2cbe400bd3065b58b8a7b204fac53e8791ef9a234fdd',
    );

    expect(poly.getShare(new BN('14', 'hex'))).toEqual({
      share: '059fa608c1eab07826098cd94c3dd07450ca4ba632b98d7285915d0429e96fe3',
      shareIndex: '14',
      polynomialID:
        '9b7fe0884f96d96dbe3b481e9c69e40f9f5b4430cb9eabe6785c83ef2877922a',
    });

    expect(poly.getShare(new BN('0a', 'hex'))).toEqual({
      share: '63eee228fcd2753b8cb25ccbc624d1bd56118226f25f441be20c7779e2065fe0',
      shareIndex: 'a',
      polynomialID:
        '9b7fe0884f96d96dbe3b481e9c69e40f9f5b4430cb9eabe6785c83ef2877922a',
    });
  });

  test('should restore', async () => {
    const poly = await Polynomial.fromShares([
      {
        share:
          '59fa608c1eab07826098cd94c3dd07450ca4ba632b98d7285915d0429e96fe3',
        shareIndex: '14',
        polynomialID:
          '9b7fe0884f96d96dbe3b481e9c69e40f9f5b4430cb9eabe6785c83ef2877922a',
      },
      {
        share:
          '63eee228fcd2753b8cb25ccbc624d1bd56118226f25f441be20c7779e2065fe0',
        shareIndex: 'a',
        polynomialID:
          '9b7fe0884f96d96dbe3b481e9c69e40f9f5b4430cb9eabe6785c83ef2877922a',
      },
    ]);

    expect(poly.getPrivateKey().toString('hex')).toEqual(
      'c23e1e4937ba39fef35b2cbe400bd3065b58b8a7b204fac53e8791ef9a234fdd',
    );
  });
});
