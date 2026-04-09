[electron-reactive-event](../../index.md) / Renderer/Provider

# Renderer/Provider

## Type Aliases

| Type Alias                                                               | Description                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ReactiveEventContext](type-aliases/ReactiveEventContext.md)             | The context used in this package. It currently only has one property, [ipcRenderer](type-aliases/ReactiveEventContext.md#ipcrenderer). See the documentation for the [ipcRenderer](type-aliases/ReactiveEventContext.md#ipcrenderer) property to see what is needed to use `electron-reactive-event` in the `renderer`. |
| [ReactiveEventProviderProps](type-aliases/ReactiveEventProviderProps.md) | This wraps your application; it accepts the the necessary IPC functions from [IpcRenderer](https://www.electronjs.org/docs/latest/api/ipc-renderer) that you must expose (see note) via a [preload script](https://www.electronjs.org/docs/latest/tutorial/tutorial-preload#what-is-a-preload-script).                  |

## Functions

| Function                                                    | Description                                                                                                                                                                                                                                      |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [ReactiveEventProvider](functions/ReactiveEventProvider.md) | This is what provides the `electron-reactive-event` hooks with the necessary IPC functions from [IpcRenderer](https://www.electronjs.org/docs/latest/api/ipc-renderer). This must wrap your application where `electron-reactive-event` is used. |

## Internal

Content used internally by the Provider module.

| Name                                                                         | Description                                                                                                                                                             |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ReactiveEventContextInternal](type-aliases/ReactiveEventContextInternal.md) | The context used by the hooks in this package. It is currently just [ReactiveEventContext](type-aliases/ReactiveEventContext.md), but it may be expanded in the future. |
| [ReactiveEventInternalContext](variables/ReactiveEventInternalContext.md)    | This is the context used by `electron-reactive-event`.                                                                                                                  |
