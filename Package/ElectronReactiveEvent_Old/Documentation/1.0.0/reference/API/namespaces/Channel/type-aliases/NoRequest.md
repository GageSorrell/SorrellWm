[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Channel](../index.md) / NoRequest

# NoRequest Type

```ts
type NoRequest<Registrar> = Extract<
	Channel<Registrar>,
	WithRequestHelper<Registrar>
>;
```

Channels whose event declarations do _not_ specify a request type.

## Type Parameters

### Registrar

`Registrar` _extends_ [`IRegistrarBase`](../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)
