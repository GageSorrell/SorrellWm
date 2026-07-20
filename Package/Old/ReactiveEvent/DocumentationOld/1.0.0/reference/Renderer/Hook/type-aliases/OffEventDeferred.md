[reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / OffEventDeferred

# OffEventDeferred Type

```ts
type OffEventDeferred<PackageKey> = <ChannelType>(channel, listener) => void;
```

The function that allows the `renderer` to unsubscribe to `main` events with a [RendererListener](RendererListener.md).
This is equivalent to the [UseOnEvent type](UseOnEvent.md).

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

## Type Parameters

### ChannelType

`ChannelType` _extends_ `never`

## Parameters

### channel

`ChannelType`

### listener

[`Listener`](../../../Listener/type-aliases/Listener.md)\<`PackageKey`, _typeof_ `MainOwnerValue`\>

## Returns

`void`
