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

import {
    type BorderStyle,
    type BoxBorderStyle,
    type InkTheme,
    InkThemeReference,
    type TextStyle
} from "./Theme.js";
import { Box, Text } from "ink";
import React, { type ReactNode } from "react";
import { Context } from "effect";
import { useRuntimeContext } from "./React.js";

export interface StyledTextProps
{
    readonly Style?: TextStyle;
    readonly children?: ReactNode;
    readonly Wrap?:
        | undefined
        | "wrap"
        | "hard"
        | "truncate-end"
        | "truncate"
        | "truncate-middle"
        | "truncate-start";
    readonly AriaLabel?: string;
    readonly AriaHidden?: boolean;
}

export function StyledText(
    Props: StyledTextProps
): ReactNode
{
    return (
        <Text
            { ...ToInkTextProps(Props.Style) }
            { ...(Props.AriaHidden !== undefined ? { "aria-hidden": Props.AriaHidden } : { }) }
            { ...(Props.AriaLabel !== undefined ? { "aria-label": Props.AriaLabel } : { }) }
            { ...(Props.Wrap !== undefined ? { wrap: Props.Wrap } : { }) }>
            {Props.children}
        </Text>
    );
}

export interface ThemedTextProps
{
    readonly Select: (Theme: InkTheme) => TextStyle;
    readonly children?: ReactNode;
    readonly Wrap?: StyledTextProps["Wrap"];
    readonly AriaLabel?: string;
    readonly AriaHidden?: boolean;
}

export function ThemedText(
    Props: ThemedTextProps
): ReactNode
{
    const Theme: InkTheme = useTheme();

    return (
        <StyledText
            Style={ Props.Select(Theme) }
            { ...(Props.AriaHidden !== undefined ? { AriaHidden: Props.AriaHidden } : { }) }
            { ...(Props.AriaLabel !== undefined ? { AriaLabel: Props.AriaLabel } : { }) }
            { ...(Props.Wrap !== undefined ? { wrap: Props.Wrap } : { }) }>
            { Props.children }
        </StyledText>
    );
}

export interface InlineTextProps
{
    readonly Items: ReadonlyArray<ReactNode>;
}

export function InlineText(
    Props: InlineTextProps
): ReactNode
{
    return (
        <Text>
            {Props.Items.map((Item: ReactNode, Index: number) => (
                <React.Fragment key={ Index }>
                    { Item }
                </React.Fragment>
            ))}
        </Text>
    );
}

export interface MutedTextProps
{
    readonly children?: ReactNode;
}

export function MutedText(
    Props: MutedTextProps
): ReactNode
{
    return (
        <ThemedText Select={ (Theme: InkTheme) => Theme.Base.Muted }>
            { Props.children }
        </ThemedText>
    );
}

export interface AccentTextProps
{
    readonly children?: ReactNode;
}

export function AccentText(
    Props: AccentTextProps
): ReactNode
{
    return (
        <ThemedText Select={ (Theme: InkTheme) => Theme.Base.Accent }>
            {Props.children}
        </ThemedText>
    );
}

export interface SuccessTextProps
{
    readonly children?: ReactNode;
}

export function SuccessText(
    Props: SuccessTextProps
): ReactNode
{
    return (
        <ThemedText Select={ (Theme: InkTheme) => Theme.Base.Success }>
            {Props.children}
        </ThemedText>
    );
}

export interface WarningTextProps
{
    readonly children?: ReactNode;
}

export function WarningText(
    Props: WarningTextProps
): ReactNode
{
    return (
        <ThemedText Select={ (Theme: InkTheme) => Theme.Base.Warning }>
            {Props.children}
        </ThemedText>
    );
}

export interface ErrorTextProps
{
    readonly children?: ReactNode;
}

export function ErrorText(
    Props: ErrorTextProps
): ReactNode
{
    return (
        <ThemedText Select={ (Theme: InkTheme) => Theme.Base.Error }>
            {Props.children}
        </ThemedText>
    );
}

export interface SectionProps
{
    readonly Title?: ReactNode;
    readonly children?: ReactNode;
    readonly PaddingTop?: number;
    readonly PaddingBottom?: number;
}

export function Section(
    Props: SectionProps
): ReactNode
{
    return (
        <Box
            flexDirection="column"
            paddingBottom={ Props.PaddingBottom ?? 0 }
            paddingTop={ Props.PaddingTop ?? 0 }
        >
            {Props.Title === undefined
                ? null
                : (
                    <ThemedText Select={ (Theme: InkTheme) => Theme.Help.SectionTitle }>
                        {Props.Title}
                    </ThemedText>
                )}
            {Props.children}
        </Box>
    );
}

