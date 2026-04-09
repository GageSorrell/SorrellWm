[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / EqualityCheck

# EqualityCheck Type

```ts
type EqualityCheck<Type> = (A, B) => boolean;
```

A predicate function which determines whether objects of a given [Type](#type)
are equivalent _in some sense_.

## Type Parameters

### Type

`Type`

The type of the objects being compared.

## Parameters

### A

`Type`

The first argument being considered.

### B

`Type`

The second argument being considered.

## Returns

`boolean`

Whether A and B are equivalent.
