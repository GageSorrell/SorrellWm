[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / UseOnceEvent

# UseOnceEvent Type

```ts
type UseOnceEvent<PackageKey> = <ChannelType>(
	channel,
	listener,
) => readonly [OffEventDeferred<PackageKey>];
```

Equivalent to [UseOnEvent](UseOnEvent.md), but the listener will be unsubscribed
after firing once.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

Equivalent to [UseOnEvent](UseOnEvent.md), but the listener will be unsubscribed
after firing once.

## Type Parameters

### ChannelType

`ChannelType` _extends_ `never`

The channel that uniquely identifies the desired
event declaration.

## Parameters

### channel

`ChannelType`

The channel of the `main` event to which you wish to subscribe
the [listener](#type).

### listener

[`Listener`](../../../Listener/type-aliases/Listener.md)\<`PackageKey`, _typeof_ `MainOwnerValue`\>

The [RendererListener](RendererListener.md) that will be subscribed to the given
[channel](#type).

## Returns

readonly \[[`OffEventDeferred`](OffEventDeferred.md)\<`PackageKey`\>\]

An [OffEventDeferred](OffEventDeferred.md) to unsubscribe the [listener](#type) early.
