[electron-reactive-event](../../index.md) / [Listener](../index.md) / Response

# Response Type

```ts
type Response<PackageKey, ChannelType> = MakeIsPending<
	ResponseSync<PackageKey, ChannelType>
>;
```

A Response returned by UseInvokeEvent when InvokeOptions.suspend
is not `true`, possibly before `main` has sent a value to the `renderer`.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### ChannelType

`ChannelType` _extends_ [`Any`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Any.md)\<`PackageKey`\>

The channel that uniquely identifies the desired
event declaration.
