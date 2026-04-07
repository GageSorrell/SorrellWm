[electron-reactive-event](../../index.md) / [Error](../index.md) / ReactiveEventError

# ReactiveEventError() Function

## Call Signature

```ts
function ReactiveEventError<PackageKey, ChannelType, OwnerType>(
	message,
): ReactiveEventErrorInternal<PackageKey, ChannelType>;
```

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

#### ChannelType

`ChannelType` _extends_ `never`

#### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../Decl/type-aliases/EventOwner.md) = [`EventOwner`](../../Decl/type-aliases/EventOwner.md)

### Parameters

#### message

[`ReactiveEventErrorMessage`](../type-aliases/ReactiveEventErrorMessage.md)\<`PackageKey`, `ChannelType`\>

### Returns

[`ReactiveEventErrorInternal`](../classes/ReactiveEventErrorInternal.md)\<`PackageKey`, `ChannelType`\>

## Call Signature

```ts
function ReactiveEventError<PackageKey, ChannelType, OwnerType>(
	message,
	payload,
): ReactiveEventErrorInternal<PackageKey, ChannelType>;
```

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

#### ChannelType

`ChannelType` _extends_ `never`

#### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../Decl/type-aliases/EventOwner.md) = [`EventOwner`](../../Decl/type-aliases/EventOwner.md)

### Parameters

#### message

[`ReactiveEventErrorMessage`](../type-aliases/ReactiveEventErrorMessage.md)\<`PackageKey`, `ChannelType`\>

#### payload

[`ReactiveEventErrorPayload`](../type-aliases/ReactiveEventErrorPayload.md)\<`PackageKey`, `ChannelType`\>

### Returns

[`ReactiveEventErrorInternal`](../classes/ReactiveEventErrorInternal.md)\<`PackageKey`, `ChannelType`\>
