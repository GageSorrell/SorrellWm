[electron-reactive-event](../../../../index.md) / [Channel](../../../index.md) / [Channel](../index.md) / Request

# Request Type

```ts
type Request<PackageKey, Owner> = Extract<
	Any<PackageKey, Owner>,
	Extract<Values<WithRequestHelper<PackageKey>>, string>
>;
```

Channels whose event declarations specify a request type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../Internal/type-aliases/PackageKeys.md)

The name of the package that imports from `electron-reactive-event`.
This string type does not need to literally match the `name` property of your `package.json`, but
it is recommended to do so.

### Owner

`Owner` _extends_ [`EventOwner`](../../../../Decl/type-aliases/EventOwner.md)
