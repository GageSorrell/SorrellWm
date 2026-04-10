[electron-reactive-event](../../index.md) / [Main](../index.md) / once

# once Function

```ts
function once<PackageKey, ChannelType>(channel, listener): void;
```

Subscribe a [listener](#once) to an event declaration given by [channel](#once),
which does _not_ return a response to the `renderer`. The [listener](#once)
will be unsubscribed after it is called once.

## Type Parameters

### PackageKey

`PackageKey` _extends_ `"__Internal__"`

### ChannelType

`ChannelType` _extends_ `never`

The channel that uniquely identifies the desired
event declaration.

## Parameters

### channel

`ChannelType`

The [sendable channel](../../Channel/namespaces/Channel/namespaces/Listener/type-aliases/Any.md) that uniquely
identifies the sendable event to which the [listener](#once) will be subscribed.

### listener

[`Listener`](../../Listener/type-aliases/Listener.md)\<`PackageKey`, _typeof_ `RendererOwnerValue`, `ChannelType`\>

The [MainListener](../type-aliases/MainListener.md) which will be subscribed to the given [channel](#once).

## Returns

`void`
