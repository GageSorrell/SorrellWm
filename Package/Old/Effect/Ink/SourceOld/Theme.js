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
export const DefaultTheme = {
    Base: {
        Text: {},
        Accent: {
            Color: "cyan"
        },
        Muted: {
            Dim: true
        },
        Error: {
            Color: "red"
        },
        Info: {
            Color: "blue"
        },
        Success: {
            Color: "green"
        },
        Warning: {
            Color: "yellow"
        },
        Border: {
            Color: "gray",
            Style: "round"
        }
    },
    Help: {
        Title: {
            Bold: true
        },
        Description: {},
        Usage: {
            Color: "cyan"
        },
        SectionTitle: {
            Bold: true
        },
        CommandName: {
            Color: "cyan"
        },
        SubcommandName: {
            Color: "cyan"
        },
        FlagName: {
            Color: "green"
        },
        ArgumentName: {
            Color: "green"
        },
        TypeName: {
            Dim: true
        },
        RequiredMarker: {
            Color: "red"
        },
        OptionalMarker: {
            Dim: true
        },
        DefaultValue: {
            Dim: true
        },
        ExampleCommand: {
            Color: "magenta"
        },
        ExampleDescription: {
            Dim: true
        },
        ErrorTitle: {
            Bold: true,
            Color: "red"
        },
        ErrorMessage: {
            Color: "red"
        },
        Suggestion: {
            Color: "cyan"
        }
    },
    Prompt: {
        Prefix: {
            Color: "cyan"
        },
        Message: {
            Bold: true
        },
        Placeholder: {
            Dim: true
        },
        Input: {},
        Cursor: {
            Inverse: true
        },
        Mask: {
            Dim: true
        },
        Hint: {
            Dim: true
        },
        Error: {
            Color: "red"
        },
        Success: {
            Color: "green"
        },
        Cancelled: {
            Dim: true
        },
        ChoiceCursor: {
            Color: "cyan"
        },
        SelectedChoice: {
            Color: "cyan"
        },
        UnselectedChoice: {},
        DisabledChoice: {
            Dim: true
        },
        ChoiceDescription: {
            Dim: true
        },
        ChoiceGroupTitle: {
            Bold: true,
            Dim: true
        },
        SearchMatch: {
            Bold: true,
            Color: "yellow"
        },
        RequiredMarker: {
            Color: "red"
        },
        OptionalMarker: {
            Dim: true
        }
    },
    Progress: {
        Spinner: {
            Color: "cyan"
        },
        Label: {
            Bold: true
        },
        Detail: {
            Dim: true
        },
        Pending: {
            Dim: true
        },
        Running: {
            Color: "cyan"
        },
        Completed: {
            Color: "green"
        },
        Failed: {
            Color: "red"
        },
        BarCompleted: {
            Color: "green"
        },
        BarRemaining: {
            Dim: true
        },
        Percent: {
            Dim: true
        }
    },
    Cli: {
        VersionName: {
            Bold: true
        },
        VersionNumber: {
            Bold: true
        },
        ErrorTitle: {
            Bold: true,
            Color: "red"
        },
        ErrorMessage: {
            Color: "red"
        },
        WarningTitle: {
            Bold: true,
            Color: "yellow"
        },
        WarningMessage: {
            Color: "yellow"
        },
        PlainTextFallback: {}
    }
};
export const InkThemeReference = Context.Reference("@sorrell/effect-ink/InkTheme", {
    defaultValue: () => DefaultTheme
});
/* eslint-disable-next-line @typescript-eslint/typedef */
export const LayerDefault = Layer.succeed(InkThemeReference, DefaultTheme);
export const LayerFromTheme = (Theme) => Layer.succeed(InkThemeReference, Theme);
export const LayerFromPartialTheme = (Theme, BaseTheme = DefaultTheme) => Layer.succeed(InkThemeReference, MergeTheme(Theme, BaseTheme));
export const MergeTheme = (Theme, BaseTheme = DefaultTheme) => MergeObject(BaseTheme, Theme);
export const MergeTextStyle = (BaseStyle, Style) => MergeObject(BaseStyle, Style ?? {});
export const MergeBorderStyle = (BaseStyle, Style) => MergeObject(BaseStyle, Style ?? {});
export const ApplyTextStyle = (BaseStyle, Style) => ({
    ...BaseStyle,
    ...RemoveUndefinedProperties(Style)
});
const MergeObject = (BaseValue, OverrideValue) => {
    if (!IsObject(BaseValue) || !IsObject(OverrideValue)) {
        return OverrideValue === undefined
            ? BaseValue
            : OverrideValue;
    }
    const Result = {
        ...BaseValue
    };
    for (const Key of Reflect.ownKeys(OverrideValue)) {
        const OverridePropertyValue = OverrideValue[Key];
        if (OverridePropertyValue === undefined) {
            continue;
        }
        const BasePropertyValue = BaseValue[Key];
        Result[Key] =
            IsObject(BasePropertyValue) && IsObject(OverridePropertyValue)
                ? MergeObject(BasePropertyValue, OverridePropertyValue)
                : OverridePropertyValue;
    }
    return Result;
};
const RemoveUndefinedProperties = (Value) => {
    const Result = {};
    for (const Key of Reflect.ownKeys(Value)) {
        const PropertyValue = Value[Key];
        if (PropertyValue !== undefined) {
            Result[Key] = PropertyValue;
        }
    }
    return Result;
};
const IsObject = (Value) => typeof Value === "object"
    && Value !== null
    && !Array.isArray(Value);
//# sourceMappingURL=Theme.js.map