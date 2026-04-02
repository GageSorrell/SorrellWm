[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Channel](../index.md) / Response

# Response Type

```ts
type Response<Registrar> = Exclude<
	RegistrarWithNames<Registrar>,
	IEventDeclNoResponse
>;
```

Channels whose event declarations define a response type.

## Type Parameters

### Registrar

`Registrar`
