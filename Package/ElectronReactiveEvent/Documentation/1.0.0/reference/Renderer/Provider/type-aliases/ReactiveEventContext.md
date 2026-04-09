[electron-reactive-event](../../../index.md) / [Renderer/Provider](../index.md) / ReactiveEventContext

# ReactiveEventContext Type

```ts
type ReactiveEventContext = object;
```

The context used in this package. It currently only has one property, [ipcRenderer](#ipcrenderer).
See the documentation for the [ipcRenderer](#ipcrenderer) property to see what is needed to
use `electron-reactive-event` in the `renderer`.

## Properties

### ipcRenderer

```ts
ipcRenderer: Pick<
	IpcRenderer,
	"invoke" | "send" | "sendSync" | "off" | "on" | "once"
>;
```

Your app must use the [ReactiveEventProvider](../functions/ReactiveEventProvider.md), and supply
the necessary IPC functions from [IpcRenderer](https://www.electronjs.org/docs/latest/api/ipc-renderer)
(see note) exposed from a
[preload script](https://www.electronjs.org/docs/latest/tutorial/tutorial-preload#what-is-a-preload-script).

#### Note

It is generally discouraged to expose the raw IPC functions; instead, consider exposing functions
that wrap the IPC functions, which do not forward calls that seem unusual.
