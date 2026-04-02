[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Callback](../index.md) / EventRecord

# EventRecord Type

```ts
type EventRecord<ChannelType, Registrar> = {
	[Key in ChannelType]: Registrar extends IMainRegistrarBase
		? Renderer<Key, Registrar>
		: Registrar extends IRendererRegistrarBase
			? Main<Key, Registrar>
			: never;
};
```

A record of callbacks, such that the keys are `Channel`s, and the values
are callbacks for event declarations given by their respective keys

## Type Parameters

### ChannelType

`ChannelType` _extends_ [`Channel`](../../Channel/type-aliases/Channel.md)\<`Registrar`\>

The desired channel of the given [Registrar](#registrar).

### Registrar

`Registrar` _extends_ [`IRegistrarBase`](../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)

The registrar interface that holds the desired event declaration.
