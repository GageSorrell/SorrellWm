[electron-reactive-event](../../index.md) / [Error](../index.md) / ReactiveEventErrorData

# ReactiveEventErrorData Type

```ts
type ReactiveEventErrorData<PackageKey, ChannelType> =
	ChannelType extends ErrorPayload<PackageKey, EventOwner> ? object : object;
```

When an error is given to the `renderer` as a result of a `handler` returning an error,
this is the type of that `error` property.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### ChannelType

`ChannelType` _extends_ [`Error`](../../Channel/namespaces/Channel/type-aliases/Error.md)\<`PackageKey`, [`EventOwner`](../../Decl/type-aliases/EventOwner.md)\>

The channel that uniquely identifies the desired
event declaration.
