# `electron-reactive-event`

*Type-safe Electron IPC functions, including modern React hooks.*

This package wraps Electron's IPC functions, such as `invoke`, `handle`, `on`, and `off` from the `ipcMain` and `ipcRenderer` modules.
Type-safety is added via a flexible typing system, with simple generic types for defining events.

All function arguments and return values are typed.

In addition to wrapping the basic IPC functions, the ability for the renderer to reply to events sent from main is added, similar to how Electron allows main to reply to events sent by the renderer.

## Installation

```bash
npm install --save electron-reactive-event

# Example: Copy preload code to the clipboard; create the provider component in the given path.
npm init electron-reactive-event preload --output clipboard
npm init electron-reactive-event provider --output ./Source/Renderer/EventProvider.tsx
```

The options for the `init` command are available [here](./Documentation/Init.md).
Exposing functions via `preload` is kept flexible and allows for customization, *i.e.*, limiting the functionality that is exposed to the renderer.

// @TODO API Changes:
//     Update function names to match Electron's IPC function names more closely
//     Add Event parameter to `EventCallback` (this might mean having to define
//     different types for main/renderer)
//     Add options to initialization functions that allow for specifying behavior
// @TODO For this package:
//     The tasks above
//     Write documentation
//     Publish

## Basic Example

This example omits some boilerplate code that must be written.
The boilerplate needed is detailed in [@TODO](./Documentation/ProjectSetup.md), and can be written for you via `npm init`.

### `Source/Shared/MyEvents.Types.ts`

```typescript
export type GetSystemAccentColorEvent = EventDecl<
    /* RequestType      = */ EmptyEventParameter,
    /* ResponseType     = */ string,
    /* ErrorMessageType = */ "NativeFunctionFailed",
    /* ErrorPayloadType = */ EmptyEventParameter
>;

export type UserMessage =
{
    Body: string;
    Urgent: boolean;
};

export type ShowUserMessageEvent = EventDecl<
    /* RequestType      = */ UserMessage,
    /* ResponseType     = */ EmptyEventParameter,
    /* ErrorMessageType = */ "CouldNotCreateMessageWindow",
    /* ErrorPayloadType = */ EmptyEventParameter
>;
```

### `Source/Main/Main.ts`

```typescript
import { type EventReturnType, GetEventFunctions } from "electron-reactive-event";
import type { IBackendEventRegistrar, IFrontendEventRegistrar } from "Shared/Registrar.Types.ts";
import { GetSystemAccentColor as GetSystemAccentColorNative } from "my-native-module";

const MainWindow: BrowserWindow = new BrowserWindow({ /* ... */ });

const { handle, send } = GetEventFunctions<IBackendEventRegistrar, IFrontendEventRegistrar>();

type AccentColor = EventReturnType<"GetSystemAccentColor", IRendererEventRegistrar>;
const GetSystemAccentColor = async (Event: IpcRendererEvent): Promise<AccentColor> =>
{
    const SystemAccentColor: string | undefined = await GetSystemAccentColorNative();

    return (SystemAccentColor !== undefined)
        ? {
            Data: SystemAccentColor
        }
        : {
            Error: "NativeFunctionFailed"
        };
};

handle("GetSystemAccentColor", GetSystemAccentColor);

const DoSomething = async (): Promise<void> =>
{
    // ...

    type MessageReturnType = EventReturnType<"ShowUserMessage", IBackendEventRegistrar>;
    const ShowMessageResult: MessageReturnType = await send("ShowUserMessage", MainWindow);
    if (IsEventSuccessful(ShowMessageResult))
    {
        // ShowMessageResult.Error === undefined
    }

    // ...
};
```

### `Source/Renderer/App.tsx`

```tsx
import { type ReactNode, useEffect } from "react";
import { EventProvider, useEventCallback, useSend } from "./EventProvider";
import type { UserMessage } from "Shared/MyEvents.Types";

export const App = (): ReactNode =>
{
    const { Data: AccentColor, Error } = useSend("GetSystemAccentColor");

    const [ Messages, SetMessages ] = useState<Array<UserMessage>>([ ]);

    useEventCallback("ShowUserMessage", async (NewMessage: UserMessage): Promise<void> =>
    {
        if (Messages.some(Message => Message.Body === NewMessage.Body))
        {
            SetMessages((Old: Array<UserMessage>): Array<UserMessage> =>
            {
                return [ ...Old, NewMessage ];
            });
        }
    }, [ Messages ]);

    const MessagesDisplay = (): ReactNode =>
    {
        return Messages.map(({ Body, Urgent }: UserMessage, Index: number): ReactNode =>
        {
            const color: string = Urgent
                ? AccentColor || "red"
                : "black";

            return <p
                key={ `${ Body }-${ Index }` }
                style={ { color } }>
                { Body }
            </p>
        });
    };

    return (
        <div>
            <h1>
                Messages
            </h1>
            {
                (Messages.length > 0)
                    ? MessagesDisplay
                    : <i>No messages.</i>
            }
        </div>
    );
};
```

## Documentation

Documentation is in [the Documentation directory in this repo](./Documentation).
It is read best on GitHub.
