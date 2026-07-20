import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Components to assist with {@link \@sorrell/effect-ink/cli/Prompt}.
 *
 * @module @sorrell/effect-ink/Component
 */
/**
 * @file      Component.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { InkThemeReference } from "./Theme.js";
import { Box, Text } from "ink";
import React, {} from "react";
import { Context } from "effect";
import { useRuntimeContext } from "./React.js";
export function StyledText(Props) {
    return (_jsx(Text, { ...ToInkTextProps(Props.Style), ...(Props.AriaHidden !== undefined ? { "aria-hidden": Props.AriaHidden } : {}), ...(Props.AriaLabel !== undefined ? { "aria-label": Props.AriaLabel } : {}), ...(Props.Wrap !== undefined ? { wrap: Props.Wrap } : {}), children: Props.children }));
}
export function ThemedText(Props) {
    const Theme = useTheme();
    return (_jsx(StyledText, { Style: Props.Select(Theme), ...(Props.AriaHidden !== undefined ? { AriaHidden: Props.AriaHidden } : {}), ...(Props.AriaLabel !== undefined ? { AriaLabel: Props.AriaLabel } : {}), ...(Props.Wrap !== undefined ? { wrap: Props.Wrap } : {}), children: Props.children }));
}
export function InlineText(Props) {
    return (_jsx(Text, { children: Props.Items.map((Item, Index) => (_jsx(React.Fragment, { children: Item }, Index))) }));
}
export function MutedText(Props) {
    return (_jsx(ThemedText, { Select: (Theme) => Theme.Base.Muted, children: Props.children }));
}
export function AccentText(Props) {
    return (_jsx(ThemedText, { Select: (Theme) => Theme.Base.Accent, children: Props.children }));
}
export function SuccessText(Props) {
    return (_jsx(ThemedText, { Select: (Theme) => Theme.Base.Success, children: Props.children }));
}
export function WarningText(Props) {
    return (_jsx(ThemedText, { Select: (Theme) => Theme.Base.Warning, children: Props.children }));
}
export function ErrorText(Props) {
    return (_jsx(ThemedText, { Select: (Theme) => Theme.Base.Error, children: Props.children }));
}
export function Section(Props) {
    return (_jsxs(Box, { flexDirection: "column", paddingBottom: Props.PaddingBottom ?? 0, paddingTop: Props.PaddingTop ?? 0, children: [Props.Title === undefined
                ? null
                : (_jsx(ThemedText, { Select: (Theme) => Theme.Help.SectionTitle, children: Props.Title })), Props.children] }));
}
export function Panel(Props) {
    const Theme = useTheme();
    const Border = Props.Border ?? Theme.Base.Border;
    return (_jsxs(Box, { borderColor: Border.Color, borderStyle: Border.Style, flexDirection: "column", marginBottom: Props.MarginBottom ?? 0, marginTop: Props.MarginTop ?? 0, paddingX: Props.PaddingX ?? 1, paddingY: Props.PaddingY ?? 0, children: [Props.Title === undefined
                ? null
                : (_jsx(StyledText, { Style: Theme.Help.Title, children: Props.Title })), Props.children] }));
}
export function PromptLine(Props) {
    const Theme = useTheme();
    return (_jsxs(Box, { children: [_jsx(StyledText, { Style: Theme.Prompt.Prefix, children: Props.Prefix ?? "?" }), _jsx(Text, { children: " " }), _jsx(StyledText, { Style: Theme.Prompt.Message, children: Props.Message }), Props.Required === true
                ? (_jsxs(_Fragment, { children: [_jsx(Text, { children: " " }), _jsx(StyledText, { Style: Theme.Prompt.RequiredMarker, children: "*" })] }))
                : null, Props.Optional === true
                ? (_jsxs(_Fragment, { children: [_jsx(Text, { children: " " }), _jsx(StyledText, { Style: Theme.Prompt.OptionalMarker, children: "optional" })] }))
                : null] }));
}
export function HintLine(Props) {
    const Theme = useTheme();
    if (Props.children === undefined || Props.children === null) {
        return null;
    }
    return (_jsx(StyledText, { Style: Theme.Prompt.Hint, children: Props.children }));
}
export function ErrorLine(Props) {
    const Theme = useTheme();
    if (Props.children === undefined || Props.children === null) {
        return null;
    }
    return (_jsx(StyledText, { Style: Theme.Prompt.Error, children: Props.children }));
}
export function SuccessLine(Props) {
    const Theme = useTheme();
    if (Props.children === undefined || Props.children === null) {
        return null;
    }
    return (_jsx(StyledText, { Style: Theme.Prompt.Success, children: Props.children }));
}
export function TextInputLine(Props) {
    const Theme = useTheme();
    const DisplayValue = Props.Mask === undefined
        ? Props.Value
        : Props.Mask.repeat(Props.Value.length);
    if (DisplayValue.length === 0 && Props.Placeholder !== undefined) {
        return (_jsx(StyledText, { Style: Theme.Prompt.Placeholder, children: Props.Placeholder }));
    }
    if (Props.Focused !== true) {
        return (_jsx(StyledText, { Style: Theme.Prompt.Input, children: DisplayValue }));
    }
    const CursorOffset = Clamp(Props.CursorOffset ?? DisplayValue.length, 0, DisplayValue.length);
    const BeforeCursor = DisplayValue.slice(0, CursorOffset);
    const CursorCharacter = DisplayValue.slice(CursorOffset, CursorOffset + 1) || " ";
    const AfterCursor = DisplayValue.slice(CursorOffset + 1);
    return (_jsxs(Text, { children: [_jsx(StyledText, { Style: Theme.Prompt.Input, children: BeforeCursor }), _jsx(StyledText, { Style: Theme.Prompt.Cursor, children: CursorCharacter }), _jsx(StyledText, { Style: Theme.Prompt.Input, children: AfterCursor })] }));
}
export function ChoiceItem(Props) {
    const Theme = useTheme();
    const LabelStyle = Props.Disabled === true
        ? Theme.Prompt.DisabledChoice
        : Props.Selected === true
            ? Theme.Prompt.SelectedChoice
            : Theme.Prompt.UnselectedChoice;
    return (_jsxs(Box, { children: [_jsx(StyledText, { Style: Theme.Prompt.ChoiceCursor, children: Props.Cursor === true ? "›" : " " }), _jsx(Text, { children: " " }), _jsx(StyledText, { Style: LabelStyle, children: Props.Label }), Props.Description === undefined
                ? null
                : (_jsxs(_Fragment, { children: [_jsx(Text, { children: " " }), _jsx(StyledText, { Style: Theme.Prompt.ChoiceDescription, children: Props.Description })] }))] }));
}
export function ChoiceList(Props) {
    return (_jsx(Box, { flexDirection: "column", children: Props.Choices.map((Choice, Index) => (_jsx(ChoiceItem, { Cursor: Props.IsCursor?.(Choice, Index), Description: Props.GetDescription?.(Choice, Index), Disabled: Props.IsDisabled?.(Choice, Index), Index: Index, Label: Props.GetLabel(Choice, Index), Selected: Props.IsSelected?.(Choice, Index) }, Index))) }));
}
export function ChoiceGroupTitle(Props) {
    const Theme = useTheme();
    return (_jsx(StyledText, { Style: Theme.Prompt.ChoiceGroupTitle, children: Props.children }));
}
export function HelpUsage(Props) {
    const Theme = useTheme();
    return (_jsx(StyledText, { Style: Theme.Help.Usage, children: Props.children }));
}
export function HelpFlag(Props) {
    const Theme = useTheme();
    return (_jsxs(Box, { children: [_jsx(StyledText, { Style: Theme.Help.FlagName, children: Props.Name }), Props.Type === undefined
                ? null
                : (_jsxs(_Fragment, { children: [_jsx(Text, { children: " " }), _jsx(StyledText, { Style: Theme.Help.TypeName, children: Props.Type })] })), Props.Required === true
                ? (_jsxs(_Fragment, { children: [_jsx(Text, { children: " " }), _jsx(StyledText, { Style: Theme.Help.RequiredMarker, children: "required" })] }))
                : null, Props.Description === undefined
                ? null
                : (_jsxs(_Fragment, { children: [_jsx(Text, { children: "  " }), _jsx(StyledText, { Style: Theme.Help.Description, children: Props.Description })] }))] }));
}
export function HelpExample(Props) {
    const Theme = useTheme();
    return (_jsxs(Box, { flexDirection: "column", children: [_jsx(StyledText, { Style: Theme.Help.ExampleCommand, children: Props.Command }), Props.Description === undefined
                ? null
                : (_jsx(StyledText, { Style: Theme.Help.ExampleDescription, children: Props.Description }))] }));
}
export function SpinnerLine(Props) {
    const Theme = useTheme();
    return (_jsxs(Box, { children: [_jsx(StyledText, { Style: Theme.Progress.Spinner, children: Props.Frame }), Props.Label === undefined
                ? null
                : (_jsxs(_Fragment, { children: [_jsx(Text, { children: " " }), _jsx(StyledText, { Style: Theme.Progress.Label, children: Props.Label })] })), Props.Detail === undefined
                ? null
                : (_jsxs(_Fragment, { children: [_jsx(Text, { children: " " }), _jsx(StyledText, { Style: Theme.Progress.Detail, children: Props.Detail })] }))] }));
}
export function ProgressBar(Props) {
    const Theme = useTheme();
    const Width = Props.Width ?? 20;
    const Ratio = Props.Total <= 0
        ? 0
        : Clamp(Props.Current / Props.Total, 0, 1);
    const CompletedWidth = Math.round(Width * Ratio);
    const RemainingWidth = Width - CompletedWidth;
    return (_jsxs(Text, { children: [_jsx(StyledText, { Style: Theme.Progress.BarCompleted, children: "█".repeat(CompletedWidth) }), _jsx(StyledText, { Style: Theme.Progress.BarRemaining, children: "░".repeat(RemainingWidth) }), _jsx(Text, { children: " " }), _jsxs(StyledText, { Style: Theme.Progress.Percent, children: [Math.round(Ratio * 100), "%"] })] }));
}
export function KeyValueRow(Props) {
    const Theme = useTheme();
    return (_jsxs(Box, { children: [_jsx(StyledText, { Style: Theme.Base.Muted, children: Props.KeyName }), _jsx(Text, { children: ": " }), _jsx(StyledText, { Style: Theme.Base.Text, children: Props.Value })] }));
}
export const useTheme = () => {
    const RuntimeContext = useRuntimeContext();
    return Context.get(RuntimeContext, InkThemeReference);
};
export const ToInkTextProps = (Style) => {
    return {
        ...((Style?.BackgroundColor !== undefined) ? { backgroundColor: Style.BackgroundColor } : {}),
        ...((Style?.Bold !== undefined) ? { bold: Style.Bold } : {}),
        ...((Style?.Color !== undefined) ? { color: Style.Color } : {}),
        ...((Style?.Dim !== undefined) ? { dimColor: Style.Dim } : {}),
        ...((Style?.Inverse !== undefined) ? { inverse: Style.Inverse } : {}),
        ...((Style?.Italic !== undefined) ? { italic: Style.Italic } : {}),
        ...((Style?.Strikethrough !== undefined) ? { strikethrough: Style.Strikethrough } : {}),
        ...((Style?.Underline !== undefined) ? { underline: Style.Underline } : {})
    };
};
export const ToInkBorderStyle = (Border) => {
    return Border?.Style;
};
const Clamp = (Value, Minimum, Maximum) => {
    return Math.min(Math.max(Value, Minimum), Maximum);
};
//# sourceMappingURL=Component.js.map