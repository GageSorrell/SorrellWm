[electron-reactive-event](../../../../index.md) / [Channel](../../../index.md) / [Channel](../index.md) / Any

# Any Type

```ts
type Any<PackageKey, Owner> = Exclude<
	keyof FilterByOwner<PackageKey, Owner>,
	number | symbol
>;
```

A channel is the (`string`) key of an event declaration property in a registrar,
namespaced to your package.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../Internal/type-aliases/PackageKeys.md)

The name of the package that imports from `electron-reactive-event`.
This string type does not need to literally match the `name` property of your `package.json`, but
it is recommended to do so.

### Owner

`Owner` _extends_ [`EventOwner`](../../../../Decl/type-aliases/EventOwner.md)
