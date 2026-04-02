[electron-reactive-event](../../../../index.md) / [Internal](../../../index.md) / [Validation](../index.md) / IsPropertyValid

# IsPropertyValid Type

```ts
type IsPropertyValid<Type, KeyType> = KeyType extends keyof Type
	? IsValid<Type>
	: never;
```

## Type Parameters

### Type

`Type`

### KeyType

`KeyType`
