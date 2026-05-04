[reactive-event](../../index.md) / [Decl](../index.md) / EventErrorRecord

# EventErrorRecord Type

```ts
type EventErrorRecord<MessageType, PayloadType> = object;
```

Define an error type as a message type and payload type.
This is equivalent to using [EventErrorTuple](EventErrorTuple.md), just as a
record-type. Any type assignable to [PayloadType](#payloadtype) will
be usable with any type assignable to [MessageType](#messagetype).

## Type Parameters

### MessageType

`MessageType` _extends_ `string` = `string`

The message type of the error.

### PayloadType

`PayloadType` = `unknown`

The payload type of the error.

## Properties

### Message

```ts
Message: MessageType;
```

---

### Payload

```ts
Payload: PayloadType;
```
