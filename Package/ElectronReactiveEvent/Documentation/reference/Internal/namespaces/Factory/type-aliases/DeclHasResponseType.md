[electron-reactive-event](../../../../index.md) / [Internal](../../../index.md) / [Factory](../index.md) / DeclHasResponseType

# Type Alias: DeclHasResponseType\<ChannelType, Registrar\>

```ts
type DeclHasResponseType<ChannelType, Registrar> = ResponseDeclKey extends keyof Registrar[ChannelType] ? Registrar[ChannelType][ResponseDeclKey] extends EmptyEventParameter ? false : true : never;
```

## Type Parameters

### ChannelType

`ChannelType` *extends* keyof `Registrar`

### Registrar

`Registrar`
