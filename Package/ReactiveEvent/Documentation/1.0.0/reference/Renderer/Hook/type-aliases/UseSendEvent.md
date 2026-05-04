[reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / UseSendEvent

# UseSendEvent Type

```ts
type UseSendEvent<PackageKey> = {
	<ChannelType>(channel): void;
	<ChannelType>(channel, request): void;
};
```

Send an event when the containing component mounts.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

## Call Signature

```ts
<ChannelType>(channel): void;
```

Send an event when the containing component mounts, whose event declaration
does _not_ define a request type.

### Type Parameters

#### ChannelType

`ChannelType` _extends_ `never`

The channel that uniquely identifies the desired
event declaration.

### Parameters

#### channel

`ChannelType`

The channel of the event that you wish to send.

### Returns

`void`

### Note

\| Sendable events do _not_ end with a response returned by
`main`. If you wish to send an event to `main` such that it returns a
[response](InvokeResponse.md), declare the EventDecl \| event type
with a `ResponseType !== {@link EmptyEventParameter}`.

## Call Signature

```ts
<ChannelType>(channel, request): void;
```

Send an event when the containing component mounts, whose event declaration
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

The request sent with this event.

### Returns

`void`

### Note

\| Sendable events do _not_ end with a response returned by
`main`. If you wish to send an event to `main` such that it returns a
[response](InvokeResponse.md), declare the EventDecl \| event type
with a `ResponseType !== {@link EmptyEventParameter}`.

## Note

\| Sendable events do _not_ end with a response returned by
`main`. If you wish to send an event to `main` such that it returns a
[response](InvokeResponse.md), declare the EventDecl \| event type
with a `ResponseType !== {@link EmptyEventParameter}`.
