[reactive-event](../../index.md) / [Error](../index.md) / ReactiveEventError

# ReactiveEventError Function

## Call Signature

```ts
function ReactiveEventError<PackageKey, ChannelType, OwnerType>(
	message,
): ReactiveEventErrorInternal<PackageKey, ChannelType>;
```

An error of an event. Returning this in your handler is how errors are
described to the `renderer`.

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

The unique string that identifies your package.

#### ChannelType

`ChannelType` _extends_ `never`

The channel that uniquely identifies the desired
event declaration.

#### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../Decl/type-aliases/EventOwner.md) = [`EventOwner`](../../Decl/type-aliases/EventOwner.md)

The owner of the given event declaration.

### Parameters

#### message

[`ReactiveEventErrorMessage`](../type-aliases/ReactiveEventErrorMessage.md)\<`PackageKey`, `ChannelType`\>

The message of this event's error.

### Returns

[`ReactiveEventErrorInternal`](../classes/ReactiveEventErrorInternal.md)\<`PackageKey`, `ChannelType`\>

The internal-facing object that describes the error.

## Call Signature

```ts
function ReactiveEventError<PackageKey, ChannelType, OwnerType>(
	message,
	payload,
): ReactiveEventErrorInternal<PackageKey, ChannelType>;
```

An error of an event. Returning this in your handler is how errors are
described to the `renderer`.

### Type Parameters

#### PackageKey

`PackageKey` _extends_ `"__Internal__"`

The unique string that identifies your package.

#### ChannelType

`ChannelType` _extends_ `never`

The channel that uniquely identifies the desired
event declaration.

#### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../Decl/type-aliases/EventOwner.md) = [`EventOwner`](../../Decl/type-aliases/EventOwner.md)

The owner of the given event declaration.

### Parameters

#### message

[`ReactiveEventErrorMessage`](../type-aliases/ReactiveEventErrorMessage.md)\<`PackageKey`, `ChannelType`\>

The message of this event's error.

#### payload

[`ReactiveEventErrorPayload`](../type-aliases/ReactiveEventErrorPayload.md)\<`PackageKey`, `ChannelType`\>

The payload of this event's error.

### Returns

[`ReactiveEventErrorInternal`](../classes/ReactiveEventErrorInternal.md)\<`PackageKey`, `ChannelType`\>

The internal-facing object that describes the error.
