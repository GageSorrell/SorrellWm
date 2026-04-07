[electron-reactive-event](../../index.md) / [Listener](../index.md) / ResponseSync

# ResponseSync Type

```ts
type ResponseSync<PackageKey, ChannelType> = IpcEventPart<IpcRendererEvent> &
  | ResponseSuccess<PackageKey, ChannelType>
| ResponseError<PackageKey, ChannelType>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

### ChannelType

`ChannelType` _extends_ [`Response`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Response.md)\<`PackageKey`\>
