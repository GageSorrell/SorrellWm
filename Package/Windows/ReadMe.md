# `@sorrell/windows`

`@sorrell/windows` is the Node-API bridge between the Electron main process and the Windows API.
Its C++ binding is deliberately loaded behind a typed TypeScript
facade, so application code does not import a `.node` file directly.

```ts
import { GetCursorPosition, GetForegroundWindow } from "@sorrell/windows";

const Cursor = GetCursorPosition();
const ForegroundWindow = GetForegroundWindow();
```

The native target is built with `node-gyp` and links to `user32.lib`. The use of
Node-API keeps the JavaScript/native interface independent of V8's internal API.
The application lists this package in `dependencies`, externalizes it from the
Vite main-process bundle, rebuilds native dependencies for Electron during
`postinstall`, and unpacks `.node` and `.dll` files from its ASAR archive.

Run `npm run build --workspace @sorrell/windows` to compile the TypeScript facade
and native addon. A supported Visual Studio C++ workload and Windows SDK must be
installed.
