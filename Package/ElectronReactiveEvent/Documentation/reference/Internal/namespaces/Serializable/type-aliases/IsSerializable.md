[electron-reactive-event](../../../../index.md) / [Internal](../../../index.md) / [Serializable](../index.md) / IsSerializable

# Type: IsSerializable

```ts
type IsSerializable<Type, SeenType, DepthType> = Extract<SerializableMemberFlag<Type, SeenType, DepthType>, false> extends never ? true : false;
```

## Type Parameters

### Type

`Type`

### SeenType

`SeenType` *extends* `ReadonlyArray`\<`unknown`\> = `ReadonlyArray`\<`unknown`\>

### DepthType

`DepthType` *extends* `ReadonlyArray`\<`unknown`\> = `ReadonlyArray`\<`unknown`\>
