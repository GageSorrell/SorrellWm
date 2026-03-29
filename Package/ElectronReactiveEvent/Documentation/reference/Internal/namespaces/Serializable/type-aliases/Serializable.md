[electron-reactive-event](../../../../index.md) / [Internal](../../../index.md) / [Serializable](../index.md) / Serializable

# Type Alias: Serializable\<Type\>

```ts
type Serializable<Type> = IsSerializable<Type> extends true ? Type : never;
```

## Type Parameters

### Type

`Type`

## Remarks

There do exist edge-case types that are *not* serializable, yet are not detected by this type.
