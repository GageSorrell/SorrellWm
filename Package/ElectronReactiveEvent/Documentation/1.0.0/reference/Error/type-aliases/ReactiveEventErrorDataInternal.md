[electron-reactive-event](../../index.md) / [Error](../index.md) / ReactiveEventErrorDataInternal

# ReactiveEventErrorDataInternal Type

```ts
type ReactiveEventErrorDataInternal<PackageKey, ChannelType> = Readonly<
	GetNormalizedError<PackageKey, ChannelType>
>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

### ChannelType

`ChannelType` _extends_ [`Error`](../../Channel/namespaces/Channel/type-aliases/Error.md)\<`PackageKey`, [`EventOwner`](../../Decl/type-aliases/EventOwner.md)\>
