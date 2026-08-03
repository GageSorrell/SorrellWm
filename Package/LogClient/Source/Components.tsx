/**
 * Reusable Ink components and hooks for local log streams.
 *
 * @module @sorrell/log-client/Components
 *
 * @file      Components.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    Effect,
    Fiber,
    pipe,
    Stream
} from "effect";
import {
    useEffect,
    useMemo,
    useState
} from "react";
import {
    Box,
    Text,
    useApp,
    useInput,
    useWindowSize
} from "ink";
import {
    Frame,
    ScrollArea,
    StatusBar,
    ThemeProvider,
    useTheme
} from "@sorrell/ink-ui";
import type { ApplicationMetadata } from "@sorrell/log";
import type { GlobalLogValue } from "@sorrell/log/Global";
import type { WireMessage } from "@sorrell/log/Forward";
import { Pretty } from "@sorrell/log/Node";
import {
    ConnectToPipe,
    type LogClientError,
    type MessageStreamOptions,
    ResolvePipePort
} from "./Client.js";
import {
    GlobalGridRowCount,
    GlobalValueCardHeight,
    GlobalValueGrid
} from "./Global.js";

/** Connection state exposed by `useLogClient`. */
export type LogClientStatus =
    | "Discovering"
    | "Connecting"
    | "Connected"
    | "Disconnected"
    | "Error";

/** Reactive state for one local log connection. */
export interface LogClientState
{
    readonly Application?: ApplicationMetadata;
    readonly DroppedCount: number;
    readonly Error?: LogClientError;
    readonly Globals: ReadonlyArray<GlobalLogValue>;
    readonly Messages: ReadonlyArray<WireMessage>;
    readonly Port?: number;
    readonly Status: LogClientStatus;
}

/** Options accepted by `useLogClient`. */
export interface UseLogClientOptions extends MessageStreamOptions
{
    readonly MaximumMessages?: number;
}

/** Properties for one formatted wire message. */
export interface LogLineProps
{
    readonly Message: WireMessage;
}

/** Properties for a keyboard-scrollable log stream. */
export interface LogViewerProps
{
    readonly Active?: boolean;
    readonly Height: number;
    readonly Messages: ReadonlyArray<WireMessage>;
}

/** Properties for the complete built-in terminal client. */
export interface LogClientAppProps extends UseLogClientOptions
{
    readonly Title?: string;
}

const Formatter = Pretty({
    ColorMode: "Never",
    IncludeProcess: true,
    IncludeSource: true,
    MultilineObjects: false
});

function InitialState(Port?: number): LogClientState
{
    return {
        DroppedCount: 0,
        Globals: [],
        Messages: [],
        ...(Port === undefined ? { } : { Port }),
        Status: Port === undefined ? "Discovering" : "Connecting"
    };
}

function UpsertGlobal(
    Values: ReadonlyArray<GlobalLogValue>,
    Value: GlobalLogValue
): ReadonlyArray<GlobalLogValue>
{
    const Index = Values.findIndex(
        (Current: GlobalLogValue) =>
            Current.Definition.Key === Value.Definition.Key
    );

    if (Index < 0)
    {
        return [ ...Values, Value ];
    }

    return Values.map((Current: GlobalLogValue, CurrentIndex: number) =>
        CurrentIndex === Index ? Value : Current);
}

/**
 * Connects an Ink component to a local log stream using an Effect fiber.
 *
 * The fiber and underlying named-pipe socket are interrupted when the
 * component unmounts or the selected port changes.
 *
 * @category Client
 * @since 1.0.0
 */
