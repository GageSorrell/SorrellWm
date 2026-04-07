[electron-reactive-event](../../index.md) / [Renderer](../index.md) / OffEventDeferred

# OffEventDeferred() Type

```ts
type OffEventDeferred<PackageKey> = <ChannelType>(channel, listener) => void;
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

## Type Parameters

### ChannelType

`ChannelType` _extends_ `never`

## Parameters

### channel

`ChannelType`

### listener

[`Listener`](../../Listener/type-aliases/Listener.md)\<`PackageKey`, _typeof_ `MainOwnerValue`\>

## Returns

`void`
