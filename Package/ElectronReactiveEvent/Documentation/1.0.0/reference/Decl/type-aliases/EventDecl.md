[electron-reactive-event](../../index.md) / [Decl](../index.md) / EventDecl

# EventDecl Type

```ts
type EventDecl<OwnerType, RequestType, ResponseType, ErrorType> =
	OwnerType extends MainOwner
		? EventDeclListener<MainOwner, RequestType>
		: OwnerType extends RendererOwner
			? ResponseType extends EmptyEventParameter
				? ErrorType extends EmptyEventParameter
					? EventDeclListener<RendererOwner, RequestType>
					: EventDeclHandler<RequestType, ResponseType, ErrorType>
				: EventDeclHandler<RequestType, ResponseType, ErrorType>
			: never;
```

All events in `electron-reactive-event` are modeled with this type.

## Type Parameters

### OwnerType

`OwnerType` _extends_ [`EventOwner`](EventOwner.md)

From whom an event of this type is sent.

### RequestType

`RequestType` = [`EmptyEventParameter`](EmptyEventParameter.md)

The type of the request object that is sent when an event occurs.

### ResponseType

`ResponseType` = [`EmptyEventParameter`](EmptyEventParameter.md)

The type of the response object that is sent when an event succeeds.

### ErrorType

`ErrorType` _extends_
\| [`EventErrorDecl`](EventErrorDecl.md)
\| [`EmptyEventParameter`](EmptyEventParameter.md) = [`EmptyEventParameter`](EmptyEventParameter.md)

The type of the response object that is sent when an event fails.

## Note

One important distinction is that event declarations with a [ResponseType](#responsetype)
can only have `OwnerType === {@link RendererOwner}`. This is a consequence of only
[ipcRenderer.invoke](https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args)
being able to send events _and_ receive a response from the receiver (_i.e._, from `main`).
Event declarations, depending upon whether `{@link ResponseType} === {@link EmptyEventParameter}`,
evaluate to one of the two internal types [EventDeclHandler](../../Internal/type-aliases/EventDeclHandler.md) or [EventDeclListener](../../Internal/type-aliases/EventDeclListener.md).