export function useLogClient(
    Options: UseLogClientOptions = { }
): LogClientState
{
    const {
        BufferCapacity,
        MaximumLineBytes,
        MaximumMessages = 10_000,
        Port
    } = Options;
    const SafeMaximumMessages = Number.isSafeInteger(MaximumMessages)
        && MaximumMessages > 0
        ? MaximumMessages
        : 10_000;
    const [ State, SetState ] = useState<LogClientState>(() => InitialState(Port));

    useEffect(() =>
    {
        SetState(InitialState(Port));

        const Program = Effect.gen(function*()
        {
            const ResolvedPort = yield* ResolvePipePort(Port);
            yield* Effect.sync(() =>
            {
                SetState((Current: LogClientState) => ({
                    ...Current,
                    Port: ResolvedPort,
                    Status: "Connecting"
                }));
            });

            yield* pipe(ConnectToPipe(ResolvedPort, {
                ...(BufferCapacity === undefined ? { } : { BufferCapacity }),
                ...(MaximumLineBytes === undefined ? { } : { MaximumLineBytes })
            }), Stream.runForEach((Message: WireMessage) => Effect.sync(() =>
                {
                    SetState((Current: LogClientState) =>
                    {
                        const Messages = Message.Type === "GlobalSnapshot"
                            ? Current.Messages
                            : [
                                ...Current.Messages,
                                Message
                            ].slice(-SafeMaximumMessages);

                        switch (Message.Type)
                        {
                            case "Hello":
                                return {
                                    ...Current,
                                    Application: Message.Application,
                                    Messages,
                                    Status: "Connected"
                                };
                            case "Dropped":
                                return {
                                    ...Current,
                                    DroppedCount: Current.DroppedCount + Message.Count,
                                    Messages
                                };
                            case "GlobalSnapshot":
                                return {
                                    ...Current,
                                    Globals: Message.Values,
                                    Messages
                                };
                            case "Goodbye":
                                return {
                                    ...Current,
                                    Messages,
                                    Status: "Disconnected"
                                };
                            case "Log":
                                return {
                                    ...Current,
                                    Globals: Message.Record.Global === undefined
                                        ? Current.Globals
                                        : UpsertGlobal(
                                            Current.Globals,
                                            Message.Record.Global
                                        ),
                                    Messages
                                };
                        }
                    });
                })));
        });

        const FiberValue = Effect.runFork(
            pipe(Program, Effect.match({
                    onFailure: (ErrorValue: LogClientError) =>
                    {
                        SetState((Current: LogClientState) => ({
                            ...Current,
                            Error: ErrorValue,
                            Status: "Error"
                        }));
                    },
                    onSuccess: () =>
                    {
                        SetState((Current: LogClientState) => Current.Status === "Error"
                            ? Current
                            : {
                                ...Current,
                                Status: "Disconnected"
                            });
                    }
                }))
        );

        return (): void =>
        {
            Effect.runFork(Fiber.interrupt(FiberValue));
        };
    }, [
        BufferCapacity,
        MaximumLineBytes,
        Port,
        SafeMaximumMessages
    ]);

    return State;
}

/**
 * Formats one protocol message as a single terminal-friendly line.
 *
 * @category Display
 * @since 1.0.0
 */
export const LogLine = ({ Message }: LogLineProps): React.JSX.Element =>
{
    const Theme = useTheme();

    switch (Message.Type)
    {
        case "Hello":
            return (
                <Text color={ Theme.Info }>
                    Connected to { Message.Application.Name }
                    { Message.Application.Version === undefined
                        ? ""
                        : ` ${ Message.Application.Version }` }
                </Text>
            );
        case "Dropped":
            return (
                <Text color={ Theme.Warning }>
                    { Message.Count } log record
                    { Message.Count === 1 ? "" : "s" } dropped
                </Text>
            );
        case "Goodbye":
            return <Text color={ Theme.TextMuted }>Application disconnected</Text>;
        case "GlobalSnapshot":
            return (
                <Text color={ Theme.TextMuted }>
                    Loaded { Message.Values.length } retained global value
                    { Message.Values.length === 1 ? "" : "s" }
                </Text>
            );
        case "Log":
        {
            const Color = {
                Debug: Theme.Info,
                Error: Theme.Error,
                Fatal: Theme.Error,
                Info: Theme.Text,
                Trace: Theme.TextMuted,
                Warn: Theme.Warning
            }[Message.Record.Level];
            const Line = Formatter.Format(Message.Record)
                .trimEnd()
                .replaceAll(/\r?\n/g, " ↵ ");
            return <Text color={ Color }>{ Line }</Text>;
        }
    }
};

/**
 * Displays a bounded window over log messages with arrow and page-key scrolling.
 *
 * New records remain followed while the selection is at the bottom. Scrolling
 * upward pauses following until the user returns to the final row.
 *
 * @category Display
 * @since 1.0.0
 */
export const LogViewer = ({
    Active = true,
    Height,
    Messages
}: LogViewerProps): React.JSX.Element =>
{
    const [ Following, SetFollowing ] = useState(true);
    const [ SelectedIndex, SetSelectedIndex ] = useState(
        Math.max(0, Messages.length - 1)
    );
    const LastIndex = Math.max(0, Messages.length - 1);

    useEffect(() =>
    {
        if (Following)
        {
            SetSelectedIndex(LastIndex);
        }
    }, [ Following, LastIndex ]);

    if (Messages.length === 0)
    {
        return (
            <Box height={ Math.max(1, Height) }>
                <Text dimColor>Waiting for log records…</Text>
            </Box>
        );
    }

    return (
        <ScrollArea
            Active={ Active }
            Height={ Math.max(1, Height) }
            Items={ Messages }
            RenderItem={ (
                Message: WireMessage,
                _Index: number,
                Selected: boolean
            ) => (
                <Box>
                    <Text dimColor>{ Selected ? "› " : "  " }</Text>
                    <LogLine Message={ Message } />
                </Box>
            ) }
            SelectedIndex={ SelectedIndex }
            SetSelectedIndex={ (Index: number) =>
            {
                SetSelectedIndex(Index);
                SetFollowing(Index >= LastIndex);
            } } />
    );
};


