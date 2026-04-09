[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / useOnceEvent

# useOnceEvent Function

```ts
function useOnceEvent<PackageKey, ChannelType>(
	channel,
	listener,
): readonly [OffEventDeferred<PackageKey>];
```

## Type Parameters

### PackageKey

`PackageKey` _extends_ `"__Internal__"`

### ChannelType

`ChannelType` _extends_ `never`

## Parameters

### channel

`ChannelType`

### listener

[`RendererListener`](../type-aliases/RendererListener.md)\<`PackageKey`, `ChannelType`\>

## Returns

readonly \[[`OffEventDeferred`](../type-aliases/OffEventDeferred.md)\<`PackageKey`\>\]
