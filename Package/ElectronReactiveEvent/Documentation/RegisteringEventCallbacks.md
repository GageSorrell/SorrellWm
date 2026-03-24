> <span style="font-size: 12px;">Documentation for `electron-reactive-event`.<br />(c) 2026 Gage Sorrell.  Provided under the [MIT License](../License.md).</span>

# Registering Event Callbacks

**Purpose.**&ensp;@TODO

## `main` Events

Callbacks for `main` events exist under the `renderer`.
There are two main hooks provided for registering callbacks: `useEventCallback` and `useEventCallbackDeferred`.
Plural forms of these hooks also exist, which accept `Record`s, such that each key is an event channel, and its corresponding value is the callback that you wish to register.

As one might expect, `useEventCallback` registers the given callback when the containing component mounts, and unregisters the callback when the containing component unmounts.

The `useEventCallbackDeferred` hook returns a `registerCallback` function, to be called later.
The corresponding hook `useUnregisterEventCallbackDeferred` returns a function to unregister a given callback.

## `renderer` Events

Callbacks for `renderer` events exist under `main`.
Simply call `handle` and provide the channel and callback.
