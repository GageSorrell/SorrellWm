[electron-reactive-event](../../../../../../../../../../../../index.md) / [API](../../../../../../../../../../../index.md) / [Renderer](../../../../../../../../../index.md) / [Provider](../../../../../../../index.md) / [Send](../../../../../index.md) / [Deferred](../../../index.md) / [Function](../index.md) / SendEventDeferred

# SendEventDeferred() Type

```ts
type SendEventDeferred<RendererRegistrar> = {
	<ChannelType>(Channel): Promise<ReturnType<ChannelType, RendererRegistrar>>;
	<ChannelType>(
		Channel,
		Event,
	): Promise<ReturnType<ChannelType, RendererRegistrar>>;
};
```

## Type Parameters

### RendererRegistrar

`RendererRegistrar` _extends_ [`IRendererRegistrarBase`](../../../../../../../../../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)

## Call Signature

```ts
<ChannelType>(Channel): Promise<ReturnType<ChannelType, RendererRegistrar>>;
```

### Type Parameters

#### ChannelType

`ChannelType` _extends_ `WithRequestHelper`\<`RendererRegistrar`\> & `string`

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

`ChannelType` _extends_ `string`

### Parameters

#### Channel

`ChannelType`

#### Event

[`Request`](../../../../../../../../../../Event/type-aliases/Request.md)\<`ChannelType`, `RendererRegistrar`\>

### Returns

`Promise`\<[`ReturnType`](../../../type-aliases/ReturnType.md)\<`ChannelType`, `RendererRegistrar`\>\>
