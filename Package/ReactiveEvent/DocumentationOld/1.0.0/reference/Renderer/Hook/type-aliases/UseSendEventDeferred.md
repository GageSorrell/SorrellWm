[reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / UseSendEventDeferred

# UseSendEventDeferred Type

```ts
type UseSendEventDeferred<PackageKey> = () => readonly [
	SendEventDeferred<PackageKey>,
];
```

Returns a [SendEventDeferred](SendEventDeferred.md) function, to send events when desired.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

## Returns

readonly \[[`SendEventDeferred`](SendEventDeferred.md)\<`PackageKey`\>\]

A [SendEventDeferred](SendEventDeferred.md) function.
