[electron-reactive-event](../../../../index.md) / [Internal](../../../index.md) / [Serializable](../index.md) / Serializable

# Serializable Type

```ts
type Serializable<Type> = IsSerializable<Type> extends true ? Type : never;
```

## Type Parameters

### Type

`Type`

## Remarks

There do exist edge-case types that are _not_ serializable, yet are not detected by this type.
