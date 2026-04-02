[electron-reactive-event](../../../../index.md) / [Internal](../../../index.md) / [Factory](../index.md) / DeclHasRequestType

# DeclHasRequestType Type

```ts
type DeclHasRequestType<ChannelType, Registrar> =
	RequestDeclKey extends keyof Registrar[ChannelType]
		? Registrar[ChannelType][RequestDeclKey] extends EmptyEventParameter
			? false
			: true
		: never;
```

## Type Parameters

### ChannelType

`ChannelType` _extends_ keyof `Registrar`

### Registrar

`Registrar`
