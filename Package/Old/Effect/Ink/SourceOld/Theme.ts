/**
 * Provide `ink` with a theme.  This is particularly useful
 * for {@link \@sorrell/effect-ink/cli/Prompt | prompts}.
 *
 * @module @sorrell/effect-ink/Theme
 */

/**
 * @file      Theme.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Context, Layer } from "effect";

export type InkColor = string;

export type BoxBorderStyle =
    | "single"
    | "double"
    | "round"
    | "bold"
    | "singleDouble"
    | "doubleSingle"
    | "classic";

export interface TextStyle
{
    readonly Bold?: boolean;
    readonly Dim?: boolean;
    readonly Italic?: boolean;
    readonly Underline?: boolean;
    readonly Strikethrough?: boolean;
    readonly Inverse?: boolean;

    readonly Color?: InkColor;
    readonly BackgroundColor?: InkColor;
}

export interface BorderStyle
{
    readonly Style?: BoxBorderStyle;
    readonly Color?: InkColor;
    readonly Dim?: boolean;
}

export interface BaseTheme
{
    readonly Text: TextStyle;
    readonly Muted: TextStyle;
    readonly Accent: TextStyle;
    readonly Info: TextStyle;
    readonly Success: TextStyle;
    readonly Warning: TextStyle;
    readonly Error: TextStyle;
    readonly Border: BorderStyle;
}

export interface HelpTheme
{
    readonly Title: TextStyle;
    readonly Description: TextStyle;
    readonly Usage: TextStyle;
    readonly SectionTitle: TextStyle;

    readonly CommandName: TextStyle;
    readonly SubcommandName: TextStyle;
    readonly FlagName: TextStyle;
    readonly ArgumentName: TextStyle;
    readonly TypeName: TextStyle;

    readonly RequiredMarker: TextStyle;
    readonly OptionalMarker: TextStyle;
    readonly DefaultValue: TextStyle;

    readonly ExampleCommand: TextStyle;
    readonly ExampleDescription: TextStyle;

    readonly ErrorTitle: TextStyle;
    readonly ErrorMessage: TextStyle;
    readonly Suggestion: TextStyle;
}

export interface PromptTheme
{
    readonly Prefix: TextStyle;
    readonly Message: TextStyle;
    readonly Placeholder: TextStyle;
    readonly Input: TextStyle;
    readonly Cursor: TextStyle;
    readonly Mask: TextStyle;

    readonly Hint: TextStyle;
    readonly Error: TextStyle;
    readonly Success: TextStyle;
    readonly Cancelled: TextStyle;

    readonly ChoiceCursor: TextStyle;
    readonly SelectedChoice: TextStyle;
    readonly UnselectedChoice: TextStyle;
    readonly DisabledChoice: TextStyle;
    readonly ChoiceDescription: TextStyle;
    readonly ChoiceGroupTitle: TextStyle;
    readonly SearchMatch: TextStyle;

    readonly RequiredMarker: TextStyle;
    readonly OptionalMarker: TextStyle;
}

export interface ProgressTheme
{
    readonly Spinner: TextStyle;
    readonly Label: TextStyle;
    readonly Detail: TextStyle;

    readonly Pending: TextStyle;
    readonly Running: TextStyle;
    readonly Completed: TextStyle;
    readonly Failed: TextStyle;

    readonly BarCompleted: TextStyle;
    readonly BarRemaining: TextStyle;
    readonly Percent: TextStyle;
}

export interface CliTheme
{
    readonly VersionName: TextStyle;
    readonly VersionNumber: TextStyle;

    readonly ErrorTitle: TextStyle;
    readonly ErrorMessage: TextStyle;
    readonly WarningTitle: TextStyle;
    readonly WarningMessage: TextStyle;

    readonly PlainTextFallback: TextStyle;
}

export interface InkTheme
{
    readonly Base: BaseTheme;
    readonly Help: HelpTheme;
    readonly Prompt: PromptTheme;
    readonly Progress: ProgressTheme;
    readonly Cli: CliTheme;
}

export type PartialTheme<T> =
    {
        readonly [Key in keyof T]?: T[Key] extends object
            ? PartialTheme<T[Key]>
            : T[Key];
    };

export const DefaultTheme: InkTheme =
    {
        Base:
        {
            Text: { },

            Accent:
            {
                Color: "cyan"
            },
            Muted:
            {
                Dim: true
            },

            Error:
            {
                Color: "red"
            },
            Info:
            {
                Color: "blue"
            },
            Success:
            {
                Color: "green"
            },
            Warning:
            {
                Color: "yellow"
            },

            Border:
            {
                Color: "gray",
                Style: "round"
            }
        },
        Help:
        {
            Title:
            {
                Bold: true
            },

            Description:
            {},

            Usage:
            {
                Color: "cyan"
            },

            SectionTitle:
            {
                Bold: true
            },

            CommandName:
            {
                Color: "cyan"
            },

            SubcommandName:
            {
                Color: "cyan"
            },

            FlagName:
            {
                Color: "green"
            },

            ArgumentName:
            {
                Color: "green"
            },

            TypeName:
            {
                Dim: true
            },

            RequiredMarker:
            {
                Color: "red"
            },

            OptionalMarker:
            {
                Dim: true
            },

            DefaultValue:
            {
                Dim: true
            },

            ExampleCommand:
            {
                Color: "magenta"
            },

            ExampleDescription:
            {
                Dim: true
            },

            ErrorTitle:
            {
                Bold: true,
                Color: "red"
            },

            ErrorMessage:
            {
                Color: "red"
            },

            Suggestion:
            {
                Color: "cyan"
            }
        },

        Prompt:
        {
            Prefix:
            {
                Color: "cyan"
            },

            Message:
            {
                Bold: true
            },

            Placeholder:
            {
                Dim: true
            },

            Input:
            {},

            Cursor:
            {
                Inverse: true
            },

            Mask:
            {
                Dim: true
            },

            Hint:
            {
                Dim: true
            },

            Error:
            {
                Color: "red"
            },

            Success:
            {
                Color: "green"
            },

            Cancelled:
            {
                Dim: true
            },

            ChoiceCursor:
            {
                Color: "cyan"
            },

            SelectedChoice:
            {
                Color: "cyan"
            },

            UnselectedChoice:
            {},

            DisabledChoice:
            {
                Dim: true
            },

            ChoiceDescription:
            {
                Dim: true
            },

            ChoiceGroupTitle:
            {
                Bold: true,
                Dim: true
            },

            SearchMatch:
            {
                Bold: true,
                Color: "yellow"
            },

            RequiredMarker:
            {
                Color: "red"
            },

            OptionalMarker:
            {
                Dim: true
            }
        },

        Progress:
    {
        Spinner:
        {
            Color: "cyan"
        },

        Label:
        {
            Bold: true
        },

        Detail:
        {
            Dim: true
        },

        Pending:
        {
            Dim: true
        },

        Running:
        {
            Color: "cyan"
        },

        Completed:
        {
            Color: "green"
        },

        Failed:
        {
            Color: "red"
        },

        BarCompleted:
        {
            Color: "green"
        },

        BarRemaining:
        {
            Dim: true
        },

        Percent:
        {
            Dim: true
        }
    },

        Cli:
    {
        VersionName:
        {
            Bold: true
        },

        VersionNumber:
        {
            Bold: true
        },

        ErrorTitle:
        {
            Bold: true,
            Color: "red"
        },

        ErrorMessage:
        {
            Color: "red"
        },

        WarningTitle:
        {
            Bold: true,
            Color: "yellow"
        },

        WarningMessage:
        {
            Color: "yellow"
        },

        PlainTextFallback:
        {}
    }
    };

export const InkThemeReference: Context.Reference<InkTheme> = Context.Reference(
    "@sorrell/effect-ink/InkTheme",
    {
        defaultValue: () => DefaultTheme
    }
);

/* eslint-disable-next-line @typescript-eslint/typedef */
export const LayerDefault =
    Layer.succeed(InkThemeReference, DefaultTheme);

