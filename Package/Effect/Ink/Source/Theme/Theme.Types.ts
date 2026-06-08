/**
 * @file      Theme.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { BoxProps, TextProps } from "ink";

export type InkColor = NonNullable<TextProps["color"]>;

export type InkTextProperties = Readonly<Partial<Omit<TextProps, "children">>>;

export type InkBoxProperties = Readonly<Partial<Omit<BoxProps, "children">>>;

export type InkThemeNonEmptyArray<Value> = readonly [
    Value,
    ...ReadonlyArray<Value>
];

export interface InkTheme
{
    readonly Name: string;
    readonly Color: InkThemeColor;
    readonly Space: InkThemeSpace;
    readonly Text: InkThemeText;
    readonly Box: InkThemeBox;
    readonly Icon: InkThemeIcon;
    readonly Spinner: InkThemeSpinner;
    readonly Component: InkThemeComponent;
}

export interface InkThemeColor
{
    readonly Foreground:
    {
        readonly Foreground: InkColor;

        readonly Muted: InkColor;
        readonly Subtle: InkColor;
        readonly Disabled: InkColor;
    };

    readonly Background:
    {
        readonly Background: InkColor;

        readonly Raised: InkColor;
        readonly Selected: InkColor;
    };

    readonly Border:
    {
        readonly Border: InkColor;

        readonly Muted: InkColor;
        readonly Focused: InkColor;
    };

    readonly Primary: InkColor;
    readonly Secondary: InkColor;
    readonly Accent: InkColor;

    readonly Success: InkColor;
    readonly Warning: InkColor;
    readonly Error: InkColor;
    readonly Info: InkColor;
}

export interface InkThemeSpace
{
    readonly None: number;
    readonly ExtraSmall: number;
    readonly Small: number;
    readonly Medium: number;
    readonly Large: number;
}

export interface InkThemeText
{
    readonly Body: InkTextProperties;
    readonly Muted: InkTextProperties;
    readonly Subtle: InkTextProperties;
    readonly Disabled: InkTextProperties;

    readonly Heading: InkTextProperties;
    readonly Strong: InkTextProperties;
    readonly Code: InkTextProperties;
    readonly Link: InkTextProperties;

    readonly Primary: InkTextProperties;
    readonly Secondary: InkTextProperties;
    readonly Accent: InkTextProperties;

    readonly Success: InkTextProperties;
    readonly Warning: InkTextProperties;
    readonly Error: InkTextProperties;
    readonly Info: InkTextProperties;
}

export interface InkThemeBox
{
    readonly Root: InkBoxProperties;
    readonly Section: InkBoxProperties;
    readonly Panel: InkBoxProperties;
    readonly PanelFocused: InkBoxProperties;
    readonly PanelSuccess: InkBoxProperties;
    readonly PanelWarning: InkBoxProperties;
    readonly PanelError: InkBoxProperties;
    readonly Row: InkBoxProperties;
    readonly Column: InkBoxProperties;
}

export interface InkThemeIcon
{
    readonly Pointer: string;
    readonly PointerSmall: string;

    readonly Success: string;
    readonly Warning: string;
    readonly Error: string;
    readonly Info: string;

    readonly Selected: string;
    readonly Unselected: string;
    readonly Checked: string;
    readonly Unchecked: string;

    readonly Expanded: string;
    readonly Collapsed: string;
}

export interface InkThemeSpinner
{
    readonly Frames: InkThemeNonEmptyArray<string>;
    readonly IntervalMilliseconds: number;
    readonly Style: InkTextProperties;
}

export interface InkThemeComponent
{
    readonly Status: InkThemeStatusComponent;
    readonly Prompt: InkThemePromptComponent;
    readonly Input: InkThemeInputComponent;
    readonly Select: InkThemeSelectComponent;
    readonly Error: InkThemeErrorComponent;
}

export interface InkThemeStatusComponent
{
    readonly SuccessIcon: InkTextProperties;
    readonly WarningIcon: InkTextProperties;
    readonly ErrorIcon: InkTextProperties;
    readonly InfoIcon: InkTextProperties;

    readonly SuccessText: InkTextProperties;
    readonly WarningText: InkTextProperties;
    readonly ErrorText: InkTextProperties;
    readonly InfoText: InkTextProperties;
}

export interface InkThemePromptComponent
{
    readonly Container: InkBoxProperties;
    readonly Label: InkTextProperties;
    readonly RequiredMarker: InkTextProperties;
    readonly Separator: InkTextProperties;
    readonly Message: InkTextProperties;
    readonly Hint: InkTextProperties;
    readonly Value: InkTextProperties;
    readonly Placeholder: InkTextProperties;
    readonly ValidationError: InkTextProperties;
}

export interface InkThemeInputComponent
{
    readonly Container: InkBoxProperties;
    readonly Value: InkTextProperties;
    readonly Placeholder: InkTextProperties;
    readonly Cursor: InkTextProperties;
    readonly SubmittedValue: InkTextProperties;
    readonly InvalidValue: InkTextProperties;
}

export interface InkThemeSelectComponent
{
    readonly Container: InkBoxProperties;
    readonly Option: InkTextProperties;
    readonly OptionFocused: InkTextProperties;
    readonly OptionSelected: InkTextProperties;
    readonly OptionDisabled: InkTextProperties;
    readonly OptionDescription: InkTextProperties;
    readonly OptionCursor: InkTextProperties;
    readonly SearchMatch: InkTextProperties;
}

export interface InkThemeErrorComponent
{
    readonly Container: InkBoxProperties;
    readonly Name: InkTextProperties;
    readonly Message: InkTextProperties;
    readonly Stack: InkTextProperties;
    readonly Cause: InkTextProperties;
    readonly AnnotationKey: InkTextProperties;
    readonly AnnotationValue: InkTextProperties;
}
