[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Main](../index.md) / FactoryReturnType

# FactoryReturnType Type

```ts
type FactoryReturnType<MainRegistrar, RendererRegistrar> = object;
```

The type returned by [getMainIpc](../functions/getMainIpc.md).

## Remarks

This (and the [getMainIpc](../functions/getMainIpc.md) function) exist as a convenience to pass along
your registrar types. By wrapping the IPC functions with this factory function, your registrar
types do not need to be passed with each function call.

## Type Parameters

### MainRegistrar

`MainRegistrar` _extends_ [`IMainRegistrarBase`](../../../../Shared/namespaces/Registrar/interfaces/IMainRegistrarBase.md)

The `main` registrar type.

### RendererRegistrar

`RendererRegistrar` _extends_ [`IRendererRegistrarBase`](../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)

The `renderer` registrar type.

## Properties

### send()

```ts
send: {
<ChannelType, WindowType>  (Channel, Request, BrowserWindows): Promise<ReturnType<ChannelType, MainRegistrar, WindowType>>;
<ChannelType, WindowType>  (Channel, BrowserWindows): Promise<ReturnType<ChannelType, MainRegistrar, WindowType>>;
};
```

Send an event to the `renderer`. Signatures vary based on whether the given
event declaration has a `RequestType`.

#### Call Signature

```ts
<ChannelType, WindowType>(
   Channel,
   Request,
BrowserWindows): Promise<ReturnType<ChannelType, MainRegistrar, WindowType>>;
```

##### Type Parameters

###### ChannelType

`ChannelType` _extends_ `string`

The desired channel of the given Registrar.

###### WindowType

`WindowType` _extends_ `BrowserWindow` \| `BrowserWindow`[]

##### Parameters

###### Channel

`ChannelType`

The channel of the event.

###### Request

[`Request`](../../Event/type-aliases/Request.md)\<`ChannelType`, `MainRegistrar`\>

The request data sent.

###### BrowserWindows

`WindowType`

The
[BrowserWindow(s)](https://www.electronjs.org/docs/latest/api/browser-window)
that will receive the given request.

##### Returns

`Promise`\<[`ReturnType`](../namespaces/Send/type-aliases/ReturnType.md)\<`ChannelType`, `MainRegistrar`, `WindowType`\>\>

The response(s) of the given
[BrowserWindow(s)](https://www.electronjs.org/docs/latest/api/browser-window),
in the order in which the `BrowserWindow`s were given.

#### Call Signature

```ts
<ChannelType, WindowType>(Channel, BrowserWindows): Promise<ReturnType<ChannelType, MainRegistrar, WindowType>>;
```

##### Type Parameters

###### ChannelType

`ChannelType` _extends_ `WithRequestHelper`\<`MainRegistrar`\> & `string`

The desired channel of the given Registrar.

###### WindowType

`WindowType` _extends_ `BrowserWindow` \| `BrowserWindow`[]

##### Parameters

###### Channel

`ChannelType`

The channel of the event.

###### BrowserWindows

`WindowType`

The
[\`BrowserWindow(s)\`](https://www.electronjs.org/docs/latest/api/browser-window)
that will receive the given request.

##### Returns

`Promise`\<[`ReturnType`](../namespaces/Send/type-aliases/ReturnType.md)\<`ChannelType`, `MainRegistrar`, `WindowType`\>\>

The response(s) of the given
[\`BrowserWindow(s)\`](https://www.electronjs.org/docs/latest/api/browser-window),
in the order in which the `BrowserWindow`s were given.

---

### unregisterAll()

```ts
unregisterAll: () => void;
```

Unregister all callbacks.

#### Returns

`void`

## Methods

### registerCallback()

```ts
registerCallback<ChannelType>(Channel, Callback): void;
```

Register a given `main` callback function for a given channel.

#### Type Parameters

##### ChannelType

`ChannelType` _extends_ `string`

The desired channel of the given `RendererRegistrar`.

#### Parameters

##### Channel

`ChannelType`

The channel of the event declaration corresponding to the given `Callback`.

##### Callback

[`Main`](../../Callback/type-aliases/Main.md)\<`ChannelType`, `RendererRegistrar`\>

The callback function that will be called when an event of channel `Channel`
is received from the `renderer`.

#### Returns

`void`

---

### registerCallbacks()

```ts
registerCallbacks<ChannelType>(Record): void;
```

Register multiple callbacks for a given set of event declarations.
The keys are taken to be the `ChannelType`s, and the respective values are the
callbacks that will be registered for their respective `ChannelType`s.

#### Type Parameters

##### ChannelType

`ChannelType` _extends_ `string`

The desired channels of the given `RendererRegistrar`.

#### Parameters

##### Record

[`EventRecord`](../../Callback/type-aliases/EventRecord.md)\<`ChannelType`, `RendererRegistrar`\>

The record mapping of channel

#### Returns

`void`

#### Note

This is one of the few functions in which `ChannelType` is expected to be
a _union_ of multiple string literals.

---

### unregisterCallback()

```ts
unregisterCallback<ChannelType>(Channel, Callback): void;
```

Unregisters a given callback for all `BrowserWindow`s for which the callback was registered.

#### Type Parameters

##### ChannelType

`ChannelType` _extends_ `string`

The desired channel of the given Registrar.

#### Parameters

##### Channel

`ChannelType`

The channel of the event.

##### Callback

[`Callback`](../../Callback/type-aliases/Callback.md)\<`ChannelType`, `RendererRegistrar`\>

The callback to be unregistered.

#### Returns

`void`

The response(s) of the given
[\`BrowserWindow(s)\`](https://www.electronjs.org/docs/latest/api/browser-window),
in the order in which the `BrowserWindow`s were given.

---

### unregisterCallbacks()

```ts
unregisterCallbacks<ChannelType>(Record): void;
```

Unregister multiple callbacks for a given set of event declarations.
The keys are taken to be the `ChannelType`s, and the respective values are the
callbacks that will be registered for their respective `ChannelType`s.

#### Type Parameters

##### ChannelType

`ChannelType` _extends_ `string`

The desired channels of the given `RendererRegistrar`.

#### Parameters

##### Record

[`EventRecord`](../../Callback/type-aliases/EventRecord.md)\<`ChannelType`, `RendererRegistrar`\>

The record mapping of channel

#### Returns

`void`

#### Note

This is one of the few functions in which `ChannelType` is expected to be
a _union_ of multiple string literals.