export const LayerFromTheme = (Theme: InkTheme) => Layer.succeed(InkThemeReference, Theme);

export const LayerFromPartialTheme = (
    Theme: PartialTheme<InkTheme>,
    BaseTheme: InkTheme = DefaultTheme
) => Layer.succeed(
    InkThemeReference,
    MergeTheme(Theme, BaseTheme)
);

export const MergeTheme = (
    Theme: PartialTheme<InkTheme>,
    BaseTheme: InkTheme = DefaultTheme
): InkTheme =>
    MergeObject(BaseTheme, Theme);

export const MergeTextStyle = (
    BaseStyle: TextStyle,
    Style: PartialTheme<TextStyle> | undefined
): TextStyle =>
    MergeObject(BaseStyle, Style ?? {});

export const MergeBorderStyle = (
    BaseStyle: BorderStyle,
    Style: PartialTheme<BorderStyle> | undefined
): BorderStyle =>
    MergeObject(BaseStyle, Style ?? {});

export const ApplyTextStyle = (
    BaseStyle: TextStyle,
    Style: TextStyle
): TextStyle =>
    ({
        ...BaseStyle,
        ...RemoveUndefinedProperties(Style)
    });

const MergeObject = <T>(
    BaseValue: T,
    OverrideValue: PartialTheme<T>
): T =>
{
    if (!IsObject(BaseValue) || !IsObject(OverrideValue))
    {
        return OverrideValue === undefined
            ? BaseValue
            : OverrideValue as T;
    }

    const Result: Record<PropertyKey, unknown> =
        {
            ...BaseValue
        };

    for (const Key of Reflect.ownKeys(OverrideValue))
    {
        const OverridePropertyValue: unknown =
            (OverrideValue as Record<PropertyKey, unknown>)[Key];

        if (OverridePropertyValue === undefined)
        {
            continue;
        }

        const BasePropertyValue: unknown =
            (BaseValue as Record<PropertyKey, unknown>)[Key];

        Result[Key] =
            IsObject(BasePropertyValue) && IsObject(OverridePropertyValue)
                ? MergeObject(BasePropertyValue, OverridePropertyValue)
                : OverridePropertyValue;
    }

    return Result as T;
};

const RemoveUndefinedProperties = <T extends object>(
    Value: T
): Partial<T> =>
{
    const Result: Partial<T> = { };

    for (const Key of Reflect.ownKeys(Value) as Array<keyof T>)
    {
        const PropertyValue: T[keyof T] = Value[Key];

        if (PropertyValue !== undefined)
        {
            Result[Key] = PropertyValue;
        }
    }

    return Result;
};

const IsObject = (
    Value: unknown
): Value is Record<PropertyKey, unknown> =>
    typeof Value === "object"
    && Value !== null
    && !Array.isArray(Value);
