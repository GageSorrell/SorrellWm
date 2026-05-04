[reactive-event](../../index.md) / [Listener](../index.md) / HandlerNoRequest

# HandlerNoRequest Type

```ts
type HandlerNoRequest<PackageKey, ChannelType> = (
	event,
) => Promise<RawResponse<PackageKey, ChannelType>>;
```

A [Handler](Handler.md) that subscribes to an event whose declaration does
_not_ have a request type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### ChannelType

`ChannelType` _extends_ [`NoRequest`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/NoRequest.md)\<`PackageKey`\>

The channel that uniquely identifies the desired
event declaration.

## Parameters

### event

`IpcMainInvokeEvent`

## Returns

`Promise`\<[`RawResponse`](RawResponse.md)\<`PackageKey`, `ChannelType`\>\>
