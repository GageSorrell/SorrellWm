[reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / useInvokeEvent

# useInvokeEvent Function

Invoke an event when the containing component mounts.

## Type Param

The unique string that identifies your package.

## Type Param

The channel that uniquely identifies the desired
event declaration.

## Type Param

The type of [InvokeOptions.suspend](../type-aliases/InvokeOptions.md#suspend) if an
[InvokeOptions](../type-aliases/InvokeOptions.md) object is passed.

## Param

The channel of the event that you wish to invoke.

## Param

The first overloaded argument of this event.

## Param

The second overloaded argument of this event.

## Call Signature

```ts
function useInvokeEvent<PackageKey, ChannelType>(
	channel,
): Response<PackageKey, ChannelType>;
```

Invoke an event when the containing component mounts, whose event declaration
does _not_ define a request type.

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

The unique string that identifies your package.

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
function useInvokeEvent<PackageKey, ChannelType, SuspendsType>(
	channel,
	options,
): SuspendsType extends true
	? ResponseSync<PackageKey, ChannelType>
	: Response<PackageKey, ChannelType>;
```

Invoke an event when the containing component mounts, whose event declaration
does _not_ defines a request type.

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

The unique string that identifies your package.

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

[`InvokeOptions`](../type-aliases/InvokeOptions.md)\<`SuspendsType`\>

Specify whether this hook should suspend the containing component
until `main` returns a response.

### Returns

`SuspendsType` _extends_ `true` ? [`ResponseSync`](../../../Listener/type-aliases/ResponseSync.md)\<`PackageKey`, `ChannelType`\> : [`Response`](../../../Listener/type-aliases/Response.md)\<`PackageKey`, `ChannelType`\>

The result returned by `main`.

## Call Signature

```ts
function useInvokeEvent<PackageKey, ChannelType>(
	channel,
	request,
): Response<PackageKey, ChannelType>;
```

Invoke an event when the containing component mounts, whose event declaration
defines a request type.

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

The unique string that identifies your package.

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
function useInvokeEvent<PackageKey, ChannelType, SuspendsType>(
	channel,
	request,
	options,
): SuspendsType extends true
	? ResponseSync<PackageKey, ChannelType>
	: Response<PackageKey, ChannelType>;
```

Invoke an event when the containing component mounts, whose event declaration
defines a request type.

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

The unique string that identifies your package.

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

[`InvokeOptions`](../type-aliases/InvokeOptions.md)\<`SuspendsType`\>

Specify whether this hook should suspend the containing component
until `main` returns a response.

### Returns

`SuspendsType` _extends_ `true` ? [`ResponseSync`](../../../Listener/type-aliases/ResponseSync.md)\<`PackageKey`, `ChannelType`\> : [`Response`](../../../Listener/type-aliases/Response.md)\<`PackageKey`, `ChannelType`\>

The result returned by `main`.
