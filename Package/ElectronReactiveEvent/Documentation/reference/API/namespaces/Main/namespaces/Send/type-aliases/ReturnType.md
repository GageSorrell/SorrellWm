[electron-reactive-event](../../../../../../index.md) / [API](../../../../../index.md) / [Main](../../../index.md) / [Send](../index.md) / ReturnType

# Type: ReturnType

```ts
type ReturnType<ChannelType, WindowType, Registrar> = WindowType extends BrowserWindow[] ? Response<ChannelType, Registrar>[] : Response<ChannelType, Registrar>;
```

## Type Parameters

### ChannelType

`ChannelType` *extends* 
  \| `Extract`\<
  \| [`Request`](../../../../Channel/type-aliases/Request.md)\<`Registrar`\>
  \| [`NoRequest`](../../../../Channel/type-aliases/NoRequest.md)\<`Registrar`\>, [`Channel`](../../../../Channel/type-aliases/Channel.md)\<`Registrar`\>\>

### WindowType

`WindowType` *extends* `BrowserWindow` \| `BrowserWindow`[]

### Registrar

`Registrar` *extends* [`IRegistrarBase`](../../../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)
