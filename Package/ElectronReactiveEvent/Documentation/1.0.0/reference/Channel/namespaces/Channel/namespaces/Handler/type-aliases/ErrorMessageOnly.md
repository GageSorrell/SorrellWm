[electron-reactive-event](../../../../../../index.md) / [Channel](../../../../../index.md) / [Channel](../../../index.md) / [Handler](../index.md) / ErrorMessageOnly

# ErrorMessageOnly Type

```ts
type ErrorMessageOnly<PackageKey> = Exclude<
	Any<PackageKey>,
	Values<WithErrorPayloadHelper<PackageKey>>
>;
```

[Handler](../index.md) channels whose event declarations define an error _message_ type,
but _not_ an error payload type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

## Type Param

The owner of the event declarations identified by this type.
