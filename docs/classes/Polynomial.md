[@haqq/provider-mpc-react-native - v0.0.6](../README.md) / [Exports](../modules.md) / Polynomial

# Class: Polynomial

## Table of contents

### Constructors

- [constructor](Polynomial.md#constructor)

### Properties

- [polymonialId](Polynomial.md#polymonialid)
- [shares](Polynomial.md#shares)
- [curveN](Polynomial.md#curven)

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

[src/polynomial.ts:65](https://github.com/haqq-network/haqq-wallet-provider-mpc-react-native/blob/c0d6e37/src/polynomial.ts#L65)

## Properties

### polymonialId

• **polymonialId**: `string`

#### Defined in

[src/polynomial.ts:15](https://github.com/haqq-network/haqq-wallet-provider-mpc-react-native/blob/c0d6e37/src/polynomial.ts#L15)

___

### shares

• **shares**: `BN`[]

#### Defined in

[src/polynomial.ts:14](https://github.com/haqq-network/haqq-wallet-provider-mpc-react-native/blob/c0d6e37/src/polynomial.ts#L14)

___

### curveN

▪ `Static` **curveN**: `BN`

#### Defined in

[src/polynomial.ts:17](https://github.com/haqq-network/haqq-wallet-provider-mpc-react-native/blob/c0d6e37/src/polynomial.ts#L17)

## Methods

### getPrivateKey

▸ **getPrivateKey**(): `BN`

#### Returns

`BN`

#### Defined in

[src/polynomial.ts:70](https://github.com/haqq-network/haqq-wallet-provider-mpc-react-native/blob/c0d6e37/src/polynomial.ts#L70)

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

[src/polynomial.ts:74](https://github.com/haqq-network/haqq-wallet-provider-mpc-react-native/blob/c0d6e37/src/polynomial.ts#L74)

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

[src/polynomial.ts:42](https://github.com/haqq-network/haqq-wallet-provider-mpc-react-native/blob/c0d6e37/src/polynomial.ts#L42)

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

[src/polynomial.ts:22](https://github.com/haqq-network/haqq-wallet-provider-mpc-react-native/blob/c0d6e37/src/polynomial.ts#L22)
