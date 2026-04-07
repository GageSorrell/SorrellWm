[electron-reactive-event](../../index.md) / [Error](../index.md) / ReactiveEventErrorMessage

# ReactiveEventErrorMessage Type

```ts
type ReactiveEventErrorMessage<PackageKey, ChannelType> =
	ReactiveEventErrorDataInternal<PackageKey, ChannelType>["Message"];
```

The message of an error type, derived from [ReactiveEventErrorDataInternal](ReactiveEventErrorDataInternal.md).

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### ChannelType

`ChannelType` _extends_ [`Error`](../../Channel/namespaces/Channel/type-aliases/Error.md)\<`PackageKey`, [`EventOwner`](../../Decl/type-aliases/EventOwner.md)\>

The channel that uniquely identifies the desired
event declaration.
