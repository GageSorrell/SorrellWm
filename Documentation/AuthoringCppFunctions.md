# Authoring C++ Functions

This article details how to author C++ functions that are exported to Node via the `node-addon-api`.
SorrellWm uses a build script inspired by the Unreal Engine's preprocessor; namely, there exists a macro `DECLARE_NAPI_FUNCTION(...)` which expands to nothing, and allows you to specify information about the function which is used to generate boilerplate that is needed by the `node-addon-api`.

The generated code contains a TypeScript type definition that is exported from the package, and boilerplate needed to call the function gracefully.

## Usage

To export a function, declare it in a header file, and prefix this declaration with a call to `DECLARE_NAPI_FUNCTION`.
The following code demonstrates the structure of a call to the macro.
```cpp
    DECLARE_NAPI_FUNCTION(
        FunctionName,
        ReturnType,
        ...Flags,
        ...Arguments
    )
```
where `...Arguments` are of the form `ArgumentName, ArgumentType`, *i.e.*, there should always be an even number of macro arguments which describe arguments of the function.

## Flags

### `Renderer`

Code is generated that allows the function to be called from the frontend.
Specifically, a function is created in a renderer module of the same name, which uses Electron's IPC to request the main thread to call the function.
The corresponding code is generated in a main module which makes the main thread listen for the request from the renderer.

### `Hook`

This will generate a hook that calls the function from the renderer thread, and returns a const array whose initial value is specified as an argument to the hook.
The `Renderer` flag should always be present whenever `Hook` is.
