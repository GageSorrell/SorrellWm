[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Channel](../index.md) / Request

# Request Type

```ts
type Request<Registrar> = Extract<
	Channel<Registrar>,
	Values<WithRequestHelper<Registrar>>
>;
```

Channels whose event declarations specify a request type.

## Type Parameters

### Registrar

`Registrar` _extends_ [`IRegistrarBase`](../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)
