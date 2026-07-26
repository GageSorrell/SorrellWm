/**
 * Types used by terminal feature detection.
 *
 * @module @sorrell/ink-ui/Support/Types
 *
 * @file      Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Data } from "effect";

/** A terminal emulator which can be identified without relying on `$TERM` alone. */
export type TerminalKind =
    | "alacritty"
    | "apple-terminal"
    | "foot"
    | "ghostty"
    | "gnome-terminal"
    | "hyper"
    | "iterm2"
    | "kitty"
    | "konsole"
    | "mintty"
    | "rio"
    | "vscode"
    | "warp"
    | "wezterm"
    | "windows-terminal"
    | "xterm"
    | "unknown";

export type TerminalMultiplexer =
    | "screen"
    | "tmux";

/** Best-effort identity of the terminal at the other end of the TTY. */
export interface TerminalIdentity
{
    readonly Kind: TerminalKind;
    readonly Multiplexer?: TerminalMultiplexer;
    readonly Name: string;
    readonly Version?: string;
}

export interface PixelSize
{
    readonly Height: number;
    readonly Width: number;
}

/** An eight-bit RGB color reported by the terminal. */
export interface RgbColor
{
    readonly Blue: number;
    readonly Green: number;
    readonly Red: number;
}

export type ColorDepth =
    | 1
    | 4
    | 8
    | 24;

export type MouseGranularity = Data.TaggedEnum<{
    readonly Cell: { };
    readonly Pixel: { };
    readonly Both: { };
    readonly None: { };
    readonly Unknown: { };
}>;

export const MouseGranularity = Data.taggedEnum<MouseGranularity>();

/** Mouse protocols recognized by the terminal. `undefined` means that no reliable answer was available. */
export interface MouseSupport
{
    readonly Cell: boolean | undefined;
    readonly Granularity: MouseGranularity;
    readonly Pixel: boolean | undefined;
    readonly Sgr: boolean | undefined;
    readonly Supported: boolean | undefined;
}

/**
 * Terminal capabilities. Boolean fields are deliberately three-state: `false`
 * means unsupported, while `undefined` means that detection was inconclusive.
 */
export interface TerminalSupport
{
    readonly AlternateScreen: boolean | undefined;
    readonly BackgroundColor: RgbColor | undefined;
    readonly BracketedPaste: boolean | undefined;
    readonly CellSizePixels: PixelSize | undefined;
    readonly Clipboard: boolean | undefined;
    readonly ColorDepth: ColorDepth | undefined;
    readonly FocusEvents: boolean | undefined;
    readonly ForegroundColor: RgbColor | undefined;
    readonly Hyperlinks: boolean | undefined;
    readonly ItermImages: boolean | undefined;
    readonly KittyGraphics: boolean | undefined;
    readonly KittyKeyboard: boolean | undefined;
    readonly Mouse: MouseSupport;
    readonly Sixel: boolean | undefined;
    readonly SynchronizedOutput: boolean | undefined;
    readonly Terminal: TerminalIdentity;
    readonly TrueColor: boolean | undefined;
    readonly Unicode: boolean | undefined;
}

export interface TerminalQueryOptions
{
    /** Environment used for passive detection. Defaults to `process.env`. */
    readonly Environment?: NodeJS.ProcessEnv;
    /** Ignore the per-output-stream query cache. */
    readonly Refresh?: boolean;
    readonly SetRawMode?: (Value: boolean) => void;
    readonly Stdin?: NodeJS.ReadStream;
    readonly Stdout?: NodeJS.WriteStream;
    /** Maximum time to collect terminal responses. Defaults to 750 milliseconds. */
    readonly TimeoutMs?: number;
}

export type TerminalFontSource = Data.TaggedEnum<{
    readonly Configuration: { };
    readonly Environment: { };
    readonly TerminalQuery: { };
}>;

export const TerminalFontSource = Data.taggedEnum<TerminalFontSource>();

/** The detected primary font and where it was obtained. */
export interface TerminalFont
{
    readonly ConfigPath?: string;
    readonly Family: string;
    readonly Source: TerminalFontSource;
}

export interface TerminalFontQueryOptions extends TerminalQueryOptions
{
    /** Override the home directory used for configuration discovery. */
    readonly HomeDirectory?: string;

    /** Skip terminal detection when it has already been performed. */
    readonly Terminal?: TerminalIdentity;
}
