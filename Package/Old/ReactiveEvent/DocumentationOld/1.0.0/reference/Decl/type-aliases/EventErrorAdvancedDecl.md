[reactive-event](../../index.md) / [Decl](../index.md) / EventErrorAdvancedDecl

# EventErrorAdvancedDecl Type

```ts
type EventErrorAdvancedDecl<Parameter, MessageType, PayloadType> = Parameter;
```

Define an error type as a discriminated union of `MessageType`, `PayloadType` combinations.

## Type Parameters

### Parameter

`Parameter` _extends_ [`EventErrorAdvancedDeclParameter`](EventErrorAdvancedDeclParameter.md)\<`MessageType`, `PayloadType`\>

### MessageType

`MessageType` _extends_ `string` = `string`

The message type of the error.

### PayloadType

`PayloadType` = `unknown`

The payload type of the error.
