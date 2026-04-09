[electron-reactive-event](../../index.md) / [Error](../index.md) / ReactiveEventErrorInternal

# ReactiveEventErrorInternal Class

Describes an error of an event. This is used by `handle`, and is translated
into the response given to the `renderer`.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### ChannelType

`ChannelType` _extends_ [`ErrorMessageOnly`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/ErrorMessageOnly.md)\<`PackageKey`\>

The channel that uniquely identifies the desired
event declaration.

## Constructors

### Constructor

```ts
new ReactiveEventErrorInternal<PackageKey, ChannelType>(Data): ReactiveEventErrorInternal<PackageKey, ChannelType>;
```

#### Parameters

##### Data

[`ReactiveEventErrorDataInternal`](../type-aliases/ReactiveEventErrorDataInternal.md)\<`PackageKey`, `ChannelType`\>

#### Returns

`ReactiveEventErrorInternal`\<`PackageKey`, `ChannelType`\>

## Properties

### Message

```ts
Message: ReactiveEventErrorMessage<PackageKey, ChannelType>;
```

---

### Payload

```ts
Payload:
  | typeof EmptyOverloadParameterValue
| ReactiveEventErrorPayload<PackageKey, ChannelType>;
```
