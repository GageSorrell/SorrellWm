[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Event](../index.md) / Request

# Type Alias: Request\<ChannelType, Registrar\>

```ts
type Request<ChannelType, Registrar> = ChannelType extends keyof Registrar ? RequestDeclKey extends keyof Registrar[ChannelType] ? EmptyEventParameter extends Registrar[ChannelType][RequestDeclKey] ? never : Registrar[ChannelType][RequestDeclKey] : never : never;
```

This is the type that the developer will provide when firing events.
It varies from the type that is sent via IPC.

## Type Parameters

### ChannelType

`ChannelType` *extends* [`Channel`](../../Channel/type-aliases/Channel.md)\<`Registrar`\>

The desired channel of the given [Registrar](#registrar).

### Registrar

`Registrar` *extends* [`IRegistrarBase`](../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)

The registrar interface that holds the desired event declaration.
