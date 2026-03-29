[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Channel](../index.md) / NoRequest

# Type: NoRequest

```ts
type NoRequest<Registrar> = Extract<Channel<Registrar>, WithRequestHelper<Registrar>>;
```

Channels whose event declarations do *not* specify a request type.

## Type Parameters

### Registrar

`Registrar` *extends* [`IRegistrarBase`](../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)
