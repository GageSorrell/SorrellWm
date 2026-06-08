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
export type BoxBorderStyle = "single" | "double" | "round" | "bold" | "singleDouble" | "doubleSingle" | "classic";
export interface TextStyle {
    readonly Bold?: boolean;
    readonly Dim?: boolean;
    readonly Italic?: boolean;
    readonly Underline?: boolean;
    readonly Strikethrough?: boolean;
    readonly Inverse?: boolean;
    readonly Color?: InkColor;
    readonly BackgroundColor?: InkColor;
}
export interface BorderStyle {
    readonly Style?: BoxBorderStyle;
    readonly Color?: InkColor;
    readonly Dim?: boolean;
}
export interface BaseTheme {
    readonly Text: TextStyle;
    readonly Muted: TextStyle;
    readonly Accent: TextStyle;
    readonly Info: TextStyle;
    readonly Success: TextStyle;
    readonly Warning: TextStyle;
    readonly Error: TextStyle;
    readonly Border: BorderStyle;
}
export interface HelpTheme {
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
export interface PromptTheme {
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
export interface ProgressTheme {
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
export interface CliTheme {
    readonly VersionName: TextStyle;
    readonly VersionNumber: TextStyle;
    readonly ErrorTitle: TextStyle;
    readonly ErrorMessage: TextStyle;
    readonly WarningTitle: TextStyle;
    readonly WarningMessage: TextStyle;
    readonly PlainTextFallback: TextStyle;
}
export interface InkTheme {
    readonly Base: BaseTheme;
    readonly Help: HelpTheme;
    readonly Prompt: PromptTheme;
    readonly Progress: ProgressTheme;
    readonly Cli: CliTheme;
}
export type PartialTheme<T> = {
    readonly [Key in keyof T]?: T[Key] extends object ? PartialTheme<T[Key]> : T[Key];
};
export declare const DefaultTheme: InkTheme;
export declare const InkThemeReference: Context.Reference<InkTheme>;
export declare const LayerDefault: Layer.Layer<never, never, never>;
export declare const LayerFromTheme: (Theme: InkTheme) => Layer.Layer<never, never, never>;
export declare const LayerFromPartialTheme: (Theme: PartialTheme<InkTheme>, BaseTheme?: InkTheme) => Layer.Layer<never, never, never>;
export declare const MergeTheme: (Theme: PartialTheme<InkTheme>, BaseTheme?: InkTheme) => InkTheme;
export declare const MergeTextStyle: (BaseStyle: TextStyle, Style: PartialTheme<TextStyle> | undefined) => TextStyle;
export declare const MergeBorderStyle: (BaseStyle: BorderStyle, Style: PartialTheme<BorderStyle> | undefined) => BorderStyle;
export declare const ApplyTextStyle: (BaseStyle: TextStyle, Style: TextStyle) => TextStyle;
//# sourceMappingURL=Theme.d.ts.map