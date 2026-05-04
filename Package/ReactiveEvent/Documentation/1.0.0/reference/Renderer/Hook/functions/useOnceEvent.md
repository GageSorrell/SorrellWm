[reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / useOnceEvent

# useOnceEvent Function

```ts
function useOnceEvent<PackageKey, ChannelType>(
	channel,
	listener,
): readonly [OffEventDeferred<PackageKey>];
```

Equivalent to [UseOnEvent](../type-aliases/UseOnEvent.md), but the listener will be unsubscribed
after firing once.

## Type Parameters

### PackageKey

`PackageKey` _extends_ `"__Internal__"`

The unique string that identifies your package.

### ChannelType

`ChannelType` _extends_ `never`

The channel that uniquely identifies the desired
event declaration.

## Parameters

### channel

`ChannelType`

The channel of the `main` event to which you wish to subscribe
the [listener](#useonceevent).

### listener

[`RendererListener`](../type-aliases/RendererListener.md)\<`PackageKey`, `ChannelType`\>

The [RendererListener](../type-aliases/RendererListener.md) that will be subscribed to the given
[channel](#useonceevent).

## Returns

readonly \[[`OffEventDeferred`](../type-aliases/OffEventDeferred.md)\<`PackageKey`\>\]

An [OffEventDeferred](../type-aliases/OffEventDeferred.md) to unsubscribe the [listener](#useonceevent) early.
