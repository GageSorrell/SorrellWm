> <span style="font-size: 12px;">Documentation for `electron-reactive-event`.<br />(c) 2026 Gage Sorrell.  Provided under the [MIT License](../License.md).</span>

# Sending Events

**Purpose.**&ensp;@TODO

## `main` Events

`send` allows you to send events much like the `ipcMain.send` function.
It is `async` and returns the event response.

## `renderer` Events

There are two hooks for sending events from the `renderer`: `useSend` and `useSendDeferred`.

`useSend` will send the given event when the containing component mounts.
It provides an optional `boolean` argument `suspend` which causes the hook to suspend its containing component until a response is received from `main`.

`useSendDeferred` returns a `send` function, which can be called in a transition or `useEffect` function.