const LogClientContent = ({
    Title = "@sorrell/log client",
    ...Options
}: LogClientAppProps): React.JSX.Element =>
{
    const State = useLogClient(Options);
    const Theme = useTheme();
    const { exit } = useApp();
    const { columns, rows } = useWindowSize();
    const [ ActivePanel, SetActivePanel ] = useState<"Globals" | "Logs">("Logs");
    const LogCount = useMemo(
        () => State.Messages.filter((Message: WireMessage) => Message.Type === "Log").length,
        [ State.Messages ]
    );
    const ContentWidth = Math.max(1, columns - 2);
    const GlobalRows = GlobalGridRowCount(
        State.Globals.length,
        ContentWidth
    );
    const AvailableContentHeight = Math.max(1, rows - 5);
    const MinimumEventHeight = Math.max(1, Math.floor(rows * 0.6));
    const UnconstrainedEventHeight = AvailableContentHeight
        - GlobalRows * GlobalValueCardHeight;
    const ScrollGlobals = GlobalRows > 1
        && UnconstrainedEventHeight < MinimumEventHeight;
    const MaximumGlobalRows = ScrollGlobals
        ? Math.max(
            1,
            Math.floor(
                Math.max(
                    GlobalValueCardHeight,
                    AvailableContentHeight - MinimumEventHeight
                ) / GlobalValueCardHeight
            )
        )
        : Math.max(1, GlobalRows);
    const VisibleGlobalRows = Math.min(GlobalRows, MaximumGlobalRows);
    const GridHeight = State.Globals.length === 0
        ? 0
        : VisibleGlobalRows * GlobalValueCardHeight
            + (ScrollGlobals ? 1 : 0);
    const EventHeight = Math.max(1, AvailableContentHeight - GridHeight);

    useInput((_Input, Key) =>
    {
        if (Key.escape)
        {
            exit();
        }
        else if (Key.tab && ScrollGlobals)
        {
            SetActivePanel((Current: "Globals" | "Logs") =>
                Current === "Logs" ? "Globals" : "Logs");
        }
    });

    useEffect(() =>
    {
        if (!ScrollGlobals)
        {
            SetActivePanel("Logs");
        }
    }, [ ScrollGlobals ]);

    const StatusColor = State.Status === "Connected"
        ? Theme.Success
        : State.Status === "Error"
            ? Theme.Error
            : Theme.TextMuted;
    const ApplicationName = State.Application?.Name;

    return (
        <Box flexDirection="column">
            <Frame
                Active
                Footer={ ScrollGlobals
                    ? "↑/↓/PgUp/PgDn scroll · Tab switches panel · Escape exits"
                    : "↑/↓/PgUp/PgDn scroll · Escape exits" }
                Padding={ 0 }
                Title={ ApplicationName === undefined
                    ? Title
                    : `${ Title } — ${ ApplicationName }` }>
                <LogViewer
                    Active={ !ScrollGlobals || ActivePanel === "Logs" }
                    Height={ EventHeight }
                    Messages={ State.Messages } />
                { State.Globals.length > 0 && (
                    <GlobalValueGrid
                        Active={ ScrollGlobals && ActivePanel === "Globals" }
                        MaximumRows={ MaximumGlobalRows }
                        Values={ State.Globals }
                        Width={ ContentWidth } />
                ) }
            </Frame>
            <StatusBar Items={ [
                {
                    Color: StatusColor,
                    Label: State.Status
                },
                {
                    Label: State.Port === undefined
                        ? "port: auto"
                        : `port: ${ State.Port }`
                },
                {
                    Label: `${ LogCount } logs`
                },
                {
                    Label: `${ State.Globals.length } globals`
                },
                ...(ScrollGlobals
                    ? [ {
                        Color: Theme.Info,
                        Label: `active: ${ ActivePanel.toLocaleLowerCase() }`
                    } ]
                    : []),
                ...(State.DroppedCount === 0
                    ? []
                    : [ {
                        Color: Theme.Warning,
                        Label: `${ State.DroppedCount } dropped`
                    } ])
            ] } />
            { State.Error !== undefined && (
                <Text color={ Theme.Error }>{ State.Error.Message }</Text>
            ) }
        </Box>
    );
};

/**
 * Runs the complete themed Ink log viewer and exits when Escape is pressed.
 *
 * When no port is provided, the first discoverable `@sorrell/log` pipe is
 * selected automatically.
 *
 * @category Application
 * @since 1.0.0
 */
export const LogClientApp = (
    Props: LogClientAppProps
): React.JSX.Element => (
    <ThemeProvider>
        <LogClientContent { ...Props } />
    </ThemeProvider>
);

export {
    FormatGlobalDuration,
    GlobalDateTimeRefreshMilliseconds,
    GlobalGridColumnCount,
    GlobalGridRowCount,
    GlobalNumberBar,
    GlobalValueCardHeight,
    GlobalValueCard,
    GlobalValueGrid
} from "./Global.js";
export type {
    GlobalNumberBarProps,
    GlobalValueCardProps,
    GlobalValueGridProps
} from "./Global.js";
