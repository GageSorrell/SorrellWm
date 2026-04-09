[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / useSendEvent

# useSendEvent Function

## Call Signature

```ts
function useSendEvent<PackageKey, ChannelType>(channel): void;
```

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

#### ChannelType

`ChannelType` _extends_ `never`

### Parameters

#### channel

`ChannelType`

### Returns

`void`

## Call Signature

```ts
function useSendEvent<PackageKey, ChannelType>(channel, request): void;
```

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

#### ChannelType

`ChannelType` _extends_ `never`

### Parameters

#### channel

`ChannelType`

#### request

[`Request`](../../../Listener/type-aliases/Request.md)\<`PackageKey`, _typeof_ `RendererOwnerValue`, `ChannelType`\>

### Returns

`void`
