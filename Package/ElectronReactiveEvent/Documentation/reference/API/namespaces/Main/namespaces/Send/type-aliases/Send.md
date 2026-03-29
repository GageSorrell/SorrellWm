[electron-reactive-event](../../../../../../index.md) / [API](../../../../../index.md) / [Main](../../../index.md) / [Send](../index.md) / Send

# Type: Send()

```ts
type Send<Registrar> = {
<ChannelType, WindowType>  (Channel, Request, BrowserWindows): Promise<ReturnType<ChannelType, WindowType, Registrar>>;
<ChannelType, WindowType>  (Channel, BrowserWindows): Promise<ReturnType<ChannelType, WindowType, Registrar>>;
};
```

## Type Parameters

### Registrar

`Registrar` *extends* [`IRegistrarBase`](../../../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)

## Call Signature

```ts
<ChannelType, WindowType>(
   Channel, 
   Request, 
BrowserWindows): Promise<ReturnType<ChannelType, WindowType, Registrar>>;
```

### Type Parameters

#### ChannelType

`ChannelType` *extends* `string`

#### WindowType

`WindowType` *extends* `BrowserWindow` \| `BrowserWindow`[]

### Parameters

#### Channel

`ChannelType`

#### Request

[`Request`](../../../../Event/type-aliases/Request.md)\<`ChannelType`, `Registrar`\>

#### BrowserWindows

`WindowType`

### Returns

`Promise`\<[`ReturnType`](ReturnType.md)\<`ChannelType`, `WindowType`, `Registrar`\>\>

## Call Signature

```ts
<ChannelType, WindowType>(Channel, BrowserWindows): Promise<ReturnType<ChannelType, WindowType, Registrar>>;
```

### Type Parameters

#### ChannelType

`ChannelType` *extends* `WithRequestHelper`\<`Registrar`\> & `string`

#### WindowType

`WindowType` *extends* `BrowserWindow` \| `BrowserWindow`[]

### Parameters

#### Channel

`ChannelType`

#### BrowserWindows

`WindowType`

### Returns

`Promise`\<[`ReturnType`](ReturnType.md)\<`ChannelType`, `WindowType`, `Registrar`\>\>
