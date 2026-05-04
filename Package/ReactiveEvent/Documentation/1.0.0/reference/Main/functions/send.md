[reactive-event](../../index.md) / [Main](../index.md) / send

# send Function

Send an event to all [BrowserWindows](https://www.electronjs.org/docs/latest/api/browser-window),
whose event declarations define a request type. This overload implicitly calls
[BrowserWindow.getAllWindows()](https://www.electronjs.org/docs/latest/api/browser-window#browserwindowgetallwindows).

## Type Param

The unique string that identifies your package.

## Type Param

The channel that uniquely identifies the desired
event declaration.

## Param

The [BrowserWindows](https://www.electronjs.org/docs/latest/api/browser-window)
to where the event will be sent. If `undefined`, then all browser windows will be sent the event.

## Param

The channel that uniquely identifies the desired
event declaration.

## Param

The overloaded request argument; it is [EmptyOverloadParameterValue](../../Listener/variables/EmptyOverloadParameterValue.md) if
the event declaration has no request type.

## Call Signature

```ts
function send<PackageKey, ChannelType>(browserWindow, channel): void;
```

Send an event to the `renderer`, whose event declaration does _not_ define
a request type.

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

The unique string that identifies your package.

#### ChannelType

`ChannelType` _extends_ `never`

The channel that uniquely identifies the desired
event declaration.

### Parameters

#### browserWindow

`BrowserWindow`

The [BrowserWindow](https://www.electronjs.org/docs/latest/api/browser-window)
to where the event will be sent.

#### channel

`ChannelType`

The [sendable channel](../../Channel/namespaces/Channel/namespaces/Listener/type-aliases/Any.md) that uniquely
identifies the event declaration.

### Returns

`void`

## Call Signature

```ts
function send<PackageKey, ChannelType>(browserWindow, channel, request): void;
```

Send an event to the `renderer`, whose event declaration defines a request type.

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

The unique string that identifies your package.

#### ChannelType

`ChannelType` _extends_ `never`

The channel that uniquely identifies the desired
event declaration.

### Parameters

#### browserWindow

`BrowserWindow`

The [BrowserWindow](https://www.electronjs.org/docs/latest/api/browser-window)
to where the event will be sent.

#### channel

`ChannelType`

The [sendable channel](../../Channel/namespaces/Channel/namespaces/Listener/type-aliases/Any.md) that uniquely
identifies the event declaration.

#### request

[`EventRequest`](../../Listener/type-aliases/EventRequest.md)\<`PackageKey`, _typeof_ `MainOwnerValue`, `ChannelType`\>

The request of the given event.

### Returns

`void`

## Call Signature

```ts
function send<PackageKey, ChannelType>(browserWindows, channel): void;
```

Send an event to multiple [BrowserWindows](https://www.electronjs.org/docs/latest/api/browser-window),
whose event declarations do _not_ define a request type.

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

The unique string that identifies your package.

#### ChannelType

`ChannelType` _extends_ `never`

The channel that uniquely identifies the desired
event declaration.

### Parameters

#### browserWindows

`BrowserWindow`[]

The [BrowserWindows](https://www.electronjs.org/docs/latest/api/browser-window)
to where the event will be sent.

#### channel

`ChannelType`

The channel that uniquely identifies the desired
event declaration.

### Returns

`void`

## Call Signature

```ts
function send<PackageKey, ChannelType>(browserWindows, channel, request): void;
```

Send an event to multiple [BrowserWindows](https://www.electronjs.org/docs/latest/api/browser-window),
whose event declarations define a request type.

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

The unique string that identifies your package.

#### ChannelType

`ChannelType` _extends_ `never`

The channel that uniquely identifies the desired
event declaration.

### Parameters

#### browserWindows

`BrowserWindow`[]

The [BrowserWindows](https://www.electronjs.org/docs/latest/api/browser-window)
to where the event will be sent.

#### channel

`ChannelType`

The channel that uniquely identifies the desired
event declaration.

#### request

[`EventRequest`](../../Listener/type-aliases/EventRequest.md)\<`PackageKey`, _typeof_ `MainOwnerValue`, `ChannelType`\>

The request of the given event.

### Returns

`void`

## Call Signature

```ts
function send<PackageKey, ChannelType>(browserWindows, channel): void;
```

Send an event to all [BrowserWindows](https://www.electronjs.org/docs/latest/api/browser-window),
whose event declarations do _not_ define a request type. This overload implicitly calls
[BrowserWindow.getAllWindows()](https://www.electronjs.org/docs/latest/api/browser-window#browserwindowgetallwindows).

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

The unique string that identifies your package.

#### ChannelType

`ChannelType` _extends_ `never`

The channel that uniquely identifies the desired
event declaration.

### Parameters

#### browserWindows

`undefined`

The [BrowserWindows](https://www.electronjs.org/docs/latest/api/browser-window)
to where the event will be sent. If `undefined`, then all browser windows will be sent the event.

#### channel

`ChannelType`

The channel that uniquely identifies the desired
event declaration.

### Returns

`void`

## Call Signature

```ts
function send<PackageKey, ChannelType>(browserWindows, channel, request): void;
```

Send an event to all [BrowserWindows](https://www.electronjs.org/docs/latest/api/browser-window),
whose event declarations define a request type. This overload implicitly calls
[BrowserWindow.getAllWindows()](https://www.electronjs.org/docs/latest/api/browser-window#browserwindowgetallwindows).

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

The unique string that identifies your package.

#### ChannelType

`ChannelType` _extends_ `never`

The channel that uniquely identifies the desired
event declaration.

### Parameters

#### browserWindows

`undefined`

The [BrowserWindows](https://www.electronjs.org/docs/latest/api/browser-window)
to where the event will be sent. If `undefined`, then all browser windows will be sent the event.

#### channel

`ChannelType`

The channel that uniquely identifies the desired
event declaration.

#### request

[`EventRequest`](../../Listener/type-aliases/EventRequest.md)\<`PackageKey`, _typeof_ `MainOwnerValue`, `ChannelType`\>

The request of the given event.

### Returns

`void`