export interface PanelProps
{
    readonly Title?: ReactNode;
    readonly children?: ReactNode;
    readonly Border?: BorderStyle;
    readonly PaddingX?: number;
    readonly PaddingY?: number;
    readonly MarginTop?: number;
    readonly MarginBottom?: number;
}

export function Panel(
    Props: PanelProps
): ReactNode
{
    const Theme: InkTheme = useTheme();
    const Border: BorderStyle = Props.Border ?? Theme.Base.Border;

    return (
        <Box
            borderColor={ Border.Color }
            borderStyle={ Border.Style as BoxBorderStyle }
            flexDirection="column"
            marginBottom={ Props.MarginBottom ?? 0 }
            marginTop={ Props.MarginTop ?? 0 }
            paddingX={ Props.PaddingX ?? 1 }
            paddingY={ Props.PaddingY ?? 0 }
        >
            {Props.Title === undefined
                ? null
                : (
                    <StyledText Style={ Theme.Help.Title }>
                        {Props.Title}
                    </StyledText>
                )}
            {Props.children}
        </Box>
    );
}

export interface PromptLineProps
{
    readonly Prefix?: ReactNode;
    readonly Message: ReactNode;
    readonly Required?: boolean;
    readonly Optional?: boolean;
}

export function PromptLine(
    Props: PromptLineProps
): ReactNode
{
    const Theme: InkTheme = useTheme();

    return (
        <Box>
            <StyledText Style={ Theme.Prompt.Prefix }>
                {Props.Prefix ?? "?"}
            </StyledText>
            <Text> </Text>
            <StyledText Style={ Theme.Prompt.Message }>
                {Props.Message}
            </StyledText>
            {Props.Required === true
                ? (
                    <>
                        <Text> </Text>
                        <StyledText Style={ Theme.Prompt.RequiredMarker }>
                            *
                        </StyledText>
                    </>
                )
                : null}
            {Props.Optional === true
                ? (
                    <>
                        <Text> </Text>
                        <StyledText Style={ Theme.Prompt.OptionalMarker }>
                            optional
                        </StyledText>
                    </>
                )
                : null}
        </Box>
    );
}

export interface HintLineProps
{
    readonly children?: ReactNode;
}

export function HintLine(
    Props: HintLineProps
): ReactNode
{
    const Theme: InkTheme = useTheme();

    if (Props.children === undefined || Props.children === null)
    {
        return null;
    }

    return (
        <StyledText Style={ Theme.Prompt.Hint }>
            {Props.children}
        </StyledText>
    );
}

export interface ErrorLineProps
{
    readonly children?: ReactNode;
}

export function ErrorLine(
    Props: ErrorLineProps
): ReactNode
{
    const Theme: InkTheme = useTheme();

    if (Props.children === undefined || Props.children === null)
    {
        return null;
    }

    return (
        <StyledText Style={ Theme.Prompt.Error }>
            {Props.children}
        </StyledText>
    );
}

export interface SuccessLineProps
{
    readonly children?: ReactNode;
}

export function SuccessLine(
    Props: SuccessLineProps
): ReactNode
{
    const Theme: InkTheme = useTheme();

    if (Props.children === undefined || Props.children === null)
    {
        return null;
    }

    return (
        <StyledText Style={ Theme.Prompt.Success }>
            {Props.children}
        </StyledText>
    );
}

export interface TextInputLineProps
{
    readonly Value: string;
    readonly Placeholder?: string;
    readonly CursorOffset?: number;
    readonly Mask?: string;
    readonly Focused?: boolean;
}

export function TextInputLine(
    Props: TextInputLineProps
): ReactNode
{
    const Theme: InkTheme = useTheme();

    const DisplayValue: string = Props.Mask === undefined
        ? Props.Value
        : Props.Mask.repeat(Props.Value.length);

    if (DisplayValue.length === 0 && Props.Placeholder !== undefined)
    {
        return (
            <StyledText Style={ Theme.Prompt.Placeholder }>
                {Props.Placeholder}
            </StyledText>
        );
    }

    if (Props.Focused !== true)
    {
        return (
            <StyledText Style={ Theme.Prompt.Input }>
                {DisplayValue}
            </StyledText>
        );
    }

    const CursorOffset: number = Clamp(
        Props.CursorOffset ?? DisplayValue.length,
        0,
        DisplayValue.length
    );

    const BeforeCursor: string = DisplayValue.slice(0, CursorOffset);
    const CursorCharacter: string = DisplayValue.slice(CursorOffset, CursorOffset + 1) || " ";
    const AfterCursor: string = DisplayValue.slice(CursorOffset + 1);

    return (
        <Text>
            <StyledText Style={ Theme.Prompt.Input }>
                {BeforeCursor}
            </StyledText>
            <StyledText Style={ Theme.Prompt.Cursor }>
                {CursorCharacter}
            </StyledText>
            <StyledText Style={ Theme.Prompt.Input }>
                {AfterCursor}
            </StyledText>
        </Text>
    );
}

