[@haqq/provider-mpc-react-native - v0.0.6](README.md) / Exports

# @haqq/provider-mpc-react-native - v0.0.6

## Table of contents

### Classes

- [Polynomial](classes/Polynomial.md)
- [ProviderMpcReactNative](classes/ProviderMpcReactNative.md)

### Interfaces

- [StorageInterface](interfaces/StorageInterface.md)

### Type Aliases

- [ProviderMpcOptions](modules.md#providermpcoptions)
- [Share](modules.md#share)
- [ShareEncrypted](modules.md#shareencrypted)

### Functions

- [decryptShare](modules.md#decryptshare)
- [encryptShare](modules.md#encryptshare)
- [hashPasswordToBN](modules.md#hashpasswordtobn)
- [lagrangeInterpolation](modules.md#lagrangeinterpolation)

## Type Aliases

### ProviderMpcOptions

Ƭ **ProviderMpcOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account` | `string` |
| `getPassword` | () => `Promise`<`string`\> |
| `storage` | [`StorageInterface`](interfaces/StorageInterface.md) |

#### Defined in

[src/types.ts:13](https://github.com/haqq-network/haqq-wallet-provider-mpc-react-native/blob/c0d6e37/src/types.ts#L13)

___

### Share

Ƭ **Share**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `polynomialID` | `string` |
| `share` | `string` |
| `shareIndex` | `string` |

#### Defined in

[src/types.ts:19](https://github.com/haqq-network/haqq-wallet-provider-mpc-react-native/blob/c0d6e37/src/types.ts#L19)

___

### ShareEncrypted

Ƭ **ShareEncrypted**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `nonce` | `string` |
| `polynomialID` | `string` |
| `publicShare` | `string` |
| `shareIndex` | `string` |

#### Defined in

[src/types.ts:25](https://github.com/haqq-network/haqq-wallet-provider-mpc-react-native/blob/c0d6e37/src/types.ts#L25)

## Functions

### decryptShare

▸ **decryptShare**(`shareEncrypted`, `password`): `Promise`<[`Share`](modules.md#share)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `shareEncrypted` | [`ShareEncrypted`](modules.md#shareencrypted) |
| `password` | `string` |

#### Returns

`Promise`<[`Share`](modules.md#share)\>

#### Defined in

[src/decrypt-share.ts:7](https://github.com/haqq-network/haqq-wallet-provider-mpc-react-native/blob/c0d6e37/src/decrypt-share.ts#L7)

___

### encryptShare

▸ **encryptShare**(`share`, `password`): `Promise`<[`ShareEncrypted`](modules.md#shareencrypted)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `share` | [`Share`](modules.md#share) |
| `password` | `string` |

#### Returns

`Promise`<[`ShareEncrypted`](modules.md#shareencrypted)\>

#### Defined in

[src/encrypt-share.ts:7](https://github.com/haqq-network/haqq-wallet-provider-mpc-react-native/blob/c0d6e37/src/encrypt-share.ts#L7)

___

### hashPasswordToBN

▸ **hashPasswordToBN**(`message`): `Promise`<`BN`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`Promise`<`BN`\>

#### Defined in

[src/hash-password-to-bn.ts:4](https://github.com/haqq-network/haqq-wallet-provider-mpc-react-native/blob/c0d6e37/src/hash-password-to-bn.ts#L4)

___

### lagrangeInterpolation

▸ **lagrangeInterpolation**(`shares`, `nodeIndex`): `BN`

#### Parameters

| Name | Type |
| :------ | :------ |
| `shares` | `BN`[] |
| `nodeIndex` | `BN`[] |

#### Returns

`BN`

#### Defined in

[src/lagrange-interpolation.ts:4](https://github.com/haqq-network/haqq-wallet-provider-mpc-react-native/blob/c0d6e37/src/lagrange-interpolation.ts#L4)
