[electron-reactive-event](../../index.md) / [Main](../index.md) / send

# send Function

The type-safe form of IpcMain.send.

## Call Signature

```ts
function send<PackageKey, ChannelType>(browserWindow, channel): void;
```

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

#### ChannelType

`ChannelType` _extends_ `never`

### Parameters

#### browserWindow

`BrowserWindow`

#### channel

`ChannelType`

### Returns

`void`

### Inherit Doc

## Call Signature

```ts
function send<PackageKey, ChannelType>(browserWindow, channel, request): void;
```

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

#### ChannelType

`ChannelType` _extends_ `never`

### Parameters

#### browserWindow

`BrowserWindow`

#### channel

`ChannelType`

#### request

[`Request`](../../Listener/type-aliases/Request.md)\<`PackageKey`, _typeof_ `MainOwnerValue`, `ChannelType`\>

### Returns

`void`

### Inherit Doc

## Call Signature

```ts
function send<PackageKey, ChannelType>(browserWindows, channel): void;
```

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

#### ChannelType

`ChannelType` _extends_ `never`

### Parameters

#### browserWindows

`BrowserWindow`[]

#### channel

`ChannelType`

### Returns

`void`

### Inherit Doc

## Call Signature

```ts
function send<PackageKey, ChannelType>(browserWindows, channel, request): void;
```

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

#### ChannelType

`ChannelType` _extends_ `never`

### Parameters

#### browserWindows

`BrowserWindow`[]

#### channel

`ChannelType`

#### request

[`Request`](../../Listener/type-aliases/Request.md)\<`PackageKey`, _typeof_ `MainOwnerValue`, `ChannelType`\>

### Returns

`void`

### Inherit Doc

## Call Signature

```ts
function send<PackageKey, ChannelType>(browserWindows, channel): void;
```

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

#### ChannelType

`ChannelType` _extends_ `never`

### Parameters

#### browserWindows

`undefined`

#### channel

`ChannelType`

### Returns

`void`

### Inherit Doc

## Call Signature

```ts
function send<PackageKey, ChannelType>(browserWindows, channel, request): void;
```

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

#### ChannelType

`ChannelType` _extends_ `never`

### Parameters

#### browserWindows

`undefined`

#### channel

`ChannelType`

#### request

[`Request`](../../Listener/type-aliases/Request.md)\<`PackageKey`, _typeof_ `MainOwnerValue`, `ChannelType`\>

### Returns

`void`

### Inherit Doc
