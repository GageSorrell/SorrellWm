[electron-reactive-event](../../index.md) / [Main](../index.md) / Send

# Send Type

```ts
type Send<PackageKey> = {
	<ChannelType>(browserWindow, channel): void;
	<ChannelType>(browserWindow, channel, request): void;
	<ChannelType>(browserWindows, channel): void;
	<ChannelType>(browserWindows, channel, request): void;
	<ChannelType>(browserWindows, channel): void;
	<ChannelType>(browserWindows, channel, request): void;
};
```

The type-safe form of IpcMain.send.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

## Call Signature

```ts
<ChannelType>(browserWindow, channel): void;
```

Send an event to the `renderer`, whose event declaration does _not_ define
a request type.

### Type Parameters

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
<ChannelType>(
   browserWindow,
   channel,
   request): void;
```

Send an event to the `renderer`, whose event declaration defines a request type.

### Type Parameters

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
<ChannelType>(browserWindows, channel): void;
```

Send an event to multiple [BrowserWindows](https://www.electronjs.org/docs/latest/api/browser-window),
whose event declarations do _not_ define a request type.

### Type Parameters

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
<ChannelType>(
   browserWindows,
   channel,
   request): void;
```

Send an event to multiple [BrowserWindows](https://www.electronjs.org/docs/latest/api/browser-window),
whose event declarations define a request type.

### Type Parameters

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
<ChannelType>(browserWindows, channel): void;
```

Send an event to all [BrowserWindows](https://www.electronjs.org/docs/latest/api/browser-window),
whose event declarations do _not_ define a request type. This overload implicitly calls
[BrowserWindow.getAllWindows()](https://www.electronjs.org/docs/latest/api/browser-window#browserwindowgetallwindows).

### Type Parameters

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
<ChannelType>(
   browserWindows,
   channel,
   request): void;
```

Send an event to all [BrowserWindows](https://www.electronjs.org/docs/latest/api/browser-window),
whose event declarations define a request type. This overload implicitly calls
[BrowserWindow.getAllWindows()](https://www.electronjs.org/docs/latest/api/browser-window#browserwindowgetallwindows).

### Type Parameters

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
