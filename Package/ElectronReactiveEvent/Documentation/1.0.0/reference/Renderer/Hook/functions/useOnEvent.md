[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / useOnEvent

# useOnEvent Function

```ts
function useOnEvent<PackageKey, ChannelType>(
	channel,
	listener,
): readonly [() => void];
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

readonly \[() => `void`\]
