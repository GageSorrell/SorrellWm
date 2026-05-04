[reactive-event](../../index.md) / [Listener](../index.md) / ResponseSettled

# ResponseSettled Type

```ts
type ResponseSettled<PackageKey, ChannelType> = Exclude<
	Response<PackageKey, ChannelType>,
	ResponseIndeterminate
>;
```

A [Response](Response.md) returned by UseInvokeEvent when InvokeOptions.suspend
is not `true`, and `main` has returned a response.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### ChannelType

`ChannelType` _extends_ [`Any`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Any.md)\<`PackageKey`\>

The channel that uniquely identifies the desired
event declaration.
