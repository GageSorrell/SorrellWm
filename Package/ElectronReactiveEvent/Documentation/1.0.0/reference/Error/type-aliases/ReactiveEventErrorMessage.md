[electron-reactive-event](../../index.md) / [Error](../index.md) / ReactiveEventErrorMessage

# ReactiveEventErrorMessage Type

```ts
type ReactiveEventErrorMessage<PackageKey, ChannelType> =
	ReactiveEventErrorDataInternal<PackageKey, ChannelType>["Message"];
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

### ChannelType

`ChannelType` _extends_ [`Error`](../../Channel/namespaces/Channel/type-aliases/Error.md)\<`PackageKey`, [`EventOwner`](../../Decl/type-aliases/EventOwner.md)\>
