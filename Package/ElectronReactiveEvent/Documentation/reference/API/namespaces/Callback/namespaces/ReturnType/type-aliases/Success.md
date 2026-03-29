[electron-reactive-event](../../../../../../index.md) / [API](../../../../../index.md) / [Callback](../../../index.md) / [ReturnType](../index.md) / Success

# Type: Success

```ts
type Success<ChannelType, Registrar> = ResponseDeclKey extends keyof Registrar[ChannelType] ? Registrar[ChannelType][ResponseDeclKey] extends EmptyEventParameter ? void : Response<ChannelType, Registrar> : never;
```

## Type Parameters

### ChannelType

`ChannelType` *extends* [`Channel`](../../../../Channel/type-aliases/Channel.md)\<`Registrar`\>

### Registrar

`Registrar` *extends* [`IRegistrarBase`](../../../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)
