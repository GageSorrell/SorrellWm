[reactive-event](../../index.md) / [Listener](../index.md) / RawResponseSuccess

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

The type returned by a handler when the given invokable event succeeds.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### ChannelType

`ChannelType` _extends_ [`Any`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Any.md)\<`PackageKey`\>

The channel that uniquely identifies the desired
event declaration.
