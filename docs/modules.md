[@haqq/provider-sss-react-native - v0.0.2](README.md) / Exports

# @haqq/provider-sss-react-native - v0.0.2

## Table of contents

### Classes

- [ProviderMpcReactNative](classes/ProviderMpcReactNative.md)

### Interfaces

- [StorageInterface](interfaces/StorageInterface.md)

### Type Aliases

- [ProviderMpcOptions](modules.md#providersssoptions)

### Functions

- [initializeTKey](modules.md#initializetkey)

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

[src/types.ts:13](https://github.com/haqq-network/haqq-wallet-provider-sss-react-native/blob/120ddee/src/types.ts#L13)

## Functions

### initializeTKey

▸ **initializeTKey**(`postboxKey`, `serviceProviderOptions`, `storageOptions`): `Promise`<{ `securityQuestionsModule`: `SecurityQuestionsModule` ; `tKey`: `ThresholdKey`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `postboxKey` | `string` |
| `serviceProviderOptions` | `ServiceProviderArgs` |
| `storageOptions` | `TorusStorageLayerArgs` |

#### Returns

`Promise`<{ `securityQuestionsModule`: `SecurityQuestionsModule` ; `tKey`: `ThresholdKey`  }\>

#### Defined in

[src/initialize-tkey.ts:10](https://github.com/haqq-network/haqq-wallet-provider-sss-react-native/blob/120ddee/src/initialize-tkey.ts#L10)
