[electron-reactive-event](../../index.md) / [Error](../index.md) / ReactiveEventErrorDataInternal

# ReactiveEventErrorDataInternal Type

```ts
type ReactiveEventErrorDataInternal<PackageKey, ChannelType> = Readonly<
	GetNormalizedError<PackageKey, ChannelType>
>;
```

An error that always has a `Payload` property (it is EmptyOverloadParameter if empty).

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### ChannelType

`ChannelType` _extends_ [`Error`](../../Channel/namespaces/Channel/type-aliases/Error.md)\<`PackageKey`, [`EventOwner`](../../Decl/type-aliases/EventOwner.md)\>

The channel that uniquely identifies the desired
event declaration.
