[@haqq/provider-sss-react-native - v0.0.10](../README.md) / [Exports](../modules.md) / Polynomial

# Class: Polynomial

## Table of contents

### Constructors

- [constructor](Polynomial.md#constructor)

### Properties

- [polymonialId](Polynomial.md#polymonialid)
- [shares](Polynomial.md#shares)

### Methods

- [getPrivateKey](Polynomial.md#getprivatekey)
- [getShare](Polynomial.md#getshare)
- [fromShares](Polynomial.md#fromshares)
- [initialize](Polynomial.md#initialize)

## Constructors

### constructor

• **new Polynomial**(`shares`, `polymonialId?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `shares` | `BN`[] | `undefined` |
| `polymonialId` | `string` | `''` |

#### Defined in

[src/polynomial.ts:61](https://github.com/haqq-network/haqq-wallet-provider-sss-react-native/blob/1f46277/src/polynomial.ts#L61)

## Properties

### polymonialId

• **polymonialId**: `string`

#### Defined in

[src/polynomial.ts:16](https://github.com/haqq-network/haqq-wallet-provider-sss-react-native/blob/1f46277/src/polynomial.ts#L16)

___

### shares

• **shares**: `BN`[]

#### Defined in

[src/polynomial.ts:15](https://github.com/haqq-network/haqq-wallet-provider-sss-react-native/blob/1f46277/src/polynomial.ts#L15)

## Methods

### getPrivateKey

▸ **getPrivateKey**(): `BN`

#### Returns

`BN`

#### Defined in

[src/polynomial.ts:66](https://github.com/haqq-network/haqq-wallet-provider-sss-react-native/blob/1f46277/src/polynomial.ts#L66)

___

### getShare

▸ **getShare**(`x`): [`Share`](../modules.md#share)

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `string` \| `BN` |

#### Returns

[`Share`](../modules.md#share)

#### Defined in

[src/polynomial.ts:70](https://github.com/haqq-network/haqq-wallet-provider-sss-react-native/blob/1f46277/src/polynomial.ts#L70)

___

### fromShares

▸ `Static` **fromShares**(`shares`): `Promise`<[`Polynomial`](Polynomial.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `shares` | [`Share`](../modules.md#share)[] |

#### Returns

`Promise`<[`Polynomial`](Polynomial.md)\>

#### Defined in

[src/polynomial.ts:38](https://github.com/haqq-network/haqq-wallet-provider-sss-react-native/blob/1f46277/src/polynomial.ts#L38)

___

### initialize

▸ `Static` **initialize**(`privateKey`, `threshold`): `Promise`<[`Polynomial`](Polynomial.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | ``null`` \| `BN` \| `Buffer` |
| `threshold` | `number` |

#### Returns

`Promise`<[`Polynomial`](Polynomial.md)\>

#### Defined in

[src/polynomial.ts:18](https://github.com/haqq-network/haqq-wallet-provider-sss-react-native/blob/1f46277/src/polynomial.ts#L18)
