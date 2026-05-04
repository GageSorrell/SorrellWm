[reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / InvokeOptionsOverloadedArgument

# InvokeOptionsOverloadedArgument Type

```ts
type InvokeOptionsOverloadedArgument<SuspendsType> =
	| InvokeOptions<SuspendsType>
	| EmptyOverloadParameter
	| undefined;
```

The type used by [InvokeResponseInternal](InvokeResponseInternal.md) for the third argument of
the overloaded (private) signature of [useInvokeEvent](../functions/useInvokeEvent.md).

## Type Parameters

### SuspendsType

`SuspendsType` _extends_ `boolean` = `boolean`
