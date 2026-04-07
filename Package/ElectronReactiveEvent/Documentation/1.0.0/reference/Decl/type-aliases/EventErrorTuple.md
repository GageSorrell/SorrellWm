[electron-reactive-event](../../index.md) / [Decl](../index.md) / EventErrorTuple

# EventErrorTuple Type

```ts
type EventErrorTuple<MessageType, PayloadType> = [MessageType, PayloadType];
```

Define an error type as a message type and payload type.
This is equivalent to using [EventErrorRecord](EventErrorRecord.md), just as a
tuple-type. Any type assignable to [PayloadType](#payloadtype) will
be usable with any type assignable to [MessageType](#messagetype).

## Type Parameters

### MessageType

`MessageType` _extends_ `string` = `string`

The message type of the error.

### PayloadType

`PayloadType` = `unknown`

The payload type of the error.
