[electron-reactive-event](../index.md) / Main

# Main

## Type Aliases

| Type Alias                                                       | Description                                                                                                                                                                              |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Handle](type-aliases/Handle.md)                                 | The type-safe form of [IpcMain.handle](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainhandlechannel-listener).                                                               |
| [HandleOnce](type-aliases/HandleOnce.md)                         | The type-safe form of [IpcMain.handleOnce](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainhandleoncechannel-listener).                                                       |
| [IpcMainReactive](type-aliases/IpcMainReactive.md)               | The [IpcMain](https://www.electronjs.org/docs/latest/api/ipc-main) type, but with the type-safe IPC functions given in [ReactiveEventFunctions](type-aliases/ReactiveEventFunctions.md). |
| [MainListener](type-aliases/MainListener.md)                     | The type-safe type of the listener passed to IpcMainReactive.on _et al._ [IpcMain.on](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainonchannel-listener) _et al._            |
| [NativeEventListener](type-aliases/NativeEventListener.md)       | The type of the listener passed to [IpcMain.on](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainonchannel-listener) _et al._                                                  |
| [NativeHandlerListener](type-aliases/NativeHandlerListener.md)   | The type of the listener passed to [IpcMain.handle](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainhandlechannel-listener) _et al._                                          |
| [Off](type-aliases/Off.md)                                       | The type-safe form of [IpcMain.off](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainoffchannel-listener).                                                                     |
| [On](type-aliases/On.md)                                         | The type-safe form of [IpcMain.on](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainonchannel-listener).                                                                       |
| [Once](type-aliases/Once.md)                                     | The type-safe form of [IpcMain.once](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainoncechannel-listener).                                                                   |
| [ReactiveEventFunctions](type-aliases/ReactiveEventFunctions.md) | Type-safe IPC functions for events sent by `main`.                                                                                                                                       |
| [RemoveAllListeners](type-aliases/RemoveAllListeners.md)         | The type-safe form of [IpcMain.removeAllListeners](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainremovealllistenerschannel).                                                |
| [RemoveHandler](type-aliases/RemoveHandler.md)                   | The type-safe form of [IpcMain.removeHandler](https://www.electronjs.org/docs/latest/api/ipc-main#ipcmainremovehandlerchannel).                                                          |
| [Send](type-aliases/Send.md)                                     | The type-safe form of IpcMain.send.                                                                                                                                                      |
| [SendableEventHandler](type-aliases/SendableEventHandler.md)     | The type-safe form of the listener passed to IpcMain.on _et al._                                                                                                                         |

## Functions

| Function                                                        | Description                                                                                                                                                                         |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [getReactiveIpcFunctions](functions/getReactiveIpcFunctions.md) | This is the entrypoint of `electron-reactive-event` for `main`.                                                                                                                     |
| [getReactiveIpcMain](functions/getReactiveIpcMain.md)           | Get an object that replaces [IpcMain's](https://www.electronjs.org/docs/latest/api/ipc-main) IPC functions with their respective `electron-reactive-event`, type-safe counterparts. |
| [removeHandler](functions/removeHandler.md)                     | -                                                                                                                                                                                   |

## Internal

Content used internally by the Main module.
This module (as well as the Hook module) defines its functions
internally, then exports them cast to types that omit the `PackageKey`
type parameter. This way, you do not need to specify the name of your
package with every hook call.

| Function                                              | Description |
| ----------------------------------------------------- | ----------- |
| [handle](functions/handle.md)                         | -           |
| [handleOnce](functions/handleOnce.md)                 | -           |
| [off](functions/off.md)                               | -           |
| [on](functions/on.md)                                 | -           |
| [once](functions/once.md)                             | -           |
| [removeAllListeners](functions/removeAllListeners.md) | -           |
| [send](functions/send.md)                             | -           |
