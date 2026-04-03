[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Callback](../index.md) / Main

# Main() Type

```ts
type Main<ChannelType, Registrar> = (
	Argument,
) => ReturnType<ChannelType, Registrar>;
```

`MainCallback`s live under `main`, _i.e._, they receive `renderer` events.

## Type Parameters

### ChannelType

`ChannelType` _extends_ [`Channel`](../../Channel/type-aliases/Channel.md)\<`Registrar`\>

### Registrar

`Registrar` _extends_ [`IRendererRegistrarBase`](../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)

## Parameters

### Argument

[`Main`](../namespaces/Argument/type-aliases/Main.md)\<`ChannelType`, `Registrar`\>

## Returns

[`ReturnType`](ReturnType.md)\<`ChannelType`, `Registrar`\>
