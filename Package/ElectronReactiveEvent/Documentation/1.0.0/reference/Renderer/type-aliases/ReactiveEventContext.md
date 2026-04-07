[electron-reactive-event](../../index.md) / [Renderer](../index.md) / ReactiveEventContext

# ReactiveEventContext Type

```ts
type ReactiveEventContext = object;
```

## Properties

### ipcRenderer

```ts
ipcRenderer: Pick<
	typeof ipcRenderer,
	"invoke" | "send" | "sendSync" | "off" | "on" | "once"
>;
```
