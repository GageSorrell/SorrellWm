[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / RendererListener

# RendererListener Type

```ts
type RendererListener<PackageKey, ChannelType> = Listener<
	PackageKey,
	MainOwner,
	ChannelType
>;
```

The type of the [listener](../../../Listener/type-aliases/Listener.md) function passed to [useOnEvent](../functions/useOnEvent.md) _et al._

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### ChannelType

`ChannelType` _extends_ [`Any`](../../../Channel/namespaces/Channel/namespaces/Listener/type-aliases/Any.md)\<`PackageKey`, [`MainOwner`](../../../Decl/type-aliases/MainOwner.md)\>

The channel that uniquely identifies the desired
event declaration.
