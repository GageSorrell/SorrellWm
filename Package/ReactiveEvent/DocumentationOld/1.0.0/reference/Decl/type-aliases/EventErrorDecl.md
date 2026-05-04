[reactive-event](../../index.md) / [Decl](../index.md) / EventErrorDecl

# EventErrorDecl Type

```ts
type EventErrorDecl<MessageType, PayloadType> =
	| MessageType
	| EventErrorTuple<MessageType, PayloadType>
	| EventErrorRecord<MessageType, PayloadType>;
```

Define an error type as just a message type, or as message and payload
types, either as a tuple-type or record-type.

## Type Parameters

### MessageType

`MessageType` _extends_ `string` = `string`

The message type of the error.

### PayloadType

`PayloadType` = `unknown`

The payload type of the error.
