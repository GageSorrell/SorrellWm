# `@sorrell/log-client`

Effect-powered Windows named-pipe tooling and reusable Ink components for
viewing structured streams from `@sorrell/log`.

## Run the built-in client

Install the package together with its optional UI peers when using the
executable:

```sh
npm install @sorrell/log-client @sorrell/ink-ui ink react
```

Connect to a configured port:

```sh
sorrell-log-client 4317
sorrell-log-client --port 4317
```

Running `sorrell-log-client` without a port enumerates Windows named pipes
matching `sorrell-log-v1-<port>` and connects to the first port in numeric
order. Arrow keys and Page Up/Page Down scroll the stream. Escape exits.

The executable also supports `-p <port>` and `--help`.

Tracked global values appear below the event stream in a responsive grid. The
grid uses one, two, three, or four cards per row based on terminal width and
centers incomplete rows. When multiple rows would leave too little height for
the event stream, the grid becomes a row viewport; Tab switches keyboard focus
between the stream and global grid.

Bounded numeric globals display their current value over a gradient range bar.
Integer values include their configured maximum. DateTime values configured
with `DisplayTimeSince` display their ISO value and a live Effect Duration such
as `(12s ago)`.

## Configure an application

Add the named-pipe sink to the application’s logging runtime:

```ts
import * as Logging from "@sorrell/log/Effect";
import * as NamedPipeSink from "@sorrell/log/Node/NamedPipeSink";

const Application = {
    Name: "My application",
    Version: "1.0.0"
};

const LoggingLayer = Logging.Layer({
    Application,
    Sinks: [
        NamedPipeSink.Make({
            Application,
            GlobalRetention: "7 days",
            Port: 4317,
            Process: {
                ProcessIdentifier: process.pid,
                ProcessType: "Main"
            }
        })
    ]
});
```

The application owns `\\.\pipe\sorrell-log-v1-4317`. A bounded recent-record
buffer allows a client that connects after startup to see the latest messages.
Current global values are retained independently for `GlobalRetention` and
replayed in an authoritative snapshot.

## Build a custom client

Transport-only applications can import the Effect APIs without loading Ink or
React:

```ts
import { Effect, Stream } from "effect";
import {
    ConnectToPipe,
    DiscoverPipePorts,
    Messages,
    ResolvePipePort
} from "@sorrell/log-client/Client";

const Program = Messages({ Port: 4317 }).pipe(
    Stream.runForEach((Message) =>
        Effect.sync(() => console.log(Message)))
);

Effect.runPromise(Program);
```

`Messages()` performs the same automatic discovery as the executable when its
`Port` option is omitted. Every NDJSON message and log record is validated
before it reaches the stream.

Ink applications can use the complete client or assemble their own:

```tsx
import {
    GlobalValueCard,
    GlobalValueGrid,
    LogClientApp,
    LogLine,
    LogViewer,
    useLogClient
} from "@sorrell/log-client/Components";

const Application = () => <LogClientApp Port={4317} />;
```

The root entrypoint exports argument parsing, transport features, the React
hook, and all Ink components. `@sorrell/ink-ui`, `ink`, and `react` are optional
peer dependencies so transport-only consumers do not need to install a terminal
rendering stack.

## Protocol and platform

The current implementation targets Windows only and uses version-one NDJSON
messages over named IPC pipes:

- `Hello` identifies the application and process.
- `Log` contains one normalized `LogRecord`.
- `Dropped` reports bounded-buffer loss.
- `GlobalSnapshot` provides the current retained values for every global key.
- `Goodbye` indicates graceful application shutdown.

Malformed messages and unsupported protocol versions fail the Effect stream
with a typed `LogClientError`.
