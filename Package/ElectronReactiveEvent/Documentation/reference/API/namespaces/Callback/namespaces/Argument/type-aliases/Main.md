[electron-reactive-event](../../../../../../index.md) / [API](../../../../../index.md) / [Callback](../../../index.md) / [Argument](../index.md) / Main

# Type Alias: Main\<ChannelType, Registrar\>

```ts
type Main<ChannelType, Registrar> = RequestDeclKey extends keyof Registrar[ChannelType] ? EmptyEventParameter extends Registrar[ChannelType][RequestDeclKey] ? Main : Main & RequestPart<ChannelType, Registrar> : Main;
```

The argument for a callback provided in `main` (*i.e.*, it responds to an event from `renderer`).

## Type Parameters

### ChannelType

`ChannelType` *extends* [`Channel`](../../../../Channel/type-aliases/Channel.md)\<`Registrar`\>

The desired channel of the given [Registrar](#registrar).

### Registrar

`Registrar` *extends* [`IRegistrarBase`](../../../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)

The registrar interface that holds the desired event declaration.
