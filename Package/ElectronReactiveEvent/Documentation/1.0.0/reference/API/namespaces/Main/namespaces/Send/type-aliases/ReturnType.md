[electron-reactive-event](../../../../../../index.md) / [API](../../../../../index.md) / [Main](../../../index.md) / [Send](../index.md) / ReturnType

# ReturnType Type

```ts
type ReturnType<ChannelType, Registrar, WindowType> =
	WindowType extends BrowserWindow[]
		? Response<ChannelType, Registrar>[]
		: Response<ChannelType, Registrar>;
```

The type returned by the `renderer` from the Send.Send function.

If an array is passed to the `send` function, then the request will be
sent to all windows, and an array of the results will be returned,
such that the order of the responses match the order of the respective
windows in the array.

## Type Parameters

### ChannelType

`ChannelType` _extends_ [`Channel`](../../../../Channel/type-aliases/Channel.md)\<`Registrar`\>

The desired channel of the given [Registrar](#registrar).

### Registrar

`Registrar` _extends_ [`IRegistrarBase`](../../../../../../Internal/namespaces/Registrar/interfaces/IRegistrarBase.md)

The registrar interface that holds the desired event declaration.

### WindowType

`WindowType` _extends_ `BrowserWindow` \| `BrowserWindow`[]

Either
[BrowserWindow](https://www.electronjs.org/docs/latest/api/browser-window),
or an array of `BrowserWindow`s.
