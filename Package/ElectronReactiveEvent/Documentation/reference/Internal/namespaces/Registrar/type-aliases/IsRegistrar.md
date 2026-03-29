[electron-reactive-event](../../../../index.md) / [Internal](../../../index.md) / [Registrar](../index.md) / IsRegistrar

# Type Alias: IsRegistrar\<Registrar\>

```ts
type IsRegistrar<Registrar> = keyof Registrar extends string ? IsEventDecl<Values<Registrar>> extends true ? true : false : false;
```

## Type Parameters

### Registrar

`Registrar`
