[electron-reactive-event](../index.md) / Internal

# Internal

## Interfaces

| Interface                            | Description                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Registrar](interfaces/Registrar.md) | The `Registrar` interface is used internally to store all [event declarations](../Decl/type-aliases/EventDecl.md) used in a given project. Event declarations are scoped to the package in which they are declared, and this scope is resolved via the `PackageKey` type parameter that is had by almost all generic types in this package. |

## Type Aliases

| Type Alias                                             | Description                                                                                                                                                                                    |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ErrorKey](type-aliases/ErrorKey.md)                   | The key of the error type in an event declaration.                                                                                                                                             |
| [FilterByOwner](type-aliases/FilterByOwner.md)         | All event declarations of a given [PackageKey](type-aliases/FilterByOwner.md#packagekey) and [OwnerType](type-aliases/FilterByOwner.md#ownertype).                                             |
| [MainRegistrar](type-aliases/MainRegistrar.md)         | All `main` event declarations of a given [PackageKey](type-aliases/MainRegistrar.md#packagekey).                                                                                               |
| [OwnerKey](type-aliases/OwnerKey.md)                   | The key of the owner type in an event declaration.                                                                                                                                             |
| [PackageKeys](type-aliases/PackageKeys.md)             | This is the union of all `PackageKey` values used in a given project (that is, a given package using `electron-reactive-event`, and any dependencies that also use `electron-reactive-event`). |
| [RendererRegistrar](type-aliases/RendererRegistrar.md) | All `renderer` event declarations of a given [PackageKey](type-aliases/RendererRegistrar.md#packagekey).                                                                                       |
| [RequestKey](type-aliases/RequestKey.md)               | The key of the request type in an event declaration.                                                                                                                                           |
| [ResponseKey](type-aliases/ResponseKey.md)             | The key of the response type in an event declaration.                                                                                                                                          |
| [Values](type-aliases/Values.md)                       | The values of a given `Record`-like object.                                                                                                                                                    |
