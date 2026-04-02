[electron-reactive-event](../../../../index.md) / [Internal](../../../index.md) / [Factory](../index.md) / DeclHasResponseType

# DeclHasResponseType Type

```ts
type DeclHasResponseType<ChannelType, Registrar> =
	ResponseDeclKey extends keyof Registrar[ChannelType]
		? Registrar[ChannelType][ResponseDeclKey] extends EmptyEventParameter
			? false
			: true
		: never;
```

## Type Parameters

### ChannelType

`ChannelType` _extends_ keyof `Registrar`

### Registrar

`Registrar`
