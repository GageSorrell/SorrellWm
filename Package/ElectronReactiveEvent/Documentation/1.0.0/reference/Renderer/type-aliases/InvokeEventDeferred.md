[electron-reactive-event](../../index.md) / [Renderer](../index.md) / InvokeEventDeferred

# InvokeEventDeferred() Type

```ts
type InvokeEventDeferred<PackageKey> = {
	<ChannelType>(channel): Promise<ResponseSync<PackageKey, ChannelType>>;
	<ChannelType>(
		channel,
		request,
	): Promise<ResponseSync<PackageKey, ChannelType>>;
};
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

## Call Signature

```ts
<ChannelType>(channel): Promise<ResponseSync<PackageKey, ChannelType>>;
```

### Type Parameters

#### ChannelType

`ChannelType` _extends_ `never`

### Parameters

#### channel

`ChannelType`

### Returns

`Promise`\<[`ResponseSync`](../../Listener/type-aliases/ResponseSync.md)\<`PackageKey`, `ChannelType`\>\>

## Call Signature

```ts
<ChannelType>(channel, request): Promise<ResponseSync<PackageKey, ChannelType>>;
```

### Type Parameters

#### ChannelType

`ChannelType` _extends_ `never`

### Parameters

#### channel

`ChannelType`

#### request

[`Request`](../../Listener/type-aliases/Request.md)\<`PackageKey`, _typeof_ `RendererOwnerValue`, `ChannelType`\>

### Returns

`Promise`\<[`ResponseSync`](../../Listener/type-aliases/ResponseSync.md)\<`PackageKey`, `ChannelType`\>\>
