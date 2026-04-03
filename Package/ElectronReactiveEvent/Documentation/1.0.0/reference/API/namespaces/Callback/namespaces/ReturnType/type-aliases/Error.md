[electron-reactive-event](../../../../../../index.md) / [API](../../../../../index.md) / [Callback](../../../index.md) / [ReturnType](../index.md) / Error

# Error Type

```ts
type Error<ChannelType, Registrar> =
	ErrorPayloadDeclKey extends keyof Registrar[ChannelType]
		? Registrar[ChannelType][ErrorPayloadDeclKey] extends EmptyEventParameter
			? ErrorSimple<ChannelType, Registrar>
			: ErrorRich<ChannelType, Registrar>
		: never;
```

The type of the `Error` property

## Type Parameters

### ChannelType

`ChannelType` _extends_ [`Channel`](../../../../Channel/type-aliases/Channel.md)\<`Registrar`\>

The desired channel of the given [Registrar](#registrar).

### Registrar

`Registrar` _extends_ [`IRegistrarBase`](../../../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)

The registrar interface that holds the desired event declaration.
