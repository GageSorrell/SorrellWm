[electron-reactive-event](../../../../../../index.md) / [Channel](../../../../../index.md) / [Channel](../../../index.md) / [Handler](../index.md) / ErrorPayload

# ErrorPayload Type

```ts
type ErrorPayload<PackageKey> = Extract<
	Any<PackageKey>,
	Extract<Values<WithErrorPayloadHelper<PackageKey>>, string>
>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../../../Internal/type-aliases/PackageKeys.md)
