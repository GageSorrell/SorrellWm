/**
 * Interactive component showcase for `@sorrell/ink-ui`.
 *
 * @module @sorrell/ink-ui/Showcase
 *
 * @file      index.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    Badge,
    CenterText,
    Checkbox,
    CodeEditor,
    CompletionMenu,
    ConfirmOverlay,
    DefaultTheme,
    Frame,
    GradientBadge,
    HeaderBar,
    HeaderTable,
    HelpOverlay,
    InteractionProvider,
    JsonBodyViewer,
    JumpBadge,
    type MouseEvent,
    MouseProvider,
    Overlay,
    PickerOverlay,
    ScrollArea,
    Select,
    StatusBar,
    Tabs,
    TextArea,
    TextInput,
    ThemePickerOverlay,
    ThemeProvider,
    TimelineDetailOverlay,
    TimelineEntry,
    type TimelineEvent,
    TimelineTab,
    Tips,
    Toast,
    ValidationNotice,
    VarInput,
    VarText,
    View,
    ViewPane,
    YamlEditorOverlay,
    useMouseEvent
} from "../Source/index.js";
import { Box, type Key, Text, render, useApp, useInput, useWindowSize } from "ink";
import type { ComponentType } from "react";
import { InteractionExample } from "./InteractionExample.js";
import { useState } from "react";

const TimelineEvents: ReadonlyArray<TimelineEvent> = [
    {
        Detail: { attempt: 1 },
        DurationMilliseconds: 84,
        Id: "one",
        Request: { method: "GET", url: "https://example.com" },
        Response: { body: { ok: true }, status: 200 },
        Status: 200,
        Timestamp: new Date(),
        Title: "Fetched example data"
    },
    {
        Detail: { attempt: 2 },
        DurationMilliseconds: 136,
        Id: "two",
        Status: 404,
        Timestamp: new Date(Date.now() - 4_000),
        Title: "Checked missing resource"
    }
];

const TextInputExample = (): React.JSX.Element =>
{
    const [ Value, SetValue ] = useState("Editable text");
    return <TextInput OnChange={ SetValue }
        Value={ Value } />;
};

const TextAreaExample = (): React.JSX.Element =>
{
    const [ Value, SetValue ] = useState("This is a multiline\nterminal editor.");
    return <TextArea OnChange={ SetValue }
        Value={ Value } />;
};

const SelectExample = (): React.JSX.Element =>
{
    const [ Value, SetValue ] = useState("one");
    return (
        <Select
            Items={ [
                { Label: "First choice", Value: "one" },
                { Label: "Second choice", Value: "two" }
            ] }
            OnChange={ SetValue }
            Value={ Value } />
    );
};

const TabsExample = (): React.JSX.Element =>
{
    const [ Value, SetValue ] = useState("first");
    return (
        <Tabs
            Items={ [
                { Id: "first", Label: "First" },
                { Id: "second", Label: "Second" }
            ] }
            OnChange={ SetValue }
            Value={ Value } />
    );
};

const VarInputExample = (): React.JSX.Element =>
{
    const [ Value, SetValue ] = useState("$HO");
    return (
        <VarInput
            OnChange={ SetValue }
            Value={ Value }
            Values={ { HOME: "/home/user", HOST: "localhost" } } />
    );
};

const CodeEditorExample = (): React.JSX.Element =>
{
    const [ Value, SetValue ] = useState("{\n  \"ready\": true\n}");
    return (
        <CodeEditor
            Language="json"
            OnChange={ SetValue }
            Value={ Value } />
    );
};

const ScrollAreaExample = (): React.JSX.Element =>
{
    const [ Selected, SetSelected ] = useState(0);
    const Items = [ "Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot" ];
    return (
        <ScrollArea
            Height={ 4 }
            Items={ Items }
            RenderItem={ (Item: string, _Index: number, IsSelected: boolean) => (
                <Text color={ IsSelected ? DefaultTheme.Primary : DefaultTheme.Text }>
                    { IsSelected ? "› " : "  " }{ Item }
                </Text>
            ) }
            Index={ Selected }
            OnChangeIndex={ SetSelected } />
    );
};

const TimelineTabExample = (): React.JSX.Element => (
    <TimelineTab Events={ TimelineEvents } />
);

const ViewExample = (): React.JSX.Element => (
    <View
        Active
        Columns={ [ 14, 14 ] }
        Rows={ [ 2, 2 ] }>
        <ViewPane
            Column={ 0 }
            Row={ 0 }
            RowSpan={ 2 }>
            <Text>Navigation</Text>
        </ViewPane>
        <ViewPane
            Column={ 1 }
            Row={ 0 }>
            <Text>Inspector</Text>
        </ViewPane>
        <ViewPane
            Column={ 1 }
            Row={ 1 }>
            <Text>Event log</Text>
        </ViewPane>
    </View>
);

const MouseReadout = (): React.JSX.Element =>
{
    const [ Event, SetEvent ] = useState<MouseEvent.MouseEvent | undefined>();
    useMouseEvent(SetEvent);
    return (
        <Text>
            { Event === undefined
                ? "Move, click, drag, or scroll the mouse."
                : `${ Event._tag }${
                    "Position" in Event
                        ? ` at ${ Event.Position.X },${ Event.Position.Y }`
                        : ""
                }` }
        </Text>
    );
};

const MouseProviderExample = (): React.JSX.Element => (
    <MouseProvider>
        <MouseReadout />
    </MouseProvider>
);

interface ShowcaseItem
{
    readonly Component: ComponentType;
    readonly Name: string;
}

const Items: ReadonlyArray<ShowcaseItem> = [
    { Component: () => <Badge>Stable</Badge>, Name: "Badge" },
    { Component: () => <CenterText>Centered content</CenterText>, Name: "CenterText" },
    { Component: () => <Checkbox Checked
        Label="Enabled" />, Name: "Checkbox" },
    { Component: InteractionExample, Name: "Command" },
    { Component: InteractionExample, Name: "CommandScope" },
    { Component: CodeEditorExample, Name: "CodeEditor" },
    {
        Component: () => <CompletionMenu Items={ [ "HOME", "HOST" ] } />,
        Name: "CompletionMenu"
    },
    {
        Component: () => (
            <ConfirmOverlay
                Message="Continue?"
                OnCancel={ () => undefined }
                OnConfirm={ () => undefined } />
        ),
        Name: "ConfirmOverlay"
    },
    {
        Component: () => <Frame Title="Panel">Framed content</Frame>,
        Name: "Frame"
    },
    { Component: InteractionExample, Name: "Focusable" },
    { Component: InteractionExample, Name: "FocusScope" },
    {
        Component: () => <GradientBadge Text="Sorrell Ink UI" />,
        Name: "GradientBadge"
    },
    {
        Component: () => <HeaderBar Right={ <Text>v1</Text> }
            Title="Header" />,
        Name: "HeaderBar"
    },
    {
        Component: () => <HeaderTable Rows={ [
            { Name: "Name", Value: "Ink UI" },
            { Name: "Version", Value: "1.0.0" }
        ] } />,
        Name: "HeaderTable"
    },
    {
        Component: () => <HelpOverlay Sections={ [ {
            Entries: [ { Description: "Go back", Keys: "Escape" } ],
            Title: "Navigation"
        } ] } />,
        Name: "HelpOverlay"
    },
    {
        Component: () => <JsonBodyViewer Value={ { ready: true, value: 42 } } />,
        Name: "JsonBodyViewer"
    },
    { Component: InteractionExample, Name: "InteractionProvider" },
    { Component: () => <JumpBadge Hint="g" />, Name: "JumpBadge" },
    { Component: MouseProviderExample, Name: "MouseProvider" },
    {
        Component: () => <Overlay Title="Example">Overlay content</Overlay>,
        Name: "Overlay"
    },
    {
        Component: () => (
            <PickerOverlay
                Items={ [
                    { Label: "Alpha", Value: "alpha" },
                    { Label: "Bravo", Value: "bravo" }
                ] }
                OnSelect={ () => undefined }
                Title="Pick an item" />
        ),
        Name: "PickerOverlay"
    },
    { Component: ScrollAreaExample, Name: "ScrollArea" },
    { Component: SelectExample, Name: "Select" },
    { Component: InteractionExample, Name: "Shortcut" },
    {
        Component: () => <StatusBar Items={ [
            { Label: "READY" },
            { Color: DefaultTheme.Success, Label: "CONNECTED" }
        ] } />,
        Name: "StatusBar"
    },
    { Component: TabsExample, Name: "Tabs" },
    { Component: TextAreaExample, Name: "TextArea" },
    { Component: TextInputExample, Name: "TextInput" },
    {
        Component: () => (
            <ThemePickerOverlay OnSelect={ () => undefined } />
        ),
        Name: "ThemePickerOverlay"
    },
    {
        Component: () => (
            <ThemeProvider Theme={ { ...DefaultTheme, Primary: "#ff79c6" } }>
                <Badge>Themed child</Badge>
            </ThemeProvider>
        ),
        Name: "ThemeProvider"
    },
    {
        Component: () => <TimelineDetailOverlay Event={ TimelineEvents[0]! } />,
        Name: "TimelineDetailOverlay"
    },
    {
        Component: () => <TimelineEntry Event={ TimelineEvents[0]! }
            Selected />,
        Name: "TimelineEntry"
    },
    { Component: TimelineTabExample, Name: "TimelineTab" },
    {
        Component: () => <Tips Index={ 0 }
            Tips={ [ "Use arrow keys to navigate." ] } />,
        Name: "Tips"
    },
    { Component: () => <Toast DurationMilliseconds={ 60_000 }
        Message="Saved" />, Name: "Toast" },
    {
        Component: () => <ValidationNotice Message="A value is required." />,
        Name: "ValidationNotice"
    },
    { Component: VarInputExample, Name: "VarInput" },
    {
        Component: () => <VarText Text="$HOME and $MISSING"
            Values={ { HOME: "/home" } } />,
        Name: "VarText"
    },
    { Component: ViewExample, Name: "View" },
    {
        Component: () => (
            <YamlEditorOverlay
                OnChange={ () => undefined }
                Value={ "name: ink-ui\nversion: 1" } />
        ),
        Name: "YamlEditorOverlay"
    }
];

const Showcase = (): React.JSX.Element =>
{
    const { exit } = useApp();
    const { rows } = useWindowSize();
    const [ Page, SetPage ] = useState<ShowcaseItem | undefined>();
    const [ Selected, SetSelected ] = useState(0);

    useInput((Input: string, Key: Key) =>
    {
        if (Page !== undefined && Key.escape)
        {
            SetPage(undefined);
        }
        // else if (Input === "q" || Key.escape)
        else if (Input === 100 as unknown as string)
        // else if (Page === undefined && (Input === "q" || Key.escape))
        {
            exit();
        }
    });

    if (Page !== undefined)
    {
        const Component = Page.Component;
        return (
            <Box flexDirection="column">
                <HeaderBar
                    Right={ <Text color={ DefaultTheme.TextMuted }>Escape: menu</Text> }
                    Title={ Page.Name } />
                <Frame Active
                    Title="Example">
                    <Component />
                </Frame>
            </Box>
        );
    }

    return (
        <Box flexDirection="column">
            <GradientBadge Text="@sorrell/ink-ui showcase" />
            <Text color={ DefaultTheme.TextMuted }>
                Use ↑/↓ and Enter. Press q or Escape to exit.
            </Text>
            <ScrollArea
                Height={ Math.max(4, rows - 4) }
                Items={ Items }
                OnSelect={ SetPage }
                RenderItem={ (
                    Item: ShowcaseItem,
                    _Index: number,
                    IsSelected: boolean
                ) => (
                    <Text color={ IsSelected
                        ? DefaultTheme.Primary
                        : DefaultTheme.Text }>
                        { IsSelected ? "› " : "  " }{ Item.Name }
                    </Text>
                ) }
                Index={ Selected }
                OnChangeIndex={ SetSelected } />
        </Box>
    );
};

render(
    <ThemeProvider>
        <InteractionProvider>
            <Showcase />
        </InteractionProvider>
    </ThemeProvider>,
    {
        // alternateScreen: true,
        alternateScreen: false,
        exitOnCtrlC: true
    }
);
