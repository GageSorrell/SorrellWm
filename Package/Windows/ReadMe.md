# `@sorrell/windows`

`@sorrell/windows` is the Node-API bridge between the Electron main process and the Windows API.
Its C++ binding is deliberately loaded behind a typed TypeScript
facade, so application code does not import a `.node` file directly.

```ts
import { Keyboard, MessageLoop, WM, Window } from "@sorrell/windows";

const Cursor = Window.GetCursorPosition();
const ForegroundWindow = Window.GetForegroundWindow();
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

The native target is built with `node-gyp` and links to `user32.lib`. The use of
Node-API keeps the JavaScript/native interface independent of V8's internal API.
The application lists this package in `dependencies`, externalizes it from the
Vite main-process bundle, rebuilds native dependencies for Electron during
`postinstall`, and unpacks `.node` and `.dll` files from its ASAR archive.

Run `npm run build --workspace @sorrell/windows` to compile the TypeScript facade
and native addon. A supported Visual Studio C++ workload and Windows SDK must be
installed.
