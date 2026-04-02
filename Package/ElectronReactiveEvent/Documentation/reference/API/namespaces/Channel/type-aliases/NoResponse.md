[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Channel](../index.md) / NoResponse

# NoResponse Type

```ts
type NoResponse<Registrar> = Extract<
	RegistrarWithNames<Registrar>,
	IEventDeclNoResponse
>;
```

Channels whose event declarations do _not_ define a response type.

## Type Parameters

### Registrar

`Registrar`
