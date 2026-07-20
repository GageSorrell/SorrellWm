[reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / UseOnEvent

# UseOnEvent Type

```ts
type UseOnEvent<PackageKey> = <ChannelType>(
	channel,
	listener,
) => readonly [OffEventDeferred<PackageKey>];
```

Subscribe to events sent by `main` at the time that the containing component mounts.
When the component unmounts, the listener is unsubscribed. An [OffEventDeferred](OffEventDeferred.md)
callback is returned if you wish to unsubscribe before the component unmounts.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

Subscribe to events sent by `main` at the time that the containing component mounts.
When the component unmounts, the listener is unsubscribed.

## Type Parameters

### ChannelType

`ChannelType` _extends_ `never`

The type of the [channel](#type) on which the
[listener](#type) will listen.

## Parameters

### channel

`ChannelType`

The channel on which the [listener](#type) will listen.

### listener

[`Listener`](../../../Listener/type-aliases/Listener.md)\<`PackageKey`, _typeof_ `MainOwnerValue`\>

The callback function that will listen on [channel](#type).

## Returns

readonly \[[`OffEventDeferred`](OffEventDeferred.md)\<`PackageKey`\>\]

A function that will unregister the given [listener](#type).
