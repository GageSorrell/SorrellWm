[electron-reactive-event](../../index.md) / [Listener](../index.md) / IpcEventFromOwner

# IpcEventFromOwner Type

```ts
type IpcEventFromOwner<OwnerType> = OwnerType extends MainOwner
	? IpcRendererEvent
	: OwnerType extends RendererOwner
		? IpcMainEvent | IpcMainInvokeEvent
		: never;
```

The possible `Event` types, given the owner of the event declaration.

## Type Parameters

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../Decl/type-aliases/EventOwner.md)

The owner of the event declarations identified by this type.
