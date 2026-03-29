[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Channel](../index.md) / NoResponse

# Type: NoResponse

```ts
type NoResponse<Registrar> = Extract<RegistrarWithNames<Registrar>, IEventDeclNoResponse>;
```

Channels whose event declarations do *not* define a response type.

## Type Parameters

### Registrar

`Registrar`
