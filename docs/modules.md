[@haqq/provider-mpc-react-native - v0.0.9](README.md) / Exports

# @haqq/provider-mpc-react-native - v0.0.9

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

[src/types.ts:13](https://github.com/haqq-network/haqq-wallet-provider-mpc-react-native/blob/a5c6066/src/types.ts#L13)

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

[src/types.ts:19](https://github.com/haqq-network/haqq-wallet-provider-mpc-react-native/blob/a5c6066/src/types.ts#L19)

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

[src/types.ts:25](https://github.com/haqq-network/haqq-wallet-provider-mpc-react-native/blob/a5c6066/src/types.ts#L25)

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

[src/lagrange-interpolation.ts:4](https://github.com/haqq-network/haqq-wallet-provider-mpc-react-native/blob/a5c6066/src/lagrange-interpolation.ts#L4)
