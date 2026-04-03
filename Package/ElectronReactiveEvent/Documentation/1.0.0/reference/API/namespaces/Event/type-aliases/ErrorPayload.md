[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Event](../index.md) / ErrorPayload

# ErrorPayload Type

```ts
type ErrorPayload<ChannelType, Registrar> =
	ErrorPayloadDeclKey extends keyof Registrar[ChannelType]
		? Registrar[ChannelType][ErrorPayloadDeclKey]
		: never;
```

For a given event declaration, this is the error payload type.
The error payload type is _not_ guaranteed to exist, and is only recommended for conveying
complex error states (that is, a robust string union type should be sufficient for most
event declarations).

## Type Parameters

### ChannelType

`ChannelType` _extends_ keyof `Registrar`

The desired channel of the given [Registrar](#registrar).

### Registrar

`Registrar`

The registrar interface that holds the desired event declaration.
