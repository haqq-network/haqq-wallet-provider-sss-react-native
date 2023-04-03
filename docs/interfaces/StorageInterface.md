[@haqq/provider-sss-react-native - v0.0.6](../README.md) / [Exports](../modules.md) / StorageInterface

# Interface: StorageInterface

## Table of contents

### Methods

- [getItem](StorageInterface.md#getitem)
- [getName](StorageInterface.md#getname)
- [hasItem](StorageInterface.md#hasitem)
- [removeItem](StorageInterface.md#removeitem)
- [setItem](StorageInterface.md#setitem)

## Methods

### getItem

▸ **getItem**(`key`): `Promise`<``null`` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[src/types.ts:4](https://github.com/haqq-network/haqq-wallet-provider-sss-react-native/blob/c0d6e37/src/types.ts#L4)

___

### getName

▸ **getName**(): `string`

#### Returns

`string`

#### Defined in

[src/types.ts:2](https://github.com/haqq-network/haqq-wallet-provider-sss-react-native/blob/c0d6e37/src/types.ts#L2)

___

### hasItem

▸ **hasItem**(`key`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/types.ts:6](https://github.com/haqq-network/haqq-wallet-provider-sss-react-native/blob/c0d6e37/src/types.ts#L6)

___

### removeItem

▸ **removeItem**(`key`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/types.ts:10](https://github.com/haqq-network/haqq-wallet-provider-sss-react-native/blob/c0d6e37/src/types.ts#L10)

___

### setItem

▸ **setItem**(`key`, `value`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/types.ts:8](https://github.com/haqq-network/haqq-wallet-provider-sss-react-native/blob/c0d6e37/src/types.ts#L8)
