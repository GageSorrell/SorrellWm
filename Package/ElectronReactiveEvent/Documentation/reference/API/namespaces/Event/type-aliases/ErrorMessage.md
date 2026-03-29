[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Event](../index.md) / ErrorMessage

# Type: ErrorMessage

```ts
type ErrorMessage<ChannelType, Registrar> = ErrorMessageDeclKey extends keyof Registrar[ChannelType] ? Registrar[ChannelType][ErrorMessageDeclKey] : never;
```

For a given event declaration, this is the error message type.  It always extends `string`.

## Type Parameters

### ChannelType

`ChannelType` *extends* [`Channel`](../../Channel/type-aliases/Channel.md)\<`Registrar`\>

The desired channel of the given [Registrar](#registrar).

### Registrar

`Registrar` *extends* [`IRegistrarBase`](../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)

The registrar interface that holds the desired event declaration.
