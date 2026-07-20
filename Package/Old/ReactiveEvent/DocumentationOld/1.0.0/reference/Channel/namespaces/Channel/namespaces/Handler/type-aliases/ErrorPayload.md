[reactive-event](../../../../../../index.md) / [Channel](../../../../../index.md) / [Channel](../../../index.md) / [Handler](../index.md) / ErrorPayload

# ErrorPayload Type

```ts
type ErrorPayload<PackageKey> = Extract<
	Any<PackageKey>,
	Extract<Values<WithErrorPayloadHelper<PackageKey>>, string>
>;
```

[Handler](../index.md) channels whose event declarations define an error type that
includes a payload type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

## Type Param

The owner of the event declarations identified by this type.
