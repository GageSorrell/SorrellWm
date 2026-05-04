[reactive-event](../../index.md) / [Listener](../index.md) / ResponseSuccess

# ResponseSuccess Type

```ts
type ResponseSuccess<PackageKey, ChannelType> = ResponseBase<
	ResponseDataKey,
	Registrar[PackageKey][ChannelType][ResponseKey]
>;
```

Your [handlers](Handler.md) can return values directly using the types in your event declarations,
_i.e._, return your `ResponseType` when your event succeeds, and the `ErrorType` when
your event fails.

`reactive-event` transforms your return value before sending it to the `renderer`
so that it receives data in a homogenous structure: the [Response](Response.md) type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### ChannelType

`ChannelType` _extends_ [`Response`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/Response.md)\<`PackageKey`\>

The channel that uniquely identifies the desired
event declaration.
