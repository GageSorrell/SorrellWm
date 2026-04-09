[electron-reactive-event](../index.md) / Error

# Error

## Classes

| Class                                                               | Description                                                                                                            |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| [ReactiveEventErrorInternal](classes/ReactiveEventErrorInternal.md) | Describes an error of an event. This is used by `handle`, and is translated into the response given to the `renderer`. |

## Type Aliases

| Type Alias                                                                       | Description                                                                                                                                                                                                                                                         |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ErrorPayloadKey](type-aliases/ErrorPayloadKey.md)                               | The key of the payload in ErrorNormalized.                                                                                                                                                                                                                          |
| [ReactiveEventErrorData](type-aliases/ReactiveEventErrorData.md)                 | When an error is given to the `renderer` as a result of a `handler` returning an error, this is the type of that `error` property.                                                                                                                                  |
| [ReactiveEventErrorDataInternal](type-aliases/ReactiveEventErrorDataInternal.md) | An error that always has a `Payload` property (it is [EmptyOverloadParameter](../Listener/type-aliases/EmptyOverloadParameter.md) if empty).                                                                                                                        |
| [ReactiveEventErrorMessage](type-aliases/ReactiveEventErrorMessage.md)           | The message of an error type, derived from [ReactiveEventErrorDataInternal](type-aliases/ReactiveEventErrorDataInternal.md).                                                                                                                                        |
| [ReactiveEventErrorPayload](type-aliases/ReactiveEventErrorPayload.md)           | The payload of an error type, derived from [ReactiveEventErrorDataInternal](type-aliases/ReactiveEventErrorDataInternal.md). It is [EmptyOverloadParameter](../Listener/type-aliases/EmptyOverloadParameter.md) if the event declaration has no error payload type. |

## Functions

| Function                                              | Description                                                                                         |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [ReactiveEventError](functions/ReactiveEventError.md) | An error of an event. Returning this in your handler is how errors are described to the `renderer`. |
