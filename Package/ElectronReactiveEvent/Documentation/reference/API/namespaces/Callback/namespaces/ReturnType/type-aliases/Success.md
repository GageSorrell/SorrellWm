[electron-reactive-event](../../../../../../index.md) / [API](../../../../../index.md) / [Callback](../../../index.md) / [ReturnType](../index.md) / Success

# Success Type

```ts
type Success<ChannelType, Registrar> =
	ResponseDeclKey extends keyof Registrar[ChannelType]
		? Registrar[ChannelType][ResponseDeclKey] extends EmptyEventParameter
			? void
			: Response<ChannelType, Registrar>
		: never;
```

## Type Parameters

### ChannelType

`ChannelType` _extends_ [`Channel`](../../../../Channel/type-aliases/Channel.md)\<`Registrar`\>

### Registrar

`Registrar` _extends_ [`IRegistrarBase`](../../../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)
