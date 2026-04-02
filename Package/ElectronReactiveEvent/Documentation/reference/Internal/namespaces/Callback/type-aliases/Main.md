[electron-reactive-event](../../../../index.md) / [Internal](../../../index.md) / [Callback](../index.md) / Main

# Main() Type

```ts
type Main<ChannelType, Registrar> = (
	Argument,
) => ReturnType<ChannelType, Registrar>;
```

## Type Parameters

### ChannelType

`ChannelType` _extends_ [`Channel`](../../../../API/namespaces/Channel/type-aliases/Channel.md)\<`Registrar`\>

### Registrar

`Registrar` _extends_ [`IRegistrarBase`](../../Registrar/interfaces/IRegistrarBase.md)

## Parameters

### Argument

[`Main`](../namespaces/Argument/type-aliases/Main.md)\<`ChannelType`, `Registrar`\>

## Returns

[`ReturnType`](../../../../API/namespaces/Callback/type-aliases/ReturnType.md)\<`ChannelType`, `Registrar`\>
