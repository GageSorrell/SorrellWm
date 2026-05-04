[reactive-event](../../../index.md) / [Renderer/Hook](../index.md) / InvokeOptions

# InvokeOptions Type

```ts
type InvokeOptions<SuspendsType> = object;
```

The options that may be passed to [useInvokeEvent](../functions/useInvokeEvent.md).

## Type Parameters

### SuspendsType

`SuspendsType` _extends_ `boolean` = `boolean`

The type of the [suspend](#suspend) property, which is used to narrow down
the correct return type of [useInvokeEvent](../functions/useInvokeEvent.md).

## Properties

### suspend

```ts
suspend: SuspendsType;
```

Whether [useInvokeEvent](../functions/useInvokeEvent.md) should suspend until it receives a response from
`main`. If `true`, then the [InvokeResponse](InvokeResponse.md) returned will be of type [ResponseSync](../../../Listener/type-aliases/ResponseSync.md), _i.e._,
the `isPending` property will be omitted.
