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

The type received by `main` callbacks.

This corresponds&mdash;but is not identical to&mdash;the request types of
events sent by the `renderer`.

## Type Parameters

### ChannelType

`ChannelType` _extends_ [`Channel`](../../Channel/type-aliases/Channel.md)\<`Registrar`\>

The desired channel of the given [Registrar](#registrar).

### Registrar

`Registrar` _extends_ [`IRendererRegistrarBase`](../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)

The registrar interface that holds the desired event declaration.
