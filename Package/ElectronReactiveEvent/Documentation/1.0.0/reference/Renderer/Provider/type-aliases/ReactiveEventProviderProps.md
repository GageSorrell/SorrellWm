[electron-reactive-event](../../../index.md) / [Renderer/Provider](../index.md) / ReactiveEventProviderProps

# ReactiveEventProviderProps Type

```ts
type ReactiveEventProviderProps = PropsWithChildren<{
	value: ReactiveEventContext;
}>;
```

This wraps your application; it accepts the the necessary IPC functions from
[IpcRenderer](https://www.electronjs.org/docs/latest/api/ipc-renderer)
that you must expose (see note) via a
[preload script](https://www.electronjs.org/docs/latest/tutorial/tutorial-preload#what-is-a-preload-script).

## Note

It is generally discouraged to expose the raw IPC functions; instead, consider exposing functions
that wrap the IPC functions, which do not forward calls that seem unusual.
