[electron-reactive-event](../../index.md) / [Renderer](../index.md) / ReactiveEventContext

# ReactiveEventContext Type

```ts
type ReactiveEventContext = object;
```

## Properties

### ipcRendererFunctions

```ts
ipcRendererFunctions: Pick<
	typeof ipcRenderer,
	"invoke" | "send" | "sendSync" | "off" | "on" | "once"
>;
```

---

### packageKey

```ts
packageKey: PackageKeys;
```
