[electron-reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / getReactiveEventHooks

# getReactiveEventHooks Function

```ts
function getReactiveEventHooks<PackageKey>(): ReactiveEventHooks<PackageKey>;
```

This is the entrypoint of `electron-reactive-event` in the `renderer`.
To use these functions, you must wrap the part of your application in which
you wish to use `electron-reactive-event` in a ReactiveEventProvider
(to which you must supply the necessary
[IpcRenderer functions](https://www.electronjs.org/docs/latest/api/ipc-renderer)).

## Type Parameters

### PackageKey

`PackageKey` _extends_ `"__Internal__"`

The unique string that identifies your package.

## Returns

[`ReactiveEventHooks`](../type-aliases/ReactiveEventHooks.md)\<`PackageKey`\>

The hooks provided by `electron-reactive-event`, scoped to your [PackageKey](#getreactiveeventhookspackagekey).
