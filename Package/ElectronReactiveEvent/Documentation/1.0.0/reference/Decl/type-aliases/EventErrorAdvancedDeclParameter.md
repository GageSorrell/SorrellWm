[electron-reactive-event](../../index.md) / [Decl](../index.md) / EventErrorAdvancedDeclParameter

# EventErrorAdvancedDeclParameter Type

```ts
type EventErrorAdvancedDeclParameter<MessageType, PayloadType> = object;
```

A pairing of a message type and payload type.
Use this with [EventErrorAdvancedDecl](EventErrorAdvancedDecl.md) to define
a discriminated union of possible error types.

## Type Parameters

### MessageType

`MessageType` _extends_ `string` = `string`

The message type of the error.

### PayloadType

`PayloadType` = `unknown`

The payload type of the error.

## Properties

### MessageType

```ts
MessageType: MessageType;
```

---

### PayloadType

```ts
PayloadType: PayloadType;
```