export interface ChoiceItemProps
{
    readonly Label: ReactNode;
    readonly Description?: ReactNode | undefined;
    readonly Cursor?: boolean | undefined;
    readonly Selected?: boolean | undefined;
    readonly Disabled?: boolean | undefined;
    readonly Index?: number | undefined;
}

export function ChoiceItem(
    Props: ChoiceItemProps
): ReactNode
{
    const Theme: InkTheme = useTheme();

    const LabelStyle: TextStyle = Props.Disabled === true
        ? Theme.Prompt.DisabledChoice
        : Props.Selected === true
            ? Theme.Prompt.SelectedChoice
            : Theme.Prompt.UnselectedChoice;

    return (
        <Box>
            <StyledText Style={ Theme.Prompt.ChoiceCursor }>
                {Props.Cursor === true ? "›" : " "}
            </StyledText>
            <Text> </Text>
            <StyledText Style={ LabelStyle }>
                {Props.Label}
            </StyledText>
            {Props.Description === undefined
                ? null
                : (
                    <>
                        <Text> </Text>
                        <StyledText Style={ Theme.Prompt.ChoiceDescription }>
                            {Props.Description}
                        </StyledText>
                    </>
                )}
        </Box>
    );
}

export interface ChoiceListProps<Choice>
{
    readonly Choices: ReadonlyArray<Choice>;
    readonly GetLabel: (Choice: Choice, Index: number) => ReactNode;
    readonly GetDescription?:
        | undefined
        | ((Choice: Choice, Index: number) => ReactNode | undefined);
    readonly IsCursor?:
        | undefined
        | ((Choice: Choice, Index: number) => boolean);
    readonly IsSelected?:
        | undefined
        | ((Choice: Choice, Index: number) => boolean);
    readonly IsDisabled?:
        | undefined
        | ((Choice: Choice, Index: number) => boolean);
}

export function ChoiceList<Choice>(
    Props: ChoiceListProps<Choice>
): ReactNode
{
    return (
        <Box flexDirection="column">
            {Props.Choices.map((Choice: Choice, Index: number) => (
                <ChoiceItem
                    Cursor={ Props.IsCursor?.(Choice, Index) }
                    Description={ Props.GetDescription?.(Choice, Index) }
                    Disabled={ Props.IsDisabled?.(Choice, Index) }
                    Index={ Index }
                    Label={ Props.GetLabel(Choice, Index) }
                    Selected={ Props.IsSelected?.(Choice, Index) }
                    key={ Index }
                />
            ))}
        </Box>
    );
}

export interface ChoiceGroupTitleProps
{
    readonly children?: ReactNode;
}

export function ChoiceGroupTitle(
    Props: ChoiceGroupTitleProps
): ReactNode
{
    const Theme: InkTheme = useTheme();

    return (
        <StyledText Style={ Theme.Prompt.ChoiceGroupTitle }>
            {Props.children}
        </StyledText>
    );
}

export interface HelpUsageProps
{
    readonly children?: ReactNode;
}

export function HelpUsage(
    Props: HelpUsageProps
): ReactNode
{
    const Theme: InkTheme = useTheme();

    return (
        <StyledText Style={ Theme.Help.Usage }>
            {Props.children}
        </StyledText>
    );
}

export interface HelpFlagProps
{
    readonly Name: ReactNode;
    readonly Type?: ReactNode;
    readonly Required?: boolean;
    readonly Description?: ReactNode;
}

export function HelpFlag(
    Props: HelpFlagProps
): ReactNode
{
    const Theme: InkTheme = useTheme();

    return (
        <Box>
            <StyledText Style={ Theme.Help.FlagName }>
                {Props.Name}
            </StyledText>
            {Props.Type === undefined
                ? null
                : (
                    <>
                        <Text> </Text>
                        <StyledText Style={ Theme.Help.TypeName }>
                            {Props.Type}
                        </StyledText>
                    </>
                )}
            {Props.Required === true
                ? (
                    <>
                        <Text> </Text>
                        <StyledText Style={ Theme.Help.RequiredMarker }>
                            required
                        </StyledText>
                    </>
                )
                : null}
            {Props.Description === undefined
                ? null
                : (
                    <>
                        <Text>  </Text>
                        <StyledText Style={ Theme.Help.Description }>
                            {Props.Description}
                        </StyledText>
                    </>
                )}
        </Box>
    );
}

