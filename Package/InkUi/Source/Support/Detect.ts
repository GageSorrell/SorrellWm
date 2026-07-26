/**
 * Passive terminal identity and capability hints.
 *
 * @module @sorrell/ink-ui/Support/Detect
 *
 * @file      Detect.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    MouseGranularity,
    type ColorDepth,
    type TerminalIdentity,
    type TerminalKind,
    type TerminalMultiplexer,
    type TerminalSupport
} from "./Types.js";

const Names: Readonly<Record<TerminalKind, string>> =
    {
        alacritty: "Alacritty",
        "apple-terminal": "Apple Terminal",
        foot: "foot",
        ghostty: "Ghostty",
        "gnome-terminal": "GNOME Terminal",
        hyper: "Hyper",
        iterm2: "iTerm2",
        kitty: "kitty",
        konsole: "Konsole",
        mintty: "mintty",
        rio: "Rio",
        unknown: "Unknown terminal",
        vscode: "Visual Studio Code terminal",
        warp: "Warp",
        wezterm: "WezTerm",
        "windows-terminal": "Windows Terminal",
        xterm: "xterm"
    };

/** Detect a terminal from conventional environment variables and an optional XTVERSION response. */
export function DetectTerminal(
    Environment: NodeJS.ProcessEnv = process.env,
    VersionReport?: string
): TerminalIdentity
{
    const Multiplexer: TerminalMultiplexer | undefined = DetectMultiplexer(Environment);
    const ReportIdentity: { readonly Kind: TerminalKind; readonly Version?: string } | undefined =
        VersionReport === undefined ? undefined : ParseVersionReport(VersionReport);
    const Kind: TerminalKind = ReportIdentity?.Kind ?? DetectKind(Environment);
    const EnvironmentVersion: string | undefined = GetEnvironmentVersion(Kind, Environment);
    const Version: string | undefined = ReportIdentity?.Version ?? EnvironmentVersion;

    return {
        Kind,
        ...(Multiplexer === undefined ? { } : { Multiplexer }),
        Name: Names[Kind],
        ...(Version === undefined ? { } : { Version })
    };
}

/** Construct passive capability hints. Active query results should override these values. */
export function GetPassiveSupport(
    Environment: NodeJS.ProcessEnv = process.env,
    Terminal: TerminalIdentity = DetectTerminal(Environment)
): TerminalSupport
{
    const Term: string = Environment.TERM?.toLowerCase() ?? "";
    const IsDumb: boolean = Term === "dumb";
    const ColorDepth: ColorDepth | undefined = DetectColorDepth(Environment, Terminal, IsDumb);
    const Modern: boolean = !IsDumb && Terminal.Kind !== "unknown" && Terminal.Kind !== "xterm";
    const Unicode: boolean | undefined = DetectUnicode(Environment, IsDumb);
    const MouseCell: boolean | undefined = IsDumb ? false : (Modern ? true : undefined);

    return {
        AlternateScreen: IsDumb ? false : (Term.length > 0 ? true : undefined),
        BackgroundColor: undefined,
        BracketedPaste: IsDumb ? false : (Modern ? true : undefined),
        CellSizePixels: undefined,
        Clipboard: IsDumb ? false : undefined,
        ColorDepth,
        FocusEvents: IsDumb ? false : (Modern ? true : undefined),
        ForegroundColor: undefined,
        Hyperlinks: IsDumb ? false : (SupportsKnownHyperlinks(Terminal.Kind) ? true : undefined),
        ItermImages: Terminal.Kind === "iterm2" && Terminal.Multiplexer === undefined
            ? true
            : (IsDumb ? false : undefined),
        KittyGraphics: Terminal.Kind === "kitty" && Terminal.Multiplexer === undefined
            ? true
            : (IsDumb ? false : undefined),
        KittyKeyboard: Terminal.Kind === "kitty" && Terminal.Multiplexer === undefined
            ? true
            : (IsDumb ? false : undefined),
        Mouse: {
            Cell: MouseCell,
            Granularity: MouseCell === false
                ? MouseGranularity.None()
                : (MouseCell === true ? MouseGranularity.Cell() : MouseGranularity.Unknown()),
            Pixel: IsDumb ? false : undefined,
            Sgr: IsDumb ? false : (Modern ? true : undefined),
            Supported: MouseCell
        },
        Sixel: IsDumb ? false : undefined,
        SynchronizedOutput: IsDumb ? false : undefined,
        Terminal,
        TrueColor: ColorDepth === undefined ? undefined : ColorDepth === 24,
        Unicode
    };
}

