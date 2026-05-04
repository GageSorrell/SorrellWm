[reactive-event](../../index.md) / [Main](../index.md) / on

# on Function

```ts
function on<PackageKey, ChannelType>(channel, listener): void;
```

Subscribe a [listener](#on) to an event declaration given by [channel](#on),
which does _not_ return a response to the `renderer`.

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
identifies the sendable event to which the [listener](#on) will be subscribed.

### listener

[`Listener`](../../Listener/type-aliases/Listener.md)\<`PackageKey`, _typeof_ `RendererOwnerValue`, `ChannelType`\>

The [MainListener](../type-aliases/MainListener.md) which will be subscribed to the given [channel](#on).

## Returns

`void`