export interface HelpExampleProps
{
    readonly Command: ReactNode;
    readonly Description?: ReactNode;
}

export function HelpExample(
    Props: HelpExampleProps
): ReactNode
{
    const Theme: InkTheme = useTheme();

    return (
        <Box flexDirection="column">
            <StyledText Style={ Theme.Help.ExampleCommand }>
                {Props.Command}
            </StyledText>
            {Props.Description === undefined
                ? null
                : (
                    <StyledText Style={ Theme.Help.ExampleDescription }>
                        {Props.Description}
                    </StyledText>
                )}
        </Box>
    );
}

export interface SpinnerLineProps
{
    readonly Frame: ReactNode;
    readonly Label?: ReactNode;
    readonly Detail?: ReactNode;
}

export function SpinnerLine(
    Props: SpinnerLineProps
): ReactNode
{
    const Theme: InkTheme = useTheme();

    return (
        <Box>
            <StyledText Style={ Theme.Progress.Spinner }>
                {Props.Frame}
            </StyledText>
            {Props.Label === undefined
                ? null
                : (
                    <>
                        <Text> </Text>
                        <StyledText Style={ Theme.Progress.Label }>
                            {Props.Label}
                        </StyledText>
                    </>
                )}
            {Props.Detail === undefined
                ? null
                : (
                    <>
                        <Text> </Text>
                        <StyledText Style={ Theme.Progress.Detail }>
                            {Props.Detail}
                        </StyledText>
                    </>
                )}
        </Box>
    );
}

export interface ProgressBarProps
{
    readonly Current: number;
    readonly Total: number;
    readonly Width?: number;
}

export function ProgressBar(
    Props: ProgressBarProps
): ReactNode
{
    const Theme: InkTheme = useTheme();
    const Width: number = Props.Width ?? 20;
    const Ratio: number = Props.Total <= 0
        ? 0
        : Clamp(Props.Current / Props.Total, 0, 1);
    const CompletedWidth: number = Math.round(Width * Ratio);
    const RemainingWidth: number = Width - CompletedWidth;

    return (
        <Text>
            <StyledText Style={ Theme.Progress.BarCompleted }>
                {"█".repeat(CompletedWidth)}
            </StyledText>
            <StyledText Style={ Theme.Progress.BarRemaining }>
                {"░".repeat(RemainingWidth)}
            </StyledText>
            <Text> </Text>
            <StyledText Style={ Theme.Progress.Percent }>
                {Math.round(Ratio * 100)}%
            </StyledText>
        </Text>
    );
}

export interface KeyValueRowProps
{
    readonly KeyName: ReactNode;
    readonly Value: ReactNode;
}

export function KeyValueRow(
    Props: KeyValueRowProps
): ReactNode
{
    const Theme: InkTheme = useTheme();

    return (
        <Box>
            <StyledText Style={ Theme.Base.Muted }>
                {Props.KeyName}
            </StyledText>
            <Text>: </Text>
            <StyledText Style={ Theme.Base.Text }>
                {Props.Value}
            </StyledText>
        </Box>
    );
}

export const useTheme = (): InkTheme =>
{
    const RuntimeContext = useRuntimeContext();

    return Context.get(
        RuntimeContext,
        InkThemeReference
    );
};

export const ToInkTextProps = (
    Style: TextStyle | undefined
) =>
{
    return {
        ...((Style?.BackgroundColor !== undefined) ? { backgroundColor: Style.BackgroundColor } : { }),
        ...((Style?.Bold !== undefined) ? { bold: Style.Bold } : { }),
        ...((Style?.Color !== undefined) ? { color: Style.Color } : { }),
        ...((Style?.Dim !== undefined) ? { dimColor: Style.Dim } : { }),
        ...((Style?.Inverse !== undefined) ? { inverse: Style.Inverse } : { }),
        ...((Style?.Italic !== undefined) ? { italic: Style.Italic } : { }),
        ...((Style?.Strikethrough !== undefined) ? { strikethrough: Style.Strikethrough } : { }),
        ...((Style?.Underline !== undefined) ? { underline: Style.Underline } : { })
    };
};

export const ToInkBorderStyle = (
    Border: BorderStyle | undefined
): BoxBorderStyle | undefined =>
{
    return Border?.Style;
};

const Clamp = (
    Value: number,
    Minimum: number,
    Maximum: number
): number =>
{
    return Math.min(
        Math.max(Value, Minimum),
        Maximum
    );
};
