[electron-reactive-event](../../../../index.md) / [Internal](../../../index.md) / [Factory](../index.md) / DeclHasRequestType

# Type Alias: DeclHasRequestType\<ChannelType, Registrar\>

```ts
type DeclHasRequestType<ChannelType, Registrar> = RequestDeclKey extends keyof Registrar[ChannelType] ? Registrar[ChannelType][RequestDeclKey] extends EmptyEventParameter ? false : true : never;
```

## Type Parameters

### ChannelType

`ChannelType` *extends* keyof `Registrar`

### Registrar

`Registrar`
