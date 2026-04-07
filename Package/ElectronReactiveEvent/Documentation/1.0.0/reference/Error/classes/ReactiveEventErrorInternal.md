[electron-reactive-event](../../index.md) / [Error](../index.md) / ReactiveEventErrorInternal

# ReactiveEventErrorInternal Class

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../Internal/type-aliases/PackageKeys.md)

### ChannelType

`ChannelType` _extends_ [`ErrorMessage`](../../Channel/namespaces/Channel/namespaces/Handler/type-aliases/ErrorMessage.md)\<`PackageKey`\>

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
