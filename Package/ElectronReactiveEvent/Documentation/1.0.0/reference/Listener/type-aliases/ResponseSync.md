[electron-reactive-event](../../index.md) / [Listener](../index.md) / ResponseSync

# ResponseSync Type

```ts
type ResponseSync<PackageKey, ChannelType> = IpcEventPart<IpcRendererEvent> &
  | ResponseSuccess<PackageKey, ChannelType>
| ResponseError<PackageKey, ChannelType>;
```

The type returned to the `renderer` by a [Handler](Handler.md) when the
InvokeOptions.suspend \| suspend option is passed via InvokeOptions,
or when InvokeEventDeferred is called.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### ChannelType

`ChannelType` _extends_ [`Response`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Response.md)\<`PackageKey`\>

The channel that uniquely identifies the desired
event declaration.
