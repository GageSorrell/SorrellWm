[electron-reactive-event](../../../../../../index.md) / [Channel](../../../../../index.md) / [Channel](../../../index.md) / [Listener](../index.md) / Any

# Any Type

```ts
type Any<PackageKey, OwnerType> = Exclude<
	Any<PackageKey, OwnerType>,
	Any<PackageKey>
>;
```

Channels of event declarations that can be used via [send](../../../../../../Main/type-aliases/Send.md),
[useOnEvent](../../../../../../Renderer/Hook/type-aliases/UseOnEvent.md) _et al._

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

### OwnerType

`OwnerType` _extends_ [`EventOwner`](../../../../../../Decl/type-aliases/EventOwner.md)

The owner of the event declarations identified by this type.
