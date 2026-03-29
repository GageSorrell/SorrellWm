[electron-reactive-event](../../../../../../../../../../../../index.md) / [API](../../../../../../../../../../../index.md) / [Renderer](../../../../../../../../../index.md) / [Provider](../../../../../../../index.md) / [Send](../../../../../index.md) / [Deferred](../../../index.md) / [Function](../index.md) / SendEventDeferredBase

# Type Alias: SendEventDeferredBase()\<RendererRegistrar\>

```ts
type SendEventDeferredBase<RendererRegistrar> = {
<ChannelType>  (Channel): Promise<ReturnType<Extract<Exclude<keyof RendererRegistrar, number | symbol | "Owner">, Values<WithRequestHelper<RendererRegistrar>>>, RendererRegistrar>>;
<ChannelType>  (Channel, Event): Promise<ReturnType<Extract<Exclude<keyof RendererRegistrar, number | symbol | "Owner">, Values<WithRequestHelper<RendererRegistrar>>>, RendererRegistrar>>;
};
```

## Type Parameters

### RendererRegistrar

`RendererRegistrar` *extends* [`IRendererRegistrarBase`](../../../../../../../../../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)

## Call Signature

```ts
<ChannelType>(Channel): Promise<ReturnType<Extract<Exclude<keyof RendererRegistrar, number | symbol | "Owner">, Values<WithRequestHelper<RendererRegistrar>>>, RendererRegistrar>>;
```

### Type Parameters

#### ChannelType

`ChannelType` *extends* `WithRequestHelper`\<`RendererRegistrar`\> & `string`

### Parameters

#### Channel

`ChannelType`

### Returns

`Promise`\<[`ReturnType`](../../../type-aliases/ReturnType.md)\<`Extract`\<`Exclude`\<keyof `RendererRegistrar`, `number` \| `symbol` \| `"Owner"`\>, [`Values`](../../../../../../../../../../../../Internal/namespaces/Utility/type-aliases/Values.md)\<`WithRequestHelper`\<`RendererRegistrar`\>\>\>, `RendererRegistrar`\>\>

## Call Signature

```ts
<ChannelType>(Channel, Event): Promise<ReturnType<Extract<Exclude<keyof RendererRegistrar, number | symbol | "Owner">, Values<WithRequestHelper<RendererRegistrar>>>, RendererRegistrar>>;
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

`Promise`\<[`ReturnType`](../../../type-aliases/ReturnType.md)\<`Extract`\<`Exclude`\<keyof `RendererRegistrar`, `number` \| `symbol` \| `"Owner"`\>, [`Values`](../../../../../../../../../../../../Internal/namespaces/Utility/type-aliases/Values.md)\<`WithRequestHelper`\<`RendererRegistrar`\>\>\>, `RendererRegistrar`\>\>
