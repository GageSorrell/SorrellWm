[electron-reactive-event](../../index.md) / [Error](../index.md) / ReactiveEventErrorPayload

# ReactiveEventErrorPayload Type

```ts
type ReactiveEventErrorPayload<PackageKey, ChannelType> =
	ReactiveEventErrorDataInternal<PackageKey, ChannelType>["Payload"];
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

### ChannelType

`ChannelType` _extends_ [`Error`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Error.md)\<`PackageKey`\>
