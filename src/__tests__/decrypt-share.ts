import {decryptShare} from '../decrypt-share';
import {accountInfo} from '@haqq/provider-web3-utils';

jest.mock('@haqq/provider-web3-utils', () => {
  return {
    __esModule: true,
    hashMessage: jest.fn(
      () => '9b7fe0884f96d96dbe3b481e9c69e40f9f5b4430cb9eabe6785c83ef2877922a',
    ),
    accountInfo: jest.fn(() => ({
      address: '0x2F2C00811584B876Bba414d95979034685a047ba',
      publicKey:
        '0x03aa8ca1dbf3de930843e9fc49e3d6b41718c2dc53884374e7a94cdbb4838bdf3e',
    })),
  };
});
describe('encryptShare', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  test('should decrypt share', async () => {
    const share = await decryptShare(
      {
        nonce:
          '6a1fc5807253d70a67ce44baafd3ec636c1de45c166381c7cd0737a1d1a81efa',
        polynomialID: '',
        publicShare:
          '0x03aa8ca1dbf3de930843e9fc49e3d6b41718c2dc53884374e7a94cdbb4838bdf3e',
        shareIndex: '14',
      },
      'qwerty',
    );

    expect(share).toEqual({
      share: '59fa608c1eab07826098cd94c3dd07450ca4ba632b98d7285915d0429e96fe3',
      shareIndex: '14',
      polynomialID: '',
    });

    expect(accountInfo).toBeCalledWith(
      '59fa608c1eab07826098cd94c3dd07450ca4ba632b98d7285915d0429e96fe3',
    );
  });
});
