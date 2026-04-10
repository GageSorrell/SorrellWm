[electron-reactive-event](../../index.md) / [Internal](../index.md) / EventDeclHandler

# EventDeclHandler Type

```ts
type EventDeclHandler<RequestType, ResponseType, ErrorType> = EventDeclBase<
	RendererOwner,
	RequestType,
	ResponseType,
	ErrorType
>;
```

An EventDecl \| event declaration with a response type. Since responses can be
returned only by [ipcRenderer.invoke](https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args),
event declarations of this type can only be `renderer` events (_i.e._, _sent_ by the `renderer`).

## Type Parameters

### RequestType

`RequestType` = [`EmptyEventParameter`](../../Decl/type-aliases/EmptyEventParameter.md)

The type of the request object that is sent when an event occurs.

### ResponseType

`ResponseType` = [`EmptyEventParameter`](../../Decl/type-aliases/EmptyEventParameter.md)

The type of the response object that is sent when an event succeeds.

### ErrorType

`ErrorType` _extends_
\| [`EventErrorDecl`](../../Decl/type-aliases/EventErrorDecl.md)
\| [`EmptyEventParameter`](../../Decl/type-aliases/EmptyEventParameter.md) = [`EmptyEventParameter`](../../Decl/type-aliases/EmptyEventParameter.md)

The type of the response object that is sent when an event fails.
