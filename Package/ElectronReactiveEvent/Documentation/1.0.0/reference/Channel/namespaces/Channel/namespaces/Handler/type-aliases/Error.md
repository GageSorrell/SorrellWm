[electron-reactive-event](../../../../../../index.md) / [Channel](../../../../../index.md) / [Channel](../../../index.md) / [Handler](../index.md) / Error

# Error Type

```ts
type Error<PackageKey> = Extract<
	Any<PackageKey>,
	Extract<Values<WithErrorHelper<PackageKey>>, string>
>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../../../Internal/type-aliases/PackageKeys.md)
