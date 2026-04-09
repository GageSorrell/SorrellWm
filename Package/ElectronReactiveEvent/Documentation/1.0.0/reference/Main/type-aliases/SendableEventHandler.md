[electron-reactive-event](../../index.md) / [Main](../index.md) / SendableEventHandler

# SendableEventHandler Type

```ts
type SendableEventHandler<PackageKey> = <ChannelType>(
	channel,
	listener,
) => void;
```

The type-safe form of the listener passed to IpcMain.on _et al._

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

## Type Parameters

### ChannelType

`ChannelType` _extends_ `never`

## Parameters

### channel

`ChannelType`

### listener

[`MainListener`](MainListener.md)\<`PackageKey`, `ChannelType`\>

## Returns

`void`
