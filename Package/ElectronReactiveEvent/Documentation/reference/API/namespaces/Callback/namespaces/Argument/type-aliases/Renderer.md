[electron-reactive-event](../../../../../../index.md) / [API](../../../../../index.md) / [Callback](../../../index.md) / [Argument](../index.md) / Renderer

# Renderer Type

```ts
type Renderer<ChannelType, Registrar> =
	RequestDeclKey extends keyof Registrar[ChannelType]
		? EmptyEventParameter extends Registrar[ChannelType][RequestDeclKey]
			? Base<Registrar>
			: Base<Registrar> & RequestPart<ChannelType, Registrar>
		: Base<Registrar>;
```

The argument for a callback provided in the `renderer` (_i.e._, it responds to an event from `main`).

## Type Parameters

### ChannelType

`ChannelType` _extends_ [`Channel`](../../../../Channel/type-aliases/Channel.md)\<`Registrar`\>

The desired channel of the given [Registrar](#registrar).

### Registrar

`Registrar` _extends_ [`IRegistrarBase`](../../../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)

The registrar interface that holds the desired event declaration.
