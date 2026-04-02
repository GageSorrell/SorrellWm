[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Callback](../index.md) / AwaitedReturnType

# AwaitedReturnType Type

```ts
type AwaitedReturnType<ChannelType, Registrar> =
	| Success<ChannelType, Registrar>
	| Error<ChannelType, Registrar>;
```

## Type Parameters

### ChannelType

`ChannelType` _extends_ [`Channel`](../../Channel/type-aliases/Channel.md)\<`Registrar`\>

### Registrar

`Registrar` _extends_ [`IRegistrarBase`](../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)
