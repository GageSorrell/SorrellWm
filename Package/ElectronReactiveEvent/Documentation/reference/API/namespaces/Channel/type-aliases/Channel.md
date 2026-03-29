[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Channel](../index.md) / Channel

# Type Alias: Channel\<Registrar\>

```ts
type Channel<Registrar> = Exclude<keyof Registrar, "Owner" | symbol | number>;
```

A channel is the (`string`) key of an event declaration property in a registrar.

## Type Parameters

### Registrar

`Registrar` *extends* [`IRegistrarBase`](../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)
