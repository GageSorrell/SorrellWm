[electron-reactive-event](../../../../index.md) / [API](../../../index.md) / [Utility](../index.md) / GetResponseChannel

# GetResponseChannel() Function

```ts
function GetResponseChannel(Channel): string;
```

`electron` provides `invoke`/`handle` for events sent from `main`, but
not for events that are sent from the `renderer`. `electron-reactive-event`
provides this behavior for events sent from the `renderer` by sending the output
of `main` callbacks to the `renderer` via the channel name that comes from this function.

## Parameters

### Channel

`string`

The channel of the `renderer` event that `main` will reply to via this function's output.

## Returns

`string`

The patched `Channel` name.
