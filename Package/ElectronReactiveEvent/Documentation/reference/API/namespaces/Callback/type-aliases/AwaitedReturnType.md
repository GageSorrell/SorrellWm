[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Callback](../index.md) / AwaitedReturnType

# Type: AwaitedReturnType

```ts
type AwaitedReturnType<ChannelType, Registrar> = 
  | Success<ChannelType, Registrar>
| Error<ChannelType, Registrar>;
```

## Type Parameters

### ChannelType

`ChannelType` *extends* [`Channel`](../../Channel/type-aliases/Channel.md)\<`Registrar`\>

### Registrar

`Registrar` *extends* [`IRegistrarBase`](../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)
