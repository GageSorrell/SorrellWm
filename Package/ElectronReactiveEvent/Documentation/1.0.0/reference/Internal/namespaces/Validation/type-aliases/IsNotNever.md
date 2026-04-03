[electron-reactive-event](../../../../index.md) / [Internal](../../../index.md) / [Validation](../index.md) / IsNotNever

# IsNotNever Type

```ts
type IsNotNever<Type> = IsNever<Type> extends true ? false : true;
```

## Type Parameters

### Type

`Type`
