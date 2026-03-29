[electron-reactive-event](../../../../index.md) / [Internal](../../../index.md) / [Event](../index.md) / AreArgumentsSerializable

# Type: AreArgumentsSerializable

```ts
type AreArgumentsSerializable<RequestDeclType, ResponseDeclType, ErrorMessageDeclType, ErrorPayloadDeclType> = ErrorPayloadDeclType extends [never] ? 
  | IsSerializable<RequestDeclType>
  | IsSerializable<ResponseDeclType>
  | IsSerializable<ErrorMessageDeclType> : 
  | IsSerializable<RequestDeclType>
  | IsSerializable<ResponseDeclType>
  | IsSerializable<ErrorMessageDeclType>
| IsSerializable<ErrorPayloadDeclType>;
```

## Type Parameters

### RequestDeclType

`RequestDeclType`

### ResponseDeclType

`ResponseDeclType`

### ErrorMessageDeclType

`ErrorMessageDeclType`

### ErrorPayloadDeclType

`ErrorPayloadDeclType` = [`EmptyEventParameter`](../../../../API/type-aliases/EmptyEventParameter.md)
