[electron-reactive-event](../../../index.md) / [API](../../index.md) / Main

# Main

Functions for sending and receiving events in `main`.

Most of these functions are given by factories, to which
you pass your registrar types. These registrar types are
passed to the returned functions, so that the registrar
types only need to be given once.

## Namespaces

| Namespace                        | Description |
| -------------------------------- | ----------- |
| [Send](namespaces/Send/index.md) | -           |

## Type Aliases

| Type Alias                                             | Description                                                 |
| ------------------------------------------------------ | ----------------------------------------------------------- |
| [FactoryReturnType](type-aliases/FactoryReturnType.md) | The type returned by [getMainIpc](functions/getMainIpc.md). |
| [Response](type-aliases/Response.md)                   | The type received by `main` callbacks.                      |

## Functions

| Function                              | Description                                                                                                                                   |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [getMainIpc](functions/getMainIpc.md) | Get the IPC functions for sending and receiving events to/from the `renderer`. The returned functions are typed to your registrar interfaces. |
