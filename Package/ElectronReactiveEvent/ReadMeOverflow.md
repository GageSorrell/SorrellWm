
**Step 1.** Create a module that will contain two interfaces.
These interfaces will contain our event types, which we add from anywhere in our project via `declare module`.
```typescript
// ./Event.Types.ts

/** For events sent from the renderer to main. */
export interface IFrontendEventRegistrar { }

/** Similarly, for backend --> frontend. */
export interface IBackendEventRegistrar { }
```

**Step 2.** Define some event types in another module.
```typescript
// ./ExampleEvents.ts

import type { EventDecl, EmptyEventParameter } from "electron-reactive-event";

export type HexColor = `#${ string }`;

export type GetSystemAccentColorEvent = EventDecl<
    /* RequestType      = */ EmptyEventParameter,
    /* ResponseType     = */ HexColor,
    /* ErrorMessageType = */ "CouldNotCreateMessageWindow",
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

declare module "./Event.Types"
{
    interface IFrontendEventRegistrar
    {
        GetSystemAccentColor: GetSystemAccentColorEvent;
    }

    interface IBackendEventRegistrar
    {
        ShowUserMessage: ShowUserMessageEvent;
    }
};
```

**Step 3.**
