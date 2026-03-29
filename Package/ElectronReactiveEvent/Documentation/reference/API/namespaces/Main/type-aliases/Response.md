[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Main](../index.md) / Response

# Type: Response

```ts
type Response<ChannelType, Registrar> = ResponseDeclKey extends keyof Registrar[ChannelType] ? Registrar[ChannelType][ResponseDeclKey] extends EmptyEventParameter ? 
  | {
  Error: Error<ChannelType, Registrar>;
}
  | {
  Error: undefined;
} : 
  | {
  Data: Success<ChannelType, Registrar>;
  Error: undefined;
}
  | {
  Data: undefined;
  Error: Error<ChannelType, Registrar>;
} : never;
```

## Type Parameters

### ChannelType

`ChannelType` *extends* [`Channel`](../../Channel/type-aliases/Channel.md)\<`Registrar`\>

### Registrar

`Registrar` *extends* [`IRendererRegistrarBase`](../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)
