[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / useOnEvent

# useOnEvent Function

```ts
function useOnEvent<PackageKey, ChannelType>(
	channel,
	listener,
): readonly [() => void];
```

Subscribe to events sent by `main` at the time that the containing component mounts.
When the component unmounts, the listener is unsubscribed.

## Type Parameters

### PackageKey

`PackageKey` _extends_ `"__Internal__"`

### ChannelType

`ChannelType` _extends_ `never`

The type of the [channel](#useonevent) on which the
[listener](#useonevent) will listen.

## Parameters

### channel

`ChannelType`

The channel on which the [listener](#useonevent) will listen.

### listener

[`RendererListener`](../type-aliases/RendererListener.md)\<`PackageKey`, `ChannelType`\>

The callback function that will listen on [channel](#useonevent).

## Returns

readonly \[() => `void`\]

A function that will unregister the given [listener](#useonevent).
