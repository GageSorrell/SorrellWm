[electron-reactive-event](../../index.md) / [Listener](../index.md) / RawResponseSuccess

# RawResponseSuccess Type

```ts
type RawResponseSuccess<PackageKey, ChannelType> =
	ResponseKey extends keyof FilterByOwner<
		PackageKey,
		RendererOwner
	>[ChannelType]
		? FilterByOwner<
				PackageKey,
				RendererOwner
			>[ChannelType][ResponseKey] extends EmptyEventParameter
			? never
			: FilterByOwner<PackageKey, RendererOwner>[ChannelType][ResponseKey]
		: never;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

### ChannelType

`ChannelType` _extends_ [`Any`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Any.md)\<`PackageKey`\>
