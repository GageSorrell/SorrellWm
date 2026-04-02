[electron-reactive-event](../../../index.md) / [API](../../index.md) / Utility

# Utility

## Functions

| Function                                              | Description                                                                                                                                                                                                                                                                                                                   |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [GetResponseChannel](functions/GetResponseChannel.md) | `electron` provides `invoke`/`handle` for events sent from `main`, but not for events that are sent from the `renderer`. `electron-reactive-event` provides this behavior for events sent from the `renderer` by sending the output of `main` callbacks to the `renderer` via the channel name that comes from this function. |
