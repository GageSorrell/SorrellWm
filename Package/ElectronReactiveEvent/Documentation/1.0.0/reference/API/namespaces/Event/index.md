[electron-reactive-event](../../../index.md) / [API](../../index.md) / Event

# Event

## Type Aliases

| Type Alias                                   | Description                                                                                                                                                                                                                                                            |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ErrorMessage](type-aliases/ErrorMessage.md) | For a given event declaration, this is the error message type. It always extends `string`.                                                                                                                                                                             |
| [ErrorPayload](type-aliases/ErrorPayload.md) | For a given event declaration, this is the error payload type. The error payload type is _not_ guaranteed to exist, and is only recommended for conveying complex error states (that is, a robust string union type should be sufficient for most event declarations). |
| [Request](type-aliases/Request.md)           | This is the type that the developer will provide when firing events. It varies from the type that is sent via IPC.                                                                                                                                                     |
| [Response](type-aliases/Response.md)         | This is the type that the developer will return in their callbacks. It varies from the type that is sent via IPC.                                                                                                                                                      |
