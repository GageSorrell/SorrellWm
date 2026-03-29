[electron-reactive-event](../../../../index.md) / [Internal](../../../index.md) / [Validation](../index.md) / IsNotNever

# Type Alias: IsNotNever\<Type\>

```ts
type IsNotNever<Type> = IsNever<Type> extends true ? false : true;
```

## Type Parameters

### Type

`Type`
