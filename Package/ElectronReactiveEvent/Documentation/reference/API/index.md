[electron-reactive-event](../index.md) / API

# API

The exports of the package.
Most of your time reading the documentation will likely be spent here.

## Namespaces

| Namespace                                | Description                                                                         |
| ---------------------------------------- | ----------------------------------------------------------------------------------- |
| [Callback](namespaces/Callback/index.md) | Types for callback functions, their arguments, and their return values.             |
| [Channel](namespaces/Channel/index.md)   | -                                                                                   |
| [Event](namespaces/Event/index.md)       | -                                                                                   |
| [Main](namespaces/Main/index.md)         | Functions for sending and receiving events in `main`.                               |
| [Renderer](namespaces/Renderer/index.md) | Functions (hooks and factories) for sending and receiving events in the `renderer`. |
| [Utility](namespaces/Utility/index.md)   | -                                                                                   |

## Event Declarations

| Type Alias                                                 | Description                                                                                                                                                                                                                                                                                                             |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [EmptyEventParameter](type-aliases/EmptyEventParameter.md) | Use this type in [event declarations](/articles/glossary.html#event-declarations) to specify that a type parameter is unused. This can be used for any type parameter in [EventDecl](type-aliases/EventDecl.md) but the [EventDecl.ErrorMessageDeclType](type-aliases/EventDecl.md) parameter (which `extends string`). |
| [EventDecl](type-aliases/EventDecl.md)                     | Define event declarations with this type. This is the type that you will likely use the most.                                                                                                                                                                                                                           |
