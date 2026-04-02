[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Main](../index.md) / Response

# Response Type

```ts
type Response<ChannelType, Registrar> =
	ResponseDeclKey extends keyof Registrar[ChannelType]
		? Registrar[ChannelType][ResponseDeclKey] extends EmptyEventParameter
			?
					| {
							Error: Error<ChannelType, Registrar>;
					  }
					| {
							Error: undefined;
					  }
			:
					| {
							Data: Success<ChannelType, Registrar>;
							Error: undefined;
					  }
					| {
							Data: undefined;
							Error: Error<ChannelType, Registrar>;
					  }
		: never;
```

## Type Parameters

### ChannelType

`ChannelType` _extends_ [`Channel`](../../Channel/type-aliases/Channel.md)\<`Registrar`\>

### Registrar

`Registrar` _extends_ [`IRendererRegistrarBase`](../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)
