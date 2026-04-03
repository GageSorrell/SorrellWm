[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Callback](../index.md) / Callback

# Callback Type

```ts
type Callback<ChannelType, Registrar> = Registrar extends IRendererRegistrarBase
	? Main<ChannelType, Registrar>
	: Registrar extends IMainRegistrarBase
		? Renderer<ChannelType, Registrar>
		: never;
```

A function that is given to `electron-reactive-event` via one of the `register`
functions or hooks.

## Type Parameters

### ChannelType

`ChannelType` _extends_ [`Channel`](../../Channel/type-aliases/Channel.md)\<`Registrar`\>

The desired channel of the given [Registrar](#registrar).

### Registrar

`Registrar` _extends_ [`IRegistrarBase`](../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)

The registrar interface that holds the desired event declaration.
