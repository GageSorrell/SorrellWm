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
import { type BorderStyle, type BoxBorderStyle, type InkTheme, type TextStyle } from "./Theme.js";
import { type ReactNode } from "react";
export interface StyledTextProps {
    readonly Style?: TextStyle;
    readonly children?: ReactNode;
    readonly Wrap?: undefined | "wrap" | "hard" | "truncate-end" | "truncate" | "truncate-middle" | "truncate-start";
    readonly AriaLabel?: string;
    readonly AriaHidden?: boolean;
}
export declare function StyledText(Props: StyledTextProps): ReactNode;
export interface ThemedTextProps {
    readonly Select: (Theme: InkTheme) => TextStyle;
    readonly children?: ReactNode;
    readonly Wrap?: StyledTextProps["Wrap"];
    readonly AriaLabel?: string;
    readonly AriaHidden?: boolean;
}
export declare function ThemedText(Props: ThemedTextProps): ReactNode;
export interface InlineTextProps {
    readonly Items: ReadonlyArray<ReactNode>;
}
export declare function InlineText(Props: InlineTextProps): ReactNode;
export interface MutedTextProps {
    readonly children?: ReactNode;
}
export declare function MutedText(Props: MutedTextProps): ReactNode;
export interface AccentTextProps {
    readonly children?: ReactNode;
}
export declare function AccentText(Props: AccentTextProps): ReactNode;
export interface SuccessTextProps {
    readonly children?: ReactNode;
}
export declare function SuccessText(Props: SuccessTextProps): ReactNode;
export interface WarningTextProps {
    readonly children?: ReactNode;
}
export declare function WarningText(Props: WarningTextProps): ReactNode;
export interface ErrorTextProps {
    readonly children?: ReactNode;
}
export declare function ErrorText(Props: ErrorTextProps): ReactNode;
export interface SectionProps {
    readonly Title?: ReactNode;
    readonly children?: ReactNode;
    readonly PaddingTop?: number;
    readonly PaddingBottom?: number;
}
export declare function Section(Props: SectionProps): ReactNode;
export interface PanelProps {
    readonly Title?: ReactNode;
    readonly children?: ReactNode;
    readonly Border?: BorderStyle;
    readonly PaddingX?: number;
    readonly PaddingY?: number;
    readonly MarginTop?: number;
    readonly MarginBottom?: number;
}
export declare function Panel(Props: PanelProps): ReactNode;
export interface PromptLineProps {
    readonly Prefix?: ReactNode;
    readonly Message: ReactNode;
    readonly Required?: boolean;
    readonly Optional?: boolean;
}
export declare function PromptLine(Props: PromptLineProps): ReactNode;
export interface HintLineProps {
    readonly children?: ReactNode;
}
export declare function HintLine(Props: HintLineProps): ReactNode;
export interface ErrorLineProps {
    readonly children?: ReactNode;
}
export declare function ErrorLine(Props: ErrorLineProps): ReactNode;
export interface SuccessLineProps {
    readonly children?: ReactNode;
}
export declare function SuccessLine(Props: SuccessLineProps): ReactNode;
export interface TextInputLineProps {
    readonly Value: string;
    readonly Placeholder?: string;
    readonly CursorOffset?: number;
    readonly Mask?: string;
    readonly Focused?: boolean;
}
export declare function TextInputLine(Props: TextInputLineProps): ReactNode;
export interface ChoiceItemProps {
    readonly Label: ReactNode;
    readonly Description?: ReactNode | undefined;
    readonly Cursor?: boolean | undefined;
    readonly Selected?: boolean | undefined;
    readonly Disabled?: boolean | undefined;
    readonly Index?: number | undefined;
}
export declare function ChoiceItem(Props: ChoiceItemProps): ReactNode;
export interface ChoiceListProps<Choice> {
    readonly Choices: ReadonlyArray<Choice>;
    readonly GetLabel: (Choice: Choice, Index: number) => ReactNode;
    readonly GetDescription?: undefined | ((Choice: Choice, Index: number) => ReactNode | undefined);
    readonly IsCursor?: undefined | ((Choice: Choice, Index: number) => boolean);
    readonly IsSelected?: undefined | ((Choice: Choice, Index: number) => boolean);
    readonly IsDisabled?: undefined | ((Choice: Choice, Index: number) => boolean);
}
export declare function ChoiceList<Choice>(Props: ChoiceListProps<Choice>): ReactNode;
export interface ChoiceGroupTitleProps {
    readonly children?: ReactNode;
}
export declare function ChoiceGroupTitle(Props: ChoiceGroupTitleProps): ReactNode;
export interface HelpUsageProps {
    readonly children?: ReactNode;
}
export declare function HelpUsage(Props: HelpUsageProps): ReactNode;
export interface HelpFlagProps {
    readonly Name: ReactNode;
    readonly Type?: ReactNode;
    readonly Required?: boolean;
    readonly Description?: ReactNode;
}
export declare function HelpFlag(Props: HelpFlagProps): ReactNode;
export interface HelpExampleProps {
    readonly Command: ReactNode;
    readonly Description?: ReactNode;
}
export declare function HelpExample(Props: HelpExampleProps): ReactNode;
export interface SpinnerLineProps {
    readonly Frame: ReactNode;
    readonly Label?: ReactNode;
    readonly Detail?: ReactNode;
}
export declare function SpinnerLine(Props: SpinnerLineProps): ReactNode;
export interface ProgressBarProps {
    readonly Current: number;
    readonly Total: number;
    readonly Width?: number;
}
export declare function ProgressBar(Props: ProgressBarProps): ReactNode;
export interface KeyValueRowProps {
    readonly KeyName: ReactNode;
    readonly Value: ReactNode;
}
export declare function KeyValueRow(Props: KeyValueRowProps): ReactNode;
export declare const useTheme: () => InkTheme;
export declare const ToInkTextProps: (Style: TextStyle | undefined) => {
    underline?: boolean;
    strikethrough?: boolean;
    italic?: boolean;
    inverse?: boolean;
    dimColor?: boolean;
    color?: string;
    bold?: boolean;
    backgroundColor?: string;
};
export declare const ToInkBorderStyle: (Border: BorderStyle | undefined) => BoxBorderStyle | undefined;
//# sourceMappingURL=Component.d.ts.map