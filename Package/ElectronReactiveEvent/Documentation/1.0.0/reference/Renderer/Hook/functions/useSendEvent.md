[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / useSendEvent

# useSendEvent Function

Send an event when the containing component mounts.

## Note

\| Sendable events do _not_ end with a response returned by
`main`. If you wish to send an event to `main` such that it returns a
[response](../type-aliases/InvokeResponse.md), declare the EventDecl \| event type
with a `ResponseType !== {@link EmptyEventParameter}`.

## Type Param

The unique string that identifies your package.

## Type Param

The channel that uniquely identifies the desired
event declaration.

## Param

The channel of the event that you wish to invoke.

## Param

The overloaded request argument; it is sent to `main` iff it is
_not_ the default [EmptyOverloadParameterValue](../../../Listener/variables/EmptyOverloadParameterValue.md).

## Call Signature

```ts
function useSendEvent<PackageKey, ChannelType>(channel): void;
```

Send an event when the containing component mounts, whose event declaration
does _not_ define a request type.

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

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
[response](../type-aliases/InvokeResponse.md), declare the EventDecl \| event type
with a `ResponseType !== {@link EmptyEventParameter}`.

## Call Signature

```ts
function useSendEvent<PackageKey, ChannelType>(channel, request): void;
```

Send an event when the containing component mounts, whose event declaration
defines a request type.

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

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
[response](../type-aliases/InvokeResponse.md), declare the EventDecl \| event type
with a `ResponseType !== {@link EmptyEventParameter}`.
