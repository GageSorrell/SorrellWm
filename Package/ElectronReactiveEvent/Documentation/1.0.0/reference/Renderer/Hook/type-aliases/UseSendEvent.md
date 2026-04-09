[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / UseSendEvent

# UseSendEvent Type

```ts
type UseSendEvent<PackageKey> = {
	<ChannelType>(channel): void;
	<ChannelType>(channel): void;
};
```

Send an event when the containing component mounts.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

## Call Signature

```ts
<ChannelType>(channel): void;
```

Send an event when the containing component mounts, whose event declaration
does _not_ define a request type.

### Type Parameters

#### ChannelType

`ChannelType` _extends_ `never`

The channel that uniquely identifies the desired
event declaration.

### Parameters

#### channel

`ChannelType`

The channel of the event that you wish to send.

### Returns

`void`

The result returned by `main`.

## Call Signature

```ts
<ChannelType>(channel): void;
```

Invoke an event when the containing component mounts, whose event declaration
defines a request type.

### Type Parameters

#### ChannelType

`ChannelType` _extends_ `never`

The channel that uniquely identifies the desired
event declaration.

### Parameters

#### channel

`ChannelType`

The channel of the event that you wish to invoke.

### Returns

`void`

The result returned by `main`.
