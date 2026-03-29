[electron-reactive-event](../../../../../../index.md) / [API](../../../../../index.md) / [Callback](../../../index.md) / [Argument](../index.md) / Renderer

# Type Alias: Renderer\<ChannelType, Registrar\>

```ts
type Renderer<ChannelType, Registrar> = RequestDeclKey extends keyof Registrar[ChannelType] ? EmptyEventParameter extends Registrar[ChannelType][RequestDeclKey] ? Base<Registrar> : Base<Registrar> & RequestPart<ChannelType, Registrar> : Base<Registrar>;
```

The argument for a callback provided in the `renderer` (*i.e.*, it responds to an event from `main`).

## Type Parameters

### ChannelType

`ChannelType` *extends* [`Channel`](../../../../Channel/type-aliases/Channel.md)\<`Registrar`\>

The desired channel of the given [Registrar](#registrar).

### Registrar

`Registrar` *extends* [`IRegistrarBase`](../../../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)

The registrar interface that holds the desired event declaration.
