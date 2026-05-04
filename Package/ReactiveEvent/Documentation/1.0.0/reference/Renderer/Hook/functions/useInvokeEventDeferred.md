[reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / useInvokeEventDeferred

# useInvokeEventDeferred Function

```ts
function useInvokeEventDeferred<PackageKey>(): readonly [
	InvokeEventDeferred<PackageKey>,
];
```

Returns a copy of [InvokeEventDeferred](../type-aliases/InvokeEventDeferred.md), to invoke events at a desired time.

## Type Parameters

### PackageKey

`PackageKey` _extends_ `"__Internal__"`

The unique string that identifies your package.

## Returns

readonly \[[`InvokeEventDeferred`](../type-aliases/InvokeEventDeferred.md)\<`PackageKey`\>\]

An [InvokeEventDeferred](../type-aliases/InvokeEventDeferred.md) function.
