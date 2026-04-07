[electron-reactive-event](../../../../../../index.md) / [Channel](../../../../../index.md) / [Channel](../../../index.md) / [Handler](../index.md) / NoError

# NoError Type

```ts
type NoError<PackageKey> = Exclude<
	Any<PackageKey>,
	Extract<Values<WithErrorHelper<PackageKey>>, string>
>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../../../Internal/type-aliases/PackageKeys.md)
