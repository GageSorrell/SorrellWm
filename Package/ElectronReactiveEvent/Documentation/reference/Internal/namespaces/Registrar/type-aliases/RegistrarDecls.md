[electron-reactive-event](../../../../index.md) / [Internal](../../../index.md) / [Registrar](../index.md) / RegistrarDecls

# Type: RegistrarDecls

```ts
type RegistrarDecls<Registrar> = IsRegistrar<Registrar> extends true ? { [Key in keyof Registrar as Extract<keyof Registrar, string>]: Registrar[Key] } : never;
```

Map a registrar interface to its naturally-corresponding `Record` type.

## Type Parameters

### Registrar

`Registrar`
