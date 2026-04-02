[electron-reactive-event](../../../../index.md) / [Internal](../../../index.md) / [Serializable](../index.md) / IsSerializable

# IsSerializable Type

```ts
type IsSerializable<Type, SeenType, DepthType> =
	Extract<
		SerializableMemberFlag<Type, SeenType, DepthType>,
		false
	> extends never
		? true
		: false;
```

## Type Parameters

### Type

`Type`

### SeenType

`SeenType` _extends_ `ReadonlyArray`\<`unknown`\> = `ReadonlyArray`\<`unknown`\>

### DepthType

`DepthType` _extends_ `ReadonlyArray`\<`unknown`\> = `ReadonlyArray`\<`unknown`\>
