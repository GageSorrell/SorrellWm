[electron-reactive-event](../../index.md) / [API](../index.md) / EmptyEventParameter

# EmptyEventParameter Type

```ts
type EmptyEventParameter = [never];
```

Use this type in [event declarations](/articles/glossary.html#event-declarations)
to specify that a type parameter is unused. This can be used for any type parameter
in [EventDecl](EventDecl.md) but the [EventDecl.ErrorMessageDeclType](EventDecl.md) parameter (which `extends string`).
