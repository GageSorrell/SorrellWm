[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Event](../index.md) / Response

# Type: Response

```ts
type Response<ChannelType, Registrar> = ResponseDeclKey extends keyof Registrar[ChannelType] ? Registrar[ChannelType][ResponseDeclKey] : never;
```

This is the type that the developer will return in their callbacks.
It varies from the type that is sent via IPC.

## Type Parameters

### ChannelType

`ChannelType` *extends* [`Channel`](../../Channel/type-aliases/Channel.md)\<`Registrar`\>

The desired channel of the given [Registrar](#registrar).

### Registrar

`Registrar` *extends* [`IRegistrarBase`](../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)

The registrar interface that holds the desired event declaration.
