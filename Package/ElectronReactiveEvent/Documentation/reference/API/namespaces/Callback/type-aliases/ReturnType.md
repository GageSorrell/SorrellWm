[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Callback](../index.md) / ReturnType

# Type Alias: ReturnType\<ChannelType, Registrar\>

```ts
type ReturnType<ChannelType, Registrar> = Registrar extends IMainRegistrarBase ? AwaitedReturnType<ChannelType, Registrar> : Registrar extends IRendererRegistrarBase ? Promise<AwaitedReturnType<ChannelType, Registrar>> : never;
```

This is the type that a `Callback` function must return.

This type is different from what is returned by `Send` and `useSend`.
Namely, the distinction is that your callbacks only need to return
exactly one of,

    * the response data
    * the response error
    * nothing at all (`void`).

The last case should occur precisely when your event completes successfully,
and its event declaration has no response type (*i.e.*, `EmptyEventParameter`).

`electron-reactive-event` takes the values returned by your callbacks,
and coverts them into the uniform shape for the receiver.

## Type Parameters

### ChannelType

`ChannelType` *extends* [`Channel`](../../Channel/type-aliases/Channel.md)\<`Registrar`\>

### Registrar

`Registrar` *extends* [`IRegistrarBase`](../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)
