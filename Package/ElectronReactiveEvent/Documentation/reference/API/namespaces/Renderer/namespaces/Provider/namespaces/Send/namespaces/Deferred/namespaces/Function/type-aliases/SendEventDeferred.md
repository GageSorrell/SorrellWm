[electron-reactive-event](../../../../../../../../../../../../index.md) / [API](../../../../../../../../../../../index.md) / [Renderer](../../../../../../../../../index.md) / [Provider](../../../../../../../index.md) / [Send](../../../../../index.md) / [Deferred](../../../index.md) / [Function](../index.md) / SendEventDeferred

# Type: SendEventDeferred()

```ts
type SendEventDeferred<RendererRegistrar> = {
<ChannelType>  (Channel): Promise<ReturnType<ChannelType, RendererRegistrar>>;
<ChannelType>  (Channel, Event): Promise<ReturnType<ChannelType, RendererRegistrar>>;
};
```

## Type Parameters

### RendererRegistrar

`RendererRegistrar` *extends* [`IRendererRegistrarBase`](../../../../../../../../../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)

## Call Signature

```ts
<ChannelType>(Channel): Promise<ReturnType<ChannelType, RendererRegistrar>>;
```

### Type Parameters

#### ChannelType

`ChannelType` *extends* `WithRequestHelper`\<`RendererRegistrar`\> & `string`

### Parameters

#### Channel

`ChannelType`

### Returns

`Promise`\<[`ReturnType`](../../../type-aliases/ReturnType.md)\<`ChannelType`, `RendererRegistrar`\>\>

## Call Signature

```ts
<ChannelType>(Channel, Event): Promise<ReturnType<ChannelType, RendererRegistrar>>;
```

### Type Parameters

#### ChannelType

`ChannelType` *extends* `string`

### Parameters

#### Channel

`ChannelType`

#### Event

[`Request`](../../../../../../../../../../Event/type-aliases/Request.md)\<`ChannelType`, `RendererRegistrar`\>

### Returns

`Promise`\<[`ReturnType`](../../../type-aliases/ReturnType.md)\<`ChannelType`, `RendererRegistrar`\>\>
