[electron-reactive-event](../../index.md) / [Decl](../index.md) / EventErrorDecl

# EventErrorDecl Type

```ts
type EventErrorDecl<MessageType, PayloadType> =
	| MessageType
	| EventErrorTuple<MessageType, PayloadType>
	| EventErrorRecord<MessageType, PayloadType>;
```

## Type Parameters

### MessageType

`MessageType` _extends_ `string` = `string`

### PayloadType

`PayloadType` = `unknown`
