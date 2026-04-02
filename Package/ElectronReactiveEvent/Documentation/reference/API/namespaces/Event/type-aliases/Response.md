[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Event](../index.md) / Response

# Response Type

```ts
type Response<ChannelType, Registrar> =
	ResponseDeclKey extends keyof Registrar[ChannelType]
		? Registrar[ChannelType][ResponseDeclKey]
		: never;
```

This is the type that the developer will return in their callbacks.
It varies from the type that is sent via IPC.

## Type Parameters

### ChannelType

`ChannelType` _extends_ [`Channel`](../../Channel/type-aliases/Channel.md)\<`Registrar`\>

The desired channel of the given [Registrar](#registrar).

### Registrar

`Registrar` _extends_ [`IRegistrarBase`](../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)

The registrar interface that holds the desired event declaration.
