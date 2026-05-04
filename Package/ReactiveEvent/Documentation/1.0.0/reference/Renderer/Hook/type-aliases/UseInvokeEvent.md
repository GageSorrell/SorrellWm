[reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / UseInvokeEvent

# UseInvokeEvent Type

```ts
type UseInvokeEvent<PackageKey> = {
	<ChannelType>(channel): Response<PackageKey, ChannelType>;
	<ChannelType, SuspendsType>(
		channel,
		options,
	): SuspendsType extends true
		? ResponseSync<PackageKey, ChannelType>
		: Response<PackageKey, ChannelType>;
	<ChannelType>(channel, request): Response<PackageKey, ChannelType>;
	<ChannelType, SuspendsType>(
		channel,
		request,
		options,
	): SuspendsType extends true
		? ResponseSync<PackageKey, ChannelType>
		: Response<PackageKey, ChannelType>;
};
```

Invoke an event when the containing component mounts.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

## Call Signature

```ts
<ChannelType>(channel): Response<PackageKey, ChannelType>;
```

Invoke an event when the containing component mounts, whose event declaration
does _not_ define a request type.

### Type Parameters

#### ChannelType

`ChannelType` _extends_ `never`

The channel that uniquely identifies the desired
event declaration.

### Parameters

#### channel

`ChannelType`

The channel of the event that you wish to invoke.

### Returns

[`Response`](../../../Listener/type-aliases/Response.md)\<`PackageKey`, `ChannelType`\>

The result returned by `main`.

## Call Signature

```ts
<ChannelType, SuspendsType>(channel, options): SuspendsType extends true ? ResponseSync<PackageKey, ChannelType> : Response<PackageKey, ChannelType>;
```

Invoke an event when the containing component mounts, whose event declaration
does _not_ defines a request type.

### Type Parameters

#### ChannelType

`ChannelType` _extends_ `never`

The channel that uniquely identifies the desired
event declaration.

#### SuspendsType

`SuspendsType` _extends_ `boolean`

### Parameters

#### channel

`ChannelType`

The channel of the event that you wish to invoke.

#### options

[`InvokeOptions`](InvokeOptions.md)\<`SuspendsType`\>

Specify whether this hook should suspend the containing component
until `main` returns a response.

### Returns

`SuspendsType` _extends_ `true` ? [`ResponseSync`](../../../Listener/type-aliases/ResponseSync.md)\<`PackageKey`, `ChannelType`\> : [`Response`](../../../Listener/type-aliases/Response.md)\<`PackageKey`, `ChannelType`\>

The result returned by `main`.

## Call Signature

```ts
<ChannelType>(channel, request): Response<PackageKey, ChannelType>;
```

Invoke an event when the containing component mounts, whose event declaration
defines a request type.

### Type Parameters

#### ChannelType

`ChannelType` _extends_ `never`

The channel that uniquely identifies the desired
event declaration.

### Parameters

#### channel

`ChannelType`

The channel of the event that you wish to invoke.

#### request

[`EventRequest`](../../../Listener/type-aliases/EventRequest.md)\<`PackageKey`, _typeof_ `RendererOwnerValue`, `ChannelType`\>

The request of this event.

### Returns

[`Response`](../../../Listener/type-aliases/Response.md)\<`PackageKey`, `ChannelType`\>

The result returned by `main`.

## Call Signature

```ts
<ChannelType, SuspendsType>(
   channel,
   request,
options): SuspendsType extends true ? ResponseSync<PackageKey, ChannelType> : Response<PackageKey, ChannelType>;
```

Invoke an event when the containing component mounts, whose event declaration
defines a request type.

### Type Parameters

#### ChannelType

`ChannelType` _extends_ `never`

The channel that uniquely identifies the desired
event declaration.

#### SuspendsType

`SuspendsType` _extends_ `boolean`

### Parameters

#### channel

`ChannelType`

The channel of the event that you wish to invoke.

#### request

[`EventRequest`](../../../Listener/type-aliases/EventRequest.md)\<`PackageKey`, _typeof_ `RendererOwnerValue`, `ChannelType`\>

The request of this event.

#### options

[`InvokeOptions`](InvokeOptions.md)\<`SuspendsType`\>

Specify whether this hook should suspend the containing component
until `main` returns a response.

### Returns

`SuspendsType` _extends_ `true` ? [`ResponseSync`](../../../Listener/type-aliases/ResponseSync.md)\<`PackageKey`, `ChannelType`\> : [`Response`](../../../Listener/type-aliases/Response.md)\<`PackageKey`, `ChannelType`\>

The result returned by `main`.
