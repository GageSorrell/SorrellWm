# `@sorrell/windows`

`@sorrell/windows` is the Node-API bridge between the Electron main process and the Windows API.
Its C++ binding is deliberately loaded behind a typed TypeScript
facade, so application code does not import a `.node` file directly.

```ts
import { Box } from "@sorrell/math";
import { Keyboard, MessageLoop, Screen, WM, Window } from "@sorrell/windows";

const Cursor = Window.GetCursorPosition();
const ForegroundWindow = Window.GetForegroundWindow();
const Screenshot = Screen.Capture(Box.Box(0, 1920, 1080, 0));
const Monitors = Screen.GetMonitors();
const Subscription = MessageLoop.Subscribe(
    WM.MOVE,
    (Position): void => console.log(Position.X, Position.Y)
);
const MessageLoopThread = MessageLoop.Start();
const KeyboardSubscription = Keyboard.Subscribe(
    (Event): void => console.log(Event.Key, Event.State, Event.ScanCode)
);

// Later, during application shutdown:
if (Subscription._tag === "Success")
{
    MessageLoop.Unsubscribe(Subscription.success);
}
if (KeyboardSubscription._tag === "Success")
{
    Keyboard.Unsubscribe(KeyboardSubscription.success);
}
MessageLoop.Stop();
```

`Screen.Capture(Bounds)` captures the portions of every physical display within
an `@sorrell/math` `Box.Box`. It returns an Effect `Result` containing a raw
base64-encoded PNG string; pixels in gaps between displays or outside every
display are transparent.

`Window.Capture(WindowHandle)` captures the window's visible DWM frame bounds
from the composed desktop. The capture preserves the pixels currently visible
on the user's screens, so covering windows remain visible in the result. For
restored Windows 11 windows with DWM rounded corners, unused corner pixels are
made transparent. Explicit Win32 window regions are also applied to the PNG
alpha channel. Minimized, hidden, child, invalid, and empty windows return a
failed `Result`.

`Window.GetIcon(WindowHandle)` returns an `Option` containing the raw
base64-encoded PNG used for the window's taskbar group. It checks an explicit
AppUserModel relaunch icon, then the window and window-class icons, and finally
the owning executable's Shell icon. It returns `None` when none can be read.

`Screen.GetMonitors()` returns an Effect `Result` containing one
`HMONITORINFOEX` value per enumerated display. Each value contains the monitor
handle, its virtual-screen and work-area `Box` values, the friendly device name,
raw flags, and a derived `IsPrimary` value. `Screen.GetMonitorBrand(Monitor)`
returns the manufacturer reported by the monitor's Windows device metadata, or
`None` when no meaningful manufacturer is available.

`Window.DimWindowsExcept(ExcludedWindows)` places a 50%-opaque,
click-through black overlay immediately above every visible, non-minimized
top-level window not contained in `ExcludedWindows`. It returns an Effect
`Result`; call `Window.ClearWindowDimming()` to remove all active overlays.
Repeated calls replace the existing overlay set, and addon cleanup also
removes any remaining overlays.

`Window.HasRoundedCorners(WindowHandle)` returns `Some(true)` for explicit
`ROUND` and `ROUNDSMALL` DWM preferences, `Some(false)` for an explicit
`DONOTROUND` preference, and `None` when the preference is default, unsupported,
invalid, or otherwise indeterminate.

`Window.IsSnapWindowsEnabled()` returns an `Option<boolean>` for the Windows
"Snap windows" setting. `Window.IsSnapLayoutsOnHoverEnabled()` returns the
effective state of "Show snap layouts when I hover over a window's maximize
button"; it is `Some(false)` when either that preference or the master Snap
windows setting is disabled. Both functions return `None` when their underlying
Windows settings cannot be queried.

`Window.GetMouseHoverTime()` returns the current Windows mouse-hover timeout in
milliseconds, or `None` when the system parameter cannot be queried.

`Window.GetHoveredMaximizeButton()` returns the owning top-level window and the
physical screen bounds of its maximize button while that button is beneath the
cursor. It uses the window's `WM_NCHITTEST` result, so custom title bars are
recognized when they correctly expose `HTMAXBUTTON`.

`MessageLoop.Start` creates a Win32 message queue and runs `GetMessageW` on a
dedicated native thread, separate from Electron's UI thread. Only one native
loop can run per process. `MessageLoop.Stop` posts `WM_QUIT` and joins the
thread. The lifecycle and subscription functions use the native `Attempt`
convention and expose an Effect `Result` to TypeScript callers. A failed result
contains a `NativeError` whose `Message` preserves the native failure detail.

`MessageLoop.Subscribe` is overloaded per supported message type. Its
`WM.MOVE` overload decodes the packed `lParam` coordinates and passes an
`IntPoint` to the listener. It returns a subscription identifier that can be
passed to `MessageLoop.Unsubscribe`. Callback delivery crosses from the native
message-loop thread to Electron's JavaScript thread through a Node-API
thread-safe function.

`Keyboard.Subscribe` observes every key-up and key-down transition through a
global `WH_KEYBOARD_LL` hook. The hook is installed on the dedicated message
loop thread by `MessageLoop.Start`. Listeners run asynchronously on Electron's
JavaScript thread. Event data includes the actual virtual-key code and state,
scan code, timestamp, whether a key-down is an auto-repeat, and low-level hook
flags. Callers can filter this complete event stream in JavaScript when needed.

The native target is built with `node-gyp` and uses Windows GDI for composed
desktop capture and Windows Imaging Component for PNG encoding. The use of
Node-API keeps the JavaScript/native interface independent of V8's internal API.
The application lists this package in `dependencies`, externalizes it from the
Vite main-process bundle, rebuilds native dependencies for Electron during
`postinstall`, and unpacks `.node` and `.dll` files from its ASAR archive.

Run `npm run build --workspace @sorrell/windows` to compile the TypeScript facade
and native addon. A supported Visual Studio C++ workload and Windows SDK must be
installed.
