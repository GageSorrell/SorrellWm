[electron-reactive-event](../../../index.md) / [Channel](../../index.md) / Channel

# Channel

Channels are the `string`s that uniquely identify the event declarations of a given package.

## Namespaces

| Namespace                                | Description                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------ |
| [Handler](namespaces/Handler/index.md)   | Channels of event declarations that can be used via useInvoke, handle _et al._ |
| [Listener](namespaces/Listener/index.md) | Channels of event declarations that can be used via send, useOnEvent _et al._  |

## Type Aliases

| Type Alias                                           | Description                                                                                        |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [Any](type-aliases/Any.md)                           | Channels are the `string`s that uniquely identify the event declarations of a given package.       |
| [Error](type-aliases/Error.md)                       | Channels whose event declarations define an error type.                                            |
| [ErrorMessageOnly](type-aliases/ErrorMessageOnly.md) | Channels whose event declarations define an error _message_ type, but _not_ an error payload type. |
| [ErrorPayload](type-aliases/ErrorPayload.md)         | Channels whose event declarations define an error type that includes a payload type.               |
| [NoError](type-aliases/NoError.md)                   | Channel with no error type (_i.e._, no error message type and no error payload type).              |
| [NoRequest](type-aliases/NoRequest.md)               | Channels whose event declarations do _not_ specify a request type.                                 |
| [NoResponse](type-aliases/NoResponse.md)             | Channels whose event declarations do _not_ define a response type.                                 |
| [Request](type-aliases/Request.md)                   | Channels whose event declarations specify a request type.                                          |
| [Response](type-aliases/Response.md)                 | Channels whose event declarations define a response type.                                          |
