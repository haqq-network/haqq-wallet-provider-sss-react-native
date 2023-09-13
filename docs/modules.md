[@haqq/provider-sss-react-native - v0.0.10](README.md) / Exports

# @haqq/provider-sss-react-native - v0.0.10

## Table of contents

### Classes

- [Polynomial](classes/Polynomial.md)
- [ProviderSSSReactNative](classes/ProviderSSSReactNative.md)

### Interfaces

- [StorageInterface](interfaces/StorageInterface.md)

### Type Aliases

- [ProviderSSSOptions](modules.md#providersssoptions)
- [Share](modules.md#share)
- [ShareEncrypted](modules.md#shareencrypted)

### Functions

- [lagrangeInterpolation](modules.md#lagrangeinterpolation)

## Type Aliases

### ProviderSSSOptions

Ƭ **ProviderSSSOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `account` | `string` |
| `getPassword` | () => `Promise`<`string`\> |
| `storage` | [`StorageInterface`](interfaces/StorageInterface.md) |

#### Defined in

[src/types.ts:13](https://github.com/haqq-network/haqq-wallet-provider-sss-react-native/blob/1f46277/src/types.ts#L13)

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

[src/types.ts:19](https://github.com/haqq-network/haqq-wallet-provider-sss-react-native/blob/1f46277/src/types.ts#L19)

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

[src/types.ts:25](https://github.com/haqq-network/haqq-wallet-provider-sss-react-native/blob/1f46277/src/types.ts#L25)

## Functions

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

[src/lagrange-interpolation.ts:4](https://github.com/haqq-network/haqq-wallet-provider-sss-react-native/blob/1f46277/src/lagrange-interpolation.ts#L4)
