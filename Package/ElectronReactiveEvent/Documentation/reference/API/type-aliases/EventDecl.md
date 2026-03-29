[electron-reactive-event](../../index.md) / [API](../index.md) / EventDecl

# Type: EventDecl

```ts
type EventDecl<OwnerType, RequestDeclType, ResponseDeclType, ErrorMessageDeclType, ErrorPayloadDeclType> = AreArgumentsSerializable<RequestDeclType, ResponseDeclType, ErrorMessageDeclType, ErrorPayloadDeclType> extends true ? object : never;
```

Define event declarations with this type.
This is the type that you will likely use the most.

## Type Parameters

### OwnerType

`OwnerType` *extends* [`Owner`](../../Shared/namespaces/Registrar/type-aliases/Owner.md)

### RequestDeclType

`RequestDeclType`

### ResponseDeclType

`ResponseDeclType`

### ErrorMessageDeclType

`ErrorMessageDeclType` *extends* `string` = `string`

### ErrorPayloadDeclType

`ErrorPayloadDeclType` = [`EmptyEventParameter`](EmptyEventParameter.md)
