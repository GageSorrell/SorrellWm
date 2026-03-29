[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Main](../index.md) / FactoryReturnType

# Type Alias: FactoryReturnType\<MainRegistrar, RendererRegistrar\>

```ts
type FactoryReturnType<MainRegistrar, RendererRegistrar> = object;
```

## Type Parameters

### MainRegistrar

`MainRegistrar` *extends* [`IMainRegistrarBase`](../../../../Shared/namespaces/Registrar/interfaces/IMainRegistrarBase.md)

### RendererRegistrar

`RendererRegistrar` *extends* [`IRendererRegistrarBase`](../../../../Shared/namespaces/Registrar/interfaces/IRendererRegistrarBase.md)

## Properties

### registerCallback

```ts
registerCallback: Main<RendererRegistrar>;
```

***

### registerCallbacks

```ts
registerCallbacks: ByRecord<RendererRegistrar>;
```

Register multiple callbacks for a given set of event declarations.
The keys are taken to be the `ChannelType`s, and the respective values are the
callbacks that will be registered for their respective `ChannelType`s.

***

### send

```ts
send: Send<MainRegistrar>;
```

***

### unregisterAll()

```ts
unregisterAll: () => void;
```

#### Returns

`void`

***

### unregisterCallback

```ts
unregisterCallback: UnregisterCallback<RendererRegistrar>;
```

***

### unregisterCallbacks

```ts
unregisterCallbacks: UnregisterCallbacks<RendererRegistrar>;
```
