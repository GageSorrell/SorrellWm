[reactive-event](../../../../../../index.md) / [Channel](../../../../../index.md) / [Channel](../../../index.md) / [Handler](../index.md) / Any

# Any Type

```ts
type Any<PackageKey> =
	| Response<PackageKey, RendererOwner>
	| Error<PackageKey, RendererOwner>;
```

Channels of event declarations that can be used via [send](../../../../../../Main/type-aliases/Send.md),
[useOnEvent](../../../../../../Renderer/Hook/type-aliases/UseOnEvent.md) _et al._

## Type Parameters

### PackageKey

`PackageKey` _extends_ [`PackageKeys`](../../../../../../Internal/type-aliases/PackageKeys.md)

The unique string that identifies your package.

## Type Param

The owner of the event declarations identified by this type.
