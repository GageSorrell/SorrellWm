[electron-reactive-event](../../../../../index.md) / [API](../../../../index.md) / [Callback](../../index.md) / ReturnType

# ReturnType

The values used to construct a "!ReturnType:type".

## Remarks

It is important to understand the distinction between the return types
of (1) the callbacks that you give to `electron-reactive-event` (via a `register` function),
and (2) the `send` functions that return *transformed* output of your callbacks.

This module defines the types that your callbacks can return.

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [Error](type-aliases/Error.md) | The type of the `Error` property |
| [Success](type-aliases/Success.md) | - |
