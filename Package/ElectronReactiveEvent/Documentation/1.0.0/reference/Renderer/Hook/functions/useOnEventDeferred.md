[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / useOnEventDeferred

# useOnEventDeferred Function

```ts
function useOnEventDeferred<PackageKey>(): readonly [
	OnEventDeferred<PackageKey>,
];
```

Returns an [OnEventDeferred](../type-aliases/OnEventDeferred.md), to subscribe to `main` events when desired.

## Type Parameters

### PackageKey

`PackageKey` _extends_ `"__Internal__"`

The unique string that identifies your package.

## Returns

readonly \[[`OnEventDeferred`](../type-aliases/OnEventDeferred.md)\<`PackageKey`\>\]

An [OnEventDeferred](../type-aliases/OnEventDeferred.md) function.
