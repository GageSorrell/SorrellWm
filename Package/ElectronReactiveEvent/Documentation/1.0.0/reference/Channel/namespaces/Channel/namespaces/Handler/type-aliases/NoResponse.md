[electron-reactive-event](../../../../../../index.md) / [Channel](../../../../../index.md) / [Channel](../../../index.md) / [Handler](../index.md) / NoResponse

# NoResponse Type

```ts
type NoResponse<PackageKey> = Exclude<
	Any<PackageKey>,
	Extract<Values<WithResponseHelper<PackageKey>>, string>
>;
```

Channels whose event declarations do _not_ define a response type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../../../Internal/type-aliases/PackageKeys.md)
