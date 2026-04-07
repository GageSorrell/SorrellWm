[electron-reactive-event](../../../../../../index.md) / [Channel](../../../../../index.md) / [Channel](../../../index.md) / [Handler](../index.md) / ErrorMessage

# ErrorMessage Type

```ts
type ErrorMessage<PackageKey> = Exclude<
	Any<PackageKey>,
	Values<WithErrorPayloadHelper<PackageKey>>
>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../../../Internal/type-aliases/PackageKeys.md)
