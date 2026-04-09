[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / OnceEventDeferred

# OnceEventDeferred Type

```ts
type OnceEventDeferred<PackageKey> = UseOnceEvent<PackageKey>;
```

The function that allows the `renderer` to subscribe to `main` events with a [RendererListener](RendererListener.md).
The given [RendererListener](RendererListener.md) will be unsubscribed after being called once.
This is equivalent to the [UseOnceEvent type](UseOnceEvent.md).

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.
