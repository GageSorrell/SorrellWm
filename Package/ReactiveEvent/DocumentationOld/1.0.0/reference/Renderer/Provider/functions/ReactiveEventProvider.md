[reactive-event](../../../index.md) / [Renderer/Provider](../index.md) / ReactiveEventProvider

# ReactiveEventProvider Function

```ts
function ReactiveEventProvider(Props): ReactNode;
```

This is what provides the `reactive-event` hooks with the
necessary IPC functions from
[IpcRenderer](https://www.electronjs.org/docs/latest/api/ipc-renderer).
This must wrap your application where `reactive-event` is used.

## Parameters

### Props

[`ReactiveEventProviderProps`](../type-aliases/ReactiveEventProviderProps.md)

The children and necessary IPC functions.

## Returns

`ReactNode`

Your application, equipped with the functionality needed to use `reactive-event`.

## See

/guides/getting-started for more details.
