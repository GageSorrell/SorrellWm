[electron-reactive-event](../../index.md) / [Renderer](../index.md) / RendererListener

# RendererListener Type

```ts
type RendererListener<PackageKey, ChannelType> = Listener<
	PackageKey,
	MainOwner,
	IpcRendererEvent,
	ChannelType
>;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

### ChannelType

`ChannelType` _extends_ [`Any`](../../Channel/namespaces/Channel/namespaces/Listener/type-aliases/Any.md)\<`PackageKey`, [`MainOwner`](../../Decl/type-aliases/MainOwner.md)\>
