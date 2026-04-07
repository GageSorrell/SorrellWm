[electron-reactive-event](../../../../index.md) / [Channel](../../../index.md) / [Channel](../index.md) / NoRequest

# NoRequest Type

```ts
type NoRequest<PackageKey, Owner> = Exclude<
	Any<PackageKey, Owner>,
	Extract<Values<WithRequestHelper<PackageKey>>, string>
>;
```

Channels whose event declarations do _not_ specify a request type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../Internal/type-aliases/PackageKeys.md)

The name of the package that imports from `electron-reactive-event`.
This string type does not need to literally match the `name` property of your `package.json`, but
it is recommended to do so.

### Owner

`Owner` _extends_ [`EventOwner`](../../../../Decl/type-aliases/EventOwner.md)
