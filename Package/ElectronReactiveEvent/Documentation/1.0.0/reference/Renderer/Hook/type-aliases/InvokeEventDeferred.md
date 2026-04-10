[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / InvokeEventDeferred

# InvokeEventDeferred Type

```ts
type InvokeEventDeferred<PackageKey> = {
	<ChannelType>(channel): Promise<ResponseSync<PackageKey, ChannelType>>;
	<ChannelType>(
		channel,
		request,
	): Promise<ResponseSync<PackageKey, ChannelType>>;
};
```

The function that allows `renderer` events to be invoked at a time other than
[onMount](https://react.dev/reference/react/useEffect) of the containing
component.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

## Call Signature

```ts
<ChannelType>(channel): Promise<ResponseSync<PackageKey, ChannelType>>;
```

Invoke a `renderer` event whose event declaration does not define a request type,
at a time other than [onMount](https://react.dev/reference/react/useEffect)
of the containing component.

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

`Promise`\<[`ResponseSync`](../../../Listener/type-aliases/ResponseSync.md)\<`PackageKey`, `ChannelType`\>\>

The response from `main`, given as a promise, which resolves to a [ResponseSync](../../../Listener/type-aliases/ResponseSync.md).

## Call Signature

```ts
<ChannelType>(channel, request): Promise<ResponseSync<PackageKey, ChannelType>>;
```

Invoke a `renderer` event whose event declaration defines a request type,
at a time other than [onMount](https://react.dev/reference/react/useEffect)
of the containing component.

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

`Promise`\<[`ResponseSync`](../../../Listener/type-aliases/ResponseSync.md)\<`PackageKey`, `ChannelType`\>\>

The response from `main`, given as a promise, which resolves to a [ResponseSync](../../../Listener/type-aliases/ResponseSync.md).
