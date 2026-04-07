[electron-reactive-event](/docs) / [Guides](./) / Declaring Events

# Declaring Events

::: tip Purpose
This article describes what event declarations are, and what considerations should be made when defining them.
:::

<div class="CustomTocContainer">
<p class="CustomTocTitle">In this article</p>

[[toc]]

</div>

## Basic Shape

Each event declaration contains up to four properties,

1. a request type
2. a response type
3. an error message type
4. an error payload type

Only the error message type is required.
When creating event declarations, the type `EmptyEventParameter` can be used to not define a type in `EventDecl`.

### Request

The request type can be any type.
If one is specified, then when sending an event, a request parameter will be required of the specified type.
The functions to send events are typed so that your IDE will highlight the function call if a request argument is not provided.

### Response

The response type can be any type.
If one is specified, then, for a given callback that is registered for the given event declaration, if the callback returns an object with a `Data` property, its type must be the response type.
The functions to send events are typed so that your IDE will highlight the `registerCallback` call if the callback returns an object with a `Data` property not of this type.

### Error Message

The error message type must extend `string`.
For a given event declaration and callback that is registered for that event declaration, if the callback returns an object with an `Error` property, then,

* if an error payload type is also specified, then the `Error` property must have a `Message` property of the error message type
* if no error payload type is specified, then the `Error` property must be of the specified error message type.

The consequence of this is that if you do not define an error payload type, then you may simply return the error message via the `Error` property, instead of specifying the `Message` property, which would attempt to distinguish the error message from an error payload that does not exist.

### Error Payload

This can be any type, but it is expected that most event declarations will not use this.
If an error payload type is specified, then for a given event declaration and callback that is registered for that event declaration, if the callback returns an object with an `Error` property, the `Error` property must have `Message` *and* `Payload` properties of the respective types given in the event declaration.
