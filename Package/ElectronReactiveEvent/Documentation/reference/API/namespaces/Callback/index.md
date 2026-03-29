[electron-reactive-event](../../../index.md) / [API](../../index.md) / Callback

# Callback

Types for callback functions, their arguments, and their return values.

## Namespaces

| Namespace | Description |
| ------ | ------ |
| [Argument](namespaces/Argument/index.md) | Arguments for callback functions provided to `electron-reactive-event`. |
| [RegisterFunction](namespaces/RegisterFunction/index.md) | Functions that are responsible for registering callbacks. |
| [ReturnType](namespaces/ReturnType/index.md) | The values used to construct a "!ReturnType:type". |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [AwaitedReturnType](type-aliases/AwaitedReturnType.md) | - |
| [Callback](type-aliases/Callback.md) | A function that is given to `electron-reactive-event` via one of the `register` functions or hooks. |
| [Main](type-aliases/Main.md) | `MainCallback`s live under `main`, *i.e.*, they receive `renderer` events. |
| [Record](type-aliases/Record.md) | A record of callbacks, such that the keys are `Channel`s, and the values are callbacks for event declarations given by their respective keys |
| [Renderer](type-aliases/Renderer.md) | `RendererCallback`s live under the `renderer`, *i.e.*, they receive `main` events. |
| [ReturnType](type-aliases/ReturnType.md) | This is the type that a `Callback` function must return. |
