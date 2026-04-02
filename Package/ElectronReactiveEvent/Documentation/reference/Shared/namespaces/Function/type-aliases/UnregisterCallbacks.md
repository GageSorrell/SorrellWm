[electron-reactive-event](../../../../index.md) / [Shared](../../../index.md) / [Function](../index.md) / UnregisterCallbacks

# UnregisterCallbacks Type

```ts
type UnregisterCallbacks<Registrar> = FactoryReturnType<
	IMainRegistrarBase,
	Registrar
>["registerCallbacks"];
```

## Type Parameters

### Registrar

`Registrar` _extends_ [`IRendererRegistrarBase`](../../Registrar/interfaces/IRendererRegistrarBase.md)
