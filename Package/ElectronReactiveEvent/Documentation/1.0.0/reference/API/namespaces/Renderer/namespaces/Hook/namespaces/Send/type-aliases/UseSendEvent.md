[electron-reactive-event](../../../../../../../../index.md) / [API](../../../../../../../index.md) / [Renderer](../../../../../index.md) / [Hook](../../../index.md) / [Send](../index.md) / UseSendEvent

# UseSendEvent() Type

```ts
type UseSendEvent<RendererRegistrar> = {
	<ChannelType>(
		Channel,
		Event,
		Suspend?,
	): UseSendEventReturn<ChannelType, RendererRegistrar>;
	<ChannelType>(Channel): UseSendEventReturn<ChannelType, RendererRegistrar>;
	<ChannelType>(
		Channel,
		Event,
		Suspend,
	): UseSendEventReturn<ChannelType, RendererRegistrar>;
};
```

## Type Parameters

### RendererRegistrar

`RendererRegistrar` _extends_ [`IRendererRegistrarBase`](../../../../../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)

The [registrar](/articles/glossary.html#registrar) that holds your

## Call Signature

```ts
<ChannelType>(
   Channel,
   Event,
Suspend?): UseSendEventReturn<ChannelType, RendererRegistrar>;
```

### Type Parameters

#### ChannelType

`ChannelType` _extends_ `string`

### Parameters

#### Channel

`ChannelType`

#### Event

[`Request`](../../../../../../Event/type-aliases/Request.md)\<`ChannelType`, `RendererRegistrar`\>

#### Suspend?

`boolean`

### Returns

[`UseSendEventReturn`](UseSendEventReturn.md)\<`ChannelType`, `RendererRegistrar`\>

## Call Signature

```ts
<ChannelType>(Channel): UseSendEventReturn<ChannelType, RendererRegistrar>;
```

### Type Parameters

#### ChannelType

`ChannelType` _extends_ `WithRequestHelper`\<`RendererRegistrar`\> & `string`

### Parameters

#### Channel

`ChannelType`

### Returns

[`UseSendEventReturn`](UseSendEventReturn.md)\<`ChannelType`, `RendererRegistrar`\>

## Call Signature

```ts
<ChannelType>(
   Channel,
   Event,
Suspend): UseSendEventReturn<ChannelType, RendererRegistrar>;
```

### Type Parameters

#### ChannelType

`ChannelType` _extends_ `WithRequestHelper`\<`RendererRegistrar`\> & `string`

### Parameters

#### Channel

`ChannelType`

#### Event

`undefined`

#### Suspend

`boolean`

### Returns

[`UseSendEventReturn`](UseSendEventReturn.md)\<`ChannelType`, `RendererRegistrar`\>

## TODO

Finish writing this comment.

## Returns
