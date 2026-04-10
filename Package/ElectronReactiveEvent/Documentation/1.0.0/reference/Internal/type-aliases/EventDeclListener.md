[electron-reactive-event](../../index.md) / [Internal](../index.md) / EventDeclListener

# EventDeclListener Type

```ts
type EventDeclListener<OwnerType, RequestType> = EventDeclBase<
	OwnerType,
	RequestType,
	EmptyEventParameter,
	EmptyEventParameter
>;
```

An EventDecl \| event declaration with _no_ response type _and_ no error type.
This allows the event owner to be _either_ one of `main` or the `renderer`
(identified as the type parameter [OwnerType](#ownertype) with the MainOwner and [RendererOwner](../../Decl/type-aliases/RendererOwner.md)
types, respectively).

## Type Parameters

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../Decl/type-aliases/EventOwner.md)

From whom an event of this type is sent.

### RequestType

`RequestType`

The type of the request object that is sent when an event occurs.
