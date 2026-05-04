[reactive-event](../../../../../../index.md) / [Channel](../../../../../index.md) / [Channel](../../../index.md) / [Handler](../index.md) / NoResponse

# NoResponse Type

```ts
type NoResponse<PackageKey> = Exclude<
	Any<PackageKey>,
	Extract<Values<WithResponseHelper<PackageKey>>, string>
>;
```

[Handler](../index.md) channels whose event declarations do _not_ define a response type.

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

## Note

[Handler](../index.md) events with no response type can still return data to the
`renderer` as an error type.

## Type Param

The owner of the event declarations identified by this type.
