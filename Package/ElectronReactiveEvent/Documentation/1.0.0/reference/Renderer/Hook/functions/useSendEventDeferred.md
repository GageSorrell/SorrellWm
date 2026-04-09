[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / useSendEventDeferred

# useSendEventDeferred Function

```ts
function useSendEventDeferred<PackageKey>(): readonly [
	SendEventDeferred<PackageKey>,
];
```

Returns a [SendEventDeferred](../type-aliases/SendEventDeferred.md) function, to send events when desired.

## Type Parameters

### PackageKey

`PackageKey` _extends_ `"__Internal__"`

The unique string that identifies your package.

## Returns

readonly \[[`SendEventDeferred`](../type-aliases/SendEventDeferred.md)\<`PackageKey`\>\]

A [SendEventDeferred](../type-aliases/SendEventDeferred.md) function.
