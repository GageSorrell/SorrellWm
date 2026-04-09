[electron-reactive-event](../../index.md) / [Error](../index.md) / ReactiveEventErrorPayload

# ReactiveEventErrorPayload Type

```ts
type ReactiveEventErrorPayload<PackageKey, ChannelType> =
	ReactiveEventErrorDataInternal<PackageKey, ChannelType>["Payload"];
```

The payload of an error type, derived from [ReactiveEventErrorDataInternal](ReactiveEventErrorDataInternal.md).
It is [EmptyOverloadParameter](../../Listener/type-aliases/EmptyOverloadParameter.md) if the event declaration has no error payload type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### ChannelType

`ChannelType` _extends_ [`Error`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Error.md)\<`PackageKey`\>

The channel that uniquely identifies the desired
event declaration.
