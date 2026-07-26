/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Documentation/Example
 *
 * @file      Example.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { Box } from "../../Source/Box/index.js";
import {
    type FocusableState,
    FocusScope,
    useFocusable,
    useRoutedInput
} from "../../Source/Interaction/index.js";
import { useTheme } from "../../Source/Theme.js";
import type { StoryExample } from "../Story.js";

export interface ExampleProps
{
    readonly AvailableWidth: number;
    readonly Example: StoryExample;
}

export function Example({ AvailableWidth, Example: Definition }: ExampleProps): React.ReactElement
{
    const Theme = useTheme();
    const Wide = AvailableWidth >= 86;
    const [ Tab, SetTab ] = React.useState<"preview" | "code">("preview");
    const ExampleId = React.useId();
    const Preview = Definition.Preview;

    return (
        <Ink.Box flexDirection="column">
            <Ink.Text bold
                color={ Theme.Secondary }>{ Definition.Title }</Ink.Text>
            { Definition.Description === undefined
                ? null
                : <Ink.Text color={ Theme.TextMuted }>{ Definition.Description }</Ink.Text> }
            { Wide
                ? <Ink.Box gap={ 1 }>
                    <Panel Title="Preview"
                        Width="50%">
                        <StoryErrorBoundary ResetKey={ Definition }>
                            <FocusScope Id={ `${ ExampleId }-preview` }
                                RestoreFocus={ false }>
                                <Preview />
                            </FocusScope>
                        </StoryErrorBoundary>
                    </Panel>
                    <Panel Title="Code"
                        Width="50%"><Code Value={ Definition.Code } /></Panel>
                </Ink.Box>
                : <Ink.Box flexDirection="column">
                    <ExampleTabs Id={ `${ ExampleId }-tabs` }
                        OnChange={ SetTab }
                        Value={ Tab } />
                    <Panel Title={ Tab === "preview" ? "Preview" : "Code" }
                        Width="100%">
                        { Tab === "preview"
                            ? <StoryErrorBoundary ResetKey={ Definition }>
                                <FocusScope Id={ `${ ExampleId }-preview` }
                                    RestoreFocus={ false }>
                                    <Preview />
                                </FocusScope>
                            </StoryErrorBoundary>
                            : <Code Value={ Definition.Code } /> }
                    </Panel>
                </Ink.Box> }
        </Ink.Box>
    );
}

interface ExampleTabsProps
{
    readonly Id: string;
    readonly OnChange: (Value: "preview" | "code") => void;
    readonly Value: "preview" | "code";
}

function ExampleTabs({ Id, OnChange, Value }: ExampleTabsProps): React.ReactElement
{
    const Theme = useTheme();
    const Focus: FocusableState = useFocusable({ Id });
    const Items = [
        { Id: "preview", Label: "Preview" },
        { Id: "code", Label: "Code" }
    ] as const;

    useRoutedInput((Input: string, Key: Ink.Key): boolean =>
    {
        if (Key.leftArrow || Key.home || Input === "h")
        {
            OnChange("preview");
            return true;
        }
        if (Key.rightArrow || Key.end || Input === "l")
        {
            OnChange("code");
            return true;
        }
        return false;
    }, { Active: Focus.Focused, Priority: 100 });

    return (
        <Box
            aria-label="Example view"
            aria-role="tablist"
            onMouseDown={ () => Focus.Focus() }>
            <Ink.Text color={ Focus.Focused ? Theme.Primary : Theme.TextMuted }>
                { Focus.Focused ? "› " : "  " }
            </Ink.Text>
            { Items.map((Item) =>
            {
                const Selected = Value === Item.Id;
                return (
                    <Box
                        key={ Item.Id }
                        onClick={ () =>
                        {
                            Focus.Focus();
                            OnChange(Item.Id);
                        } }
                        paddingX={ 1 }>
                        <Ink.Text
                            { ...(Focus.Focused && Selected
                                ? { backgroundColor: Theme.BackgroundElement }
                                : { }) }
                            bold={ Selected }
                            color={ Selected ? Theme.Primary : Theme.TextMuted }
                            underline={ Selected }>
                            { Item.Label }
                        </Ink.Text>
                    </Box>
                );
            }) }
        </Box>
    );
}

interface StoryErrorBoundaryProps extends React.PropsWithChildren
{
    readonly ResetKey: unknown;
}

interface StoryErrorBoundaryState
{
    readonly Error: Error | undefined;
}

/** Keep an invalid example from unmounting the entire alternate-screen app. */
class StoryErrorBoundary extends React.Component<
    StoryErrorBoundaryProps,
    StoryErrorBoundaryState
>
{
    public override readonly state: StoryErrorBoundaryState = { Error: undefined };

    public static getDerivedStateFromError(ErrorValue: unknown): StoryErrorBoundaryState
    {
        return {
            Error: ErrorValue instanceof Error
                ? ErrorValue
                : new Error(String(ErrorValue))
        };
    }

    public override componentDidUpdate(PreviousProps: StoryErrorBoundaryProps): void
    {
        if (PreviousProps.ResetKey !== this.props.ResetKey && this.state.Error !== undefined)
        {
            this.setState({ Error: undefined });
        }
    }

    public override render(): React.ReactNode
    {
        if (this.state.Error === undefined)
        {
            return this.props.children;
        }

        return (
            <Ink.Text color="red">
                Example failed: { this.state.Error.message }
            </Ink.Text>
        );
    }
}

function Panel({ children, Title, Width }: React.PropsWithChildren<{
    readonly Title: string;
    readonly Width: Ink.BoxProps["width"];
}>): React.ReactElement
{
    const Theme = useTheme();
    return (
        <Ink.Box
            borderColor={ Theme.Border }
            borderStyle="round"
            flexDirection="column"
            minHeight={ 12 }
            paddingX={ 1 }
            width={ Width }>
            <Ink.Text color={ Theme.TextMuted }>{ Title }</Ink.Text>
            { children }
        </Ink.Box>
    );
}

function Code({ Value }: { readonly Value: string }): React.ReactElement
{
    const Theme = useTheme();
    return (
        <Ink.Text color={ Theme.Text }>
            { Value.split("\n").map((Line: string, Index: number) => (
                <React.Fragment key={ Index }>
                    <Ink.Text color={ Theme.TextMuted }>{ String(Index + 1).padStart(2) } </Ink.Text>
                    { Line }
                    { Index < Value.split("\n").length - 1 ? "\n" : "" }
                </React.Fragment>
            )) }
        </Ink.Text>
    );
}
