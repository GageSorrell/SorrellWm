[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / OnEventDeferred

# OnEventDeferred Type

```ts
type OnEventDeferred<PackageKey> = UseOnEvent<PackageKey>;
```

The function that allows the `renderer` to subscribe to `main` events with a [RendererListener](RendererListener.md).
This is equivalent to the [UseOnEvent type](UseOnEvent.md).

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

## See

[OffEventDeferred](OffEventDeferred.md) has the opposite function, although this function will return
a parameter-less function of the same name, to unsubscribe from the event used by calling
this function.
