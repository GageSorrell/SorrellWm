[electron-reactive-event](../../../../../index.md) / [API](../../../../index.md) / [Renderer](../../index.md) / Provider

# Provider

## Namespaces

| Namespace                        | Description |
| -------------------------------- | ----------- |
| [Send](namespaces/Send/index.md) | -           |

## Type Aliases

| Type Alias                                                                       | Description                                                                                                                                                                                               |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [EventContext](type-aliases/EventContext.md)                                     | The context used by the [ReactiveEventProviderComponent](type-aliases/ReactiveEventProviderComponent.md). This type is analogous to [FactoryReturnType](../../../Main/type-aliases/FactoryReturnType.md). |
| [ReactiveEventProviderComponent](type-aliases/ReactiveEventProviderComponent.md) | -                                                                                                                                                                                                         |

## Variables

| Variable                                            | Description |
| --------------------------------------------------- | ----------- |
| [FactoryContextRef](variables/FactoryContextRef.md) | -           |

## Functions

| Function                                                          | Description                                                                                                                                                                                                          |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [GetReactiveEventProvider](functions/GetReactiveEventProvider.md) | The main provider for `electron-reactive-event`. You likely want to wrap this with your own provider in which you provide a `value` containing the `ipcRenderer` functions that you exposed via `exposeInMainWorld`. |
