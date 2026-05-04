[reactive-event](../../../../../index.md) / [Channel](../../../../index.md) / [Channel](../../index.md) / Handler

# Handler

Channels of event declarations that can be used via [useInvokeEvent](../../../../../Renderer/Hook/type-aliases/UseInvokeEvent.md),
[handle](../../../../../Main/type-aliases/Handle.md) _et al._

## Type Aliases

| Type Alias                                           | Description                                                                                                                                                                          |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Any](type-aliases/Any.md)                           | Channels of event declarations that can be used via [send](../../../../../Main/type-aliases/Send.md), [useOnEvent](../../../../../Renderer/Hook/type-aliases/UseOnEvent.md) _et al._ |
| [Error](type-aliases/Error.md)                       | Handler channels whose event declarations define an error type.                                                                                                                      |
| [ErrorMessageOnly](type-aliases/ErrorMessageOnly.md) | Handler channels whose event declarations define an error _message_ type, but _not_ an error payload type.                                                                           |
| [ErrorPayload](type-aliases/ErrorPayload.md)         | Handler channels whose event declarations define an error type that includes a payload type.                                                                                         |
| [NoError](type-aliases/NoError.md)                   | Handler channels whose event declarations do _not_ define an error type.                                                                                                             |
| [NoRequest](type-aliases/NoRequest.md)               | Handler channels whose event declarations do _not_ define a request type.                                                                                                            |
| [NoResponse](type-aliases/NoResponse.md)             | Handler channels whose event declarations do _not_ define a response type.                                                                                                           |
| [Request](type-aliases/Request.md)                   | Handler channels whose event declarations define a request type.                                                                                                                     |
| [Response](type-aliases/Response.md)                 | Handler channels whose event declarations define a response type.                                                                                                                    |
