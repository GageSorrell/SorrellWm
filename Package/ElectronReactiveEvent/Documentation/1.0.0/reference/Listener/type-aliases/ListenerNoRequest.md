[electron-reactive-event](../../index.md) / [Listener](../index.md) / ListenerNoRequest

# ListenerNoRequest Type

```ts
type ListenerNoRequest<OwnerType> = OwnerType extends RendererOwner
	? (event) => void
	: (event) => void;
```

A [Listener](Listener.md) that is subscribable to a [listener channel](../../Channel/namespaces/Channel/namespaces/Listener/type-aliases/NoRequest.md)
whose event declaration has no request type.

## Type Parameters

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../Decl/type-aliases/EventOwner.md)

The owner of the event declarations identified by this type.
