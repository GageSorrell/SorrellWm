[electron-reactive-event](../../../../../../index.md) / [Channel](../../../../../index.md) / [Channel](../../../index.md) / [Handler](../index.md) / NoError

# NoError Type

```ts
type NoError<PackageKey> = Exclude<
	Any<PackageKey>,
	Extract<Values<WithErrorHelper<PackageKey>>, string>
>;
```

[Handler](../index.md) channels whose event declarations do _not_ define an error type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

## Type Param

The owner of the event declarations identified by this type.
