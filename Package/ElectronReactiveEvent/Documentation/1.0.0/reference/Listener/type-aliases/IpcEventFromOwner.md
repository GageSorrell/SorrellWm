[electron-reactive-event](../../index.md) / [Listener](../index.md) / IpcEventFromOwner

# IpcEventFromOwner Type

```ts
type IpcEventFromOwner<OwnerType> = OwnerType extends MainOwner
	? IpcRendererEvent
	: OwnerType extends RendererOwner
		? IpcMainEvent | IpcMainInvokeEvent
		: never;
```

## Type Parameters

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../Decl/type-aliases/EventOwner.md)
