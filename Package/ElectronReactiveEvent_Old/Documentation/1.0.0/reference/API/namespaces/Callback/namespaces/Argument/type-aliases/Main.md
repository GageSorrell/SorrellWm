[electron-reactive-event](../../../../../../index.md) / [API](../../../../../index.md) / [Callback](../../../index.md) / [Argument](../index.md) / Main

# Main Type

```ts
type Main<ChannelType, Registrar> =
	RequestDeclKey extends keyof Registrar[ChannelType]
		? EmptyEventParameter extends Registrar[ChannelType][RequestDeclKey]
			? Main
			: Main & RequestPart<ChannelType, Registrar>
		: Main;
```

The argument for a callback provided in `main` (_i.e._, it responds to an event from `renderer`).

## Type Parameters

### ChannelType

`ChannelType` _extends_ [`Channel`](../../../../Channel/type-aliases/Channel.md)\<`Registrar`\>

The desired channel of the given [Registrar](#registrar).

### Registrar

`Registrar` _extends_ [`IRegistrarBase`](../../../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)

The registrar interface that holds the desired event declaration.
