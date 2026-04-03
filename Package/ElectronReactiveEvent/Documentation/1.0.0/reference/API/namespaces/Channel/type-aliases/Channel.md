[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Channel](../index.md) / Channel

# Channel Type

```ts
type Channel<Registrar> = Exclude<keyof Registrar, "Owner" | symbol | number>;
```

A channel is the (`string`) key of an event declaration property in a registrar.

## Type Parameters

### Registrar

`Registrar` _extends_ [`IRegistrarBase`](../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)
