[reactive-event](../../index.md) / [Listener](../index.md) / RawResponseError

# RawResponseError Type

```ts
type RawResponseError<PackageKey, ChannelType> = ReactiveEventErrorDataInternal<
	PackageKey,
	ChannelType
>;
```

The type returned by a handler when the given invokable event fails.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### ChannelType

`ChannelType` _extends_ [`Any`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Any.md)\<`PackageKey`\>

The channel that uniquely identifies the desired
event declaration.
