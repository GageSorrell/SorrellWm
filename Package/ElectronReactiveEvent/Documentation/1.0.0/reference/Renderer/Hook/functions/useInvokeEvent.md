[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / useInvokeEvent

# useInvokeEvent Function

Invoke an event when the containing component mounts.

## Call Signature

```ts
function useInvokeEvent<PackageKey, ChannelType>(channel): never;
```

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

#### ChannelType

`ChannelType` _extends_ `never`

### Parameters

#### channel

`ChannelType`

### Returns

`never`

### Inherit Doc

## Call Signature

```ts
function useInvokeEvent<PackageKey, ChannelType, SuspendsType>(
	channel,
	options,
): SuspendsType extends true
	? ResponseSync<PackageKey, ChannelType>
	: Response<PackageKey, ChannelType>;
```

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

#### ChannelType

`ChannelType` _extends_ `never`

#### SuspendsType

`SuspendsType` _extends_ `boolean`

### Parameters

#### channel

`ChannelType`

#### options

[`InvokeOptions`](../type-aliases/InvokeOptions.md)\<`SuspendsType`\>

### Returns

`SuspendsType` _extends_ `true` ? [`ResponseSync`](../../../Listener/type-aliases/ResponseSync.md)\<`PackageKey`, `ChannelType`\> : [`Response`](../../../Listener/type-aliases/Response.md)\<`PackageKey`, `ChannelType`\>

### Inherit Doc

## Call Signature

```ts
function useInvokeEvent<PackageKey, ChannelType>(channel, request): never;
```

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

#### ChannelType

`ChannelType` _extends_ `never`

### Parameters

#### channel

`ChannelType`

#### request

[`Request`](../../../Listener/type-aliases/Request.md)\<`PackageKey`, _typeof_ `RendererOwnerValue`, `ChannelType`\>

### Returns

`never`

### Inherit Doc

## Call Signature

```ts
function useInvokeEvent<PackageKey, ChannelType, SuspendsType>(
	channel,
	request,
	options,
): SuspendsType extends true
	? ResponseSync<PackageKey, ChannelType>
	: Response<PackageKey, ChannelType>;
```

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

#### ChannelType

`ChannelType` _extends_ `never`

#### SuspendsType

`SuspendsType` _extends_ `boolean`

### Parameters

#### channel

`ChannelType`

#### request

[`Request`](../../../Listener/type-aliases/Request.md)\<`PackageKey`, _typeof_ `RendererOwnerValue`, `ChannelType`\>

#### options

[`InvokeOptions`](../type-aliases/InvokeOptions.md)\<`SuspendsType`\>

### Returns

`SuspendsType` _extends_ `true` ? [`ResponseSync`](../../../Listener/type-aliases/ResponseSync.md)\<`PackageKey`, `ChannelType`\> : [`Response`](../../../Listener/type-aliases/Response.md)\<`PackageKey`, `ChannelType`\>

### Inherit Doc