function DetectKind(Environment: NodeJS.ProcessEnv): TerminalKind
{
    const Program: string = Environment.TERM_PROGRAM?.toLowerCase() ?? "";
    const Term: string = Environment.TERM?.toLowerCase() ?? "";

    if (Environment.WT_SESSION !== undefined)
    {
        return "windows-terminal";
    }
    if (Environment.KITTY_WINDOW_ID !== undefined || Term.includes("kitty"))
    {
        return "kitty";
    }
    if (Environment.KONSOLE_VERSION !== undefined || Environment.KONSOLE_DBUS_SESSION !== undefined)
    {
        return "konsole";
    }
    if (Environment.GHOSTTY_RESOURCES_DIR !== undefined || Term.includes("ghostty"))
    {
        return "ghostty";
    }
    if (Environment.ALACRITTY_SOCKET !== undefined || Program.includes("alacritty"))
    {
        return "alacritty";
    }
    if (Environment.WEZTERM_PANE !== undefined || Program.includes("wezterm"))
    {
        return "wezterm";
    }
    if (Environment.VSCODE_INJECTION !== undefined || Program === "vscode")
    {
        return "vscode";
    }
    if (Environment.WARP_IS_LOCAL_SHELL_SESSION !== undefined || Program.includes("warp"))
    {
        return "warp";
    }
    if (Environment.FOOT_CLIENT_PID !== undefined || Term === "foot" || Term.startsWith("foot-"))
    {
        return "foot";
    }
    if (Program.includes("iterm"))
    {
        return "iterm2";
    }
    if (Program === "apple_terminal")
    {
        return "apple-terminal";
    }
    if (Program.includes("hyper"))
    {
        return "hyper";
    }
    if (Program.includes("rio"))
    {
        return "rio";
    }
    if (Program.includes("mintty") || Environment.MSYSTEM !== undefined)
    {
        return "mintty";
    }
    if (Environment.GNOME_TERMINAL_SCREEN !== undefined || Environment.VTE_VERSION !== undefined)
    {
        return "gnome-terminal";
    }
    if (Term.includes("xterm"))
    {
        return "xterm";
    }

    return "unknown";
}

/** Determine which multiplexer is being used, if any. */
function DetectMultiplexer(Environment: NodeJS.ProcessEnv): TerminalMultiplexer | undefined
{
    if (Environment.TMUX !== undefined)
    {
        return "tmux";
    }
    if (Environment.STY !== undefined || Environment.TERM?.startsWith("screen") === true)
    {
        return "screen";
    }
    return undefined;
}

function ParseVersionReport(Report: string):
    { readonly Kind: TerminalKind; readonly Version?: string } | undefined
{
    const Value: string = Report.trim();
    const Matchers: ReadonlyArray<readonly [ RegExp, TerminalKind ]> = [
        [ /iTerm2\s*([\w.+-]+)?/i, "iterm2" ],
        [ /kitty\s*\(?([\w.+-]+)?/i, "kitty" ],
        [ /Konsole\s*([\w.+-]+)?/i, "konsole" ],
        [ /WezTerm\s*([\w.+-]+)?/i, "wezterm" ],
        [ /Ghostty\s*([\w.+-]+)?/i, "ghostty" ],
        [ /Windows Terminal\s*([\w.+-]+)?/i, "windows-terminal" ],
        [ /Alacritty\s*([\w.+-]+)?/i, "alacritty" ],
        [ /XTerm\(?([\d.]+)?/i, "xterm" ]
    ];

    for (const [ Pattern, Kind ] of Matchers)
    {
        const Match: RegExpMatchArray | null = Value.match(Pattern);
        if (Match !== null)
        {
            return { Kind, ...(Match[1] === undefined ? { } : { Version: Match[1] }) };
        }
    }

    return undefined;
}

function GetEnvironmentVersion(Kind: TerminalKind, Environment: NodeJS.ProcessEnv): string | undefined
{
    switch (Kind)
    {
        case "iterm2": return Environment.TERM_PROGRAM_VERSION;
        case "konsole": return Environment.KONSOLE_VERSION;
        case "vscode": return Environment.TERM_PROGRAM_VERSION;
        case "wezterm": return Environment.TERM_PROGRAM_VERSION;
        default: return undefined;
    }
}

function DetectColorDepth(
    Environment: NodeJS.ProcessEnv,
    Terminal: TerminalIdentity,
    IsDumb: boolean
): ColorDepth | undefined
{
    if (IsDumb)
    {
        return 1;
    }
    const ColorTerm: string = Environment.COLORTERM?.toLowerCase() ?? "";
    if (ColorTerm === "truecolor" || ColorTerm === "24bit")
    {
        return 24;
    }
    if (KnownTrueColor(Terminal.Kind))
    {
        return 24;
    }
    const Term: string = Environment.TERM?.toLowerCase() ?? "";
    if (Term.includes("direct") || Term.includes("truecolor"))
    {
        return 24;
    }
    if (Term.includes("256color"))
    {
        return 8;
    }
    if (Term.length > 0)
    {
        return 4;
    }
    return undefined;
}

function KnownTrueColor(Kind: TerminalKind): boolean
{
    return [
        "alacritty",
        "foot",
        "ghostty",
        "iterm2",
        "kitty",
        "konsole",
        "rio",
        "vscode",
        "warp",
        "wezterm",
        "windows-terminal"
    ].includes(Kind);
}

function SupportsKnownHyperlinks(Kind: TerminalKind): boolean
{
    return [
        "alacritty",
        "foot",
        "ghostty",
        "gnome-terminal",
        "iterm2",
        "kitty",
        "konsole",
        "rio",
        "vscode",
        "warp",
        "wezterm",
        "windows-terminal"
    ].includes(Kind);
}

function DetectUnicode(Environment: NodeJS.ProcessEnv, IsDumb: boolean): boolean | undefined
{
    if (IsDumb)
    {
        return false;
    }

    const Locale: string =
        `${ Environment.LC_ALL ?? "" } ${ Environment.LC_CTYPE ?? "" } ${ Environment.LANG ?? "" }`;

    if (/UTF-?8/i.test(Locale))
    {
        return true;
    }
    if (process.platform === "win32" && Environment.WT_SESSION !== undefined)
    {
        return true;
    }
    return undefined;
}
