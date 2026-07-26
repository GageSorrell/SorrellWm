/**
 * Terminal-specific font discovery.
 *
 * @module @sorrell/ink-ui/Support/Font
 *
 * @file      Font.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Path from "node:path";
import { Array, Option, Predicate, String, flow, pipe } from "effect";
import type {
    TerminalFont,
    TerminalFontQueryOptions,
    TerminalIdentity
} from "./Types.js";
import { DetectTerminal } from "./Detect.js";
import { QueryTerminalSupport } from "./Query.js";
import { TerminalFontSource } from "./Types.js";
import { execFile } from "node:child_process";
import { homedir } from "node:os";
import { parse } from "jsonc-parser";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";

const ExecuteFile = promisify(execFile);

/** Query the primary font used by the detected terminal. This function never throws. */
export async function QueryTerminalFont(
    Options: TerminalFontQueryOptions = { }
): Promise<TerminalFont | undefined>
{
    const Environment: NodeJS.ProcessEnv = Options.Environment ?? process.env;
    const Home: string = Options.HomeDirectory ?? homedir();

    try
    {
        const Terminal: TerminalIdentity = Options.Terminal
            ?? (await QueryTerminalSupport(Options)).Terminal
            ?? DetectTerminal(Environment);
        const Result: TerminalFont | undefined = await QueryForTerminal(Terminal, Environment, Home);
        if (Result !== undefined)
        {
            return Result;
        }

        const EnvironmentFont: Option.Option<string> = FirstValue(
            Environment.TERMINAL_FONT,
            Environment.TERM_FONT,
            Environment.LC_TERMINAL_FONT
        );

        return Option.isSome(EnvironmentFont)
            ? { Family: EnvironmentFont.value, Source: TerminalFontSource.Environment() }
            : undefined;
    }
    catch
    {
        return undefined;
    }
}

/** Convenience form of {@link QueryTerminalFont} which returns only the family name. */
export async function QueryTerminalFontFamily(
    Options: TerminalFontQueryOptions = { }
): Promise<string | undefined>
{
    return (await QueryTerminalFont(Options))?.Family;
}

const QueryForTerminal = async (
    Terminal: TerminalIdentity,
    Environment: NodeJS.ProcessEnv,
    Home: string
): Promise<TerminalFont | undefined> =>
{
    switch (Terminal.Kind)
    {
        case "windows-terminal": return QueryWindowsTerminalFont(Environment);
        case "kitty": return QueryKittyFont(Environment, Home);
        case "konsole": return QueryKonsoleFont(Environment, Home);
        case "ghostty": return QueryGhosttyFont(Environment, Home);
        case "alacritty": return QueryAlacrittyFont(Environment, Home);
        case "wezterm": return QueryWezTermFont(Environment, Home);
        case "iterm2": return QueryItermFont(Environment, Home);
        default: return undefined;
    }
};

const QueryWindowsTerminalFont = async (Env: NodeJS.ProcessEnv): Promise<TerminalFont | undefined> =>
{
    const LocalAppData: string | undefined = Env.LOCALAPPDATA;
    if (LocalAppData === undefined)
    {
        return undefined;
    }
    const Paths: ReadonlyArray<string> = [
        Path.join(LocalAppData, "Packages", "Microsoft.WindowsTerminal_8wekyb3d8bbwe",
            "LocalState", "settings.json"),
        Path.join(LocalAppData, "Packages", "Microsoft.WindowsTerminalPreview_8wekyb3d8bbwe",
            "LocalState", "settings.json"),
        Path.join(LocalAppData, "Packages", "Microsoft.WindowsTerminalCanary_8wekyb3d8bbwe",
            "LocalState", "settings.json"),
        Path.join(LocalAppData, "Microsoft", "Windows Terminal", "settings.json")
    ];

    for (const ConfigPath of Paths)
    {
        const Content: string | undefined = await ReadText(ConfigPath);
        if (Content === undefined)
        {
            continue;
        }
        const Settings: unknown = parse(Content);
        if (!IsRecord(Settings))
        {
            continue;
        }
        const Profiles: unknown = Settings.profiles;
        if (!IsRecord(Profiles))
        {
            continue;
        }
        const Defaults: UnknownRecord = IsRecord(Profiles.defaults) ? Profiles.defaults : { };
        const ProfileList: ReadonlyArray<unknown> = Array.isArray(Profiles.list) ? Profiles.list : [ ];
        const ProfileKey: string | undefined = FirstValue(
            Env.WT_PROFILE_ID,
            StringValue(Settings.defaultProfile)
        ).valueOrUndefined;
        const Profile: UnknownRecord | undefined = ProfileList
            .filter(IsRecord)
            .find((Candidate: UnknownRecord) => ProfileMatches(Candidate, ProfileKey));
        const Family: string | undefined = GetWindowsFontFace(Profile) ?? GetWindowsFontFace(Defaults);

        return {
            ConfigPath,
            Family: Family ?? "Cascadia Mono",
            Source: TerminalFontSource.Configuration()
        };
    }

    return undefined;
};

const ProfileMatches = (Profile: UnknownRecord, ProfileKey: string | undefined): boolean =>
{
    if (ProfileKey === undefined)
    {
        return false;
    }
    const Key: string = NormalizeIdentifier(ProfileKey);
    return [ StringValue(Profile.guid), StringValue(Profile.name) ]
        .some((Value: string | undefined) => Value !== undefined && NormalizeIdentifier(Value) === Key);
};

const GetWindowsFontFace = (Profile: UnknownRecord | undefined): string | undefined =>
{
    if (Profile === undefined)
    {
        return undefined;
    }

    const Font: unknown = Profile.font;

    const Values: ReadonlyArray<string | undefined> =
        [
            IsRecord(Font)
                ? StringValue(Font.face)
                : undefined,
            StringValue(Profile.fontFace)
        ] as const;

    return FirstValue(...Values).valueOrUndefined;
};

const QueryKittyFont = async (
    Environment: NodeJS.ProcessEnv,
    Home: string
): Promise<TerminalFont | undefined> =>
{
    const ConfigDirectory: string = Environment.KITTY_CONFIG_DIRECTORY
        ?? Path.join(Environment.XDG_CONFIG_HOME ?? Path.join(Home, ".config"), "kitty");
    const ConfigPath: string = Environment.KITTY_CONFIG_FILE ?? Path.join(ConfigDirectory, "kitty.conf");
    const Family: string | undefined = await ReadKittyFont(ConfigPath, Environment, new Set<string>());
    return Family === undefined
        ? undefined
        : { ConfigPath, Family, Source: TerminalFontSource.Configuration() };
};

const ReadKittyFont = async (
    ConfigPath: string,
    Environment: NodeJS.ProcessEnv,
    Seen: Set<string>
): Promise<string | undefined> =>
{
    const ResolvedPath: string = Path.resolve(ConfigPath);
    if (Seen.has(ResolvedPath) || Seen.size >= 16)
    {
        return undefined;
    }
    Seen.add(ResolvedPath);
    const Content: string | undefined = await ReadText(ResolvedPath);
    if (Content === undefined)
    {
        return undefined;
    }
    let Family: string | undefined;

    for (const Line of LogicalLines(Content))
    {
        const Match: RegExpMatchArray | null = Line.match(/^\s*([^\s#]+)\s+(.*?)\s*$/);
        if (Match === null)
        {
            continue;
        }
        const Key: string = Match[1] ?? "";
        const Value: string = Match[2] ?? "";
        if (Key === "font_family")
        {
            Family = Unquote(Value);
        }
        if (Key === "include")
        {
            const IncludePath: string = ExpandPath(Value, Environment, Path.dirname(ResolvedPath));
            Family = (await ReadKittyFont(IncludePath, Environment, Seen)) ?? Family;
        }
    }
    return Family;
};

const QueryKonsoleFont = async (
    Environment: NodeJS.ProcessEnv,
    Home: string
): Promise<TerminalFont | undefined> =>
{
    const ConfigHome: string = Environment.XDG_CONFIG_HOME ?? Path.join(Home, ".config");
    const DataHome: string = Environment.XDG_DATA_HOME ?? Path.join(Home, ".local", "share");
    let ProfileName: string | undefined = Environment.KONSOLE_PROFILE_NAME;
    if (ProfileName === undefined)
    {
        const KonsoleRc: string | undefined = await ReadText(Path.join(ConfigHome, "konsolerc"));
        ProfileName = KonsoleRc?.match(/^DefaultProfile=(.+)$/m)?.[1]?.trim();
    }
    if (ProfileName === undefined)
    {
        return undefined;
    }
    const FileName: string = ProfileName.endsWith(".profile") ? ProfileName : `${ ProfileName }.profile`;
    const ConfigPath: string = Path.isAbsolute(FileName)
        ? FileName
        : Path.join(DataHome, "konsole", FileName);
    const Content: string | undefined = await ReadText(ConfigPath);
    const FontValue: string | undefined = Content?.match(/^Font=(.+)$/m)?.[1]?.trim();
    const Family: string | undefined = FontValue?.split(",")[0]?.trim();
    return Family === undefined || Family.length === 0
        ? undefined
        : { ConfigPath, Family: Unquote(Family), Source: TerminalFontSource.Configuration() };
};

const QueryGhosttyFont = (
    Environment: NodeJS.ProcessEnv,
    Home: string
): Promise<TerminalFont | undefined> =>
{
    const ConfigHome: string = Environment.XDG_CONFIG_HOME ?? Path.join(Home, ".config");
    const Paths: ReadonlyArray<string> = Environment.GHOSTTY_CONFIG_FILE === undefined
        ? [
            Path.join(ConfigHome, "ghostty", "config.ghostty"),
            Path.join(ConfigHome, "ghostty", "config")
        ]
        : [ Environment.GHOSTTY_CONFIG_FILE ];
    return QueryKeyValueFont(Paths, /^\s*font-family\s*=\s*(.+?)\s*$/gm);
};

const QueryAlacrittyFont = async (
    Environment: NodeJS.ProcessEnv,
    Home: string
): Promise<TerminalFont | undefined> =>
{
    const ConfigHome: string = Environment.XDG_CONFIG_HOME ?? Path.join(Home, ".config");
    const Paths: ReadonlyArray<string> = Environment.ALACRITTY_CONFIG_FILE === undefined
        ? [
            Path.join(ConfigHome, "alacritty", "alacritty.toml"),
            Path.join(ConfigHome, "alacritty", "alacritty.yml"),
            Path.join(ConfigHome, "alacritty", "alacritty.yaml")
        ]
        : [ Environment.ALACRITTY_CONFIG_FILE ];

    for (const ConfigPath of Paths)
    {
        const Content: string | undefined = await ReadText(ConfigPath);
        if (Content === undefined)
        {
            continue;
        }
        const TomlSection: string | undefined = Content.match(/\[font\.normal\]([\s\S]*?)(?=\n\s*\[|$)/)?.[1];
        const Family: string | undefined = TomlSection?.match(/^\s*family\s*=\s*(.+?)\s*$/m)?.[1]
            ?? Content.match(/^\s{4,}family:\s*(.+?)\s*$/m)?.[1];
        if (Family !== undefined)
        {
            return {
                ConfigPath,
                Family: Unquote(Family),
                Source: TerminalFontSource.Configuration()
            };
        }
    }
    return undefined;
};

const QueryWezTermFont = async (
    Environment: NodeJS.ProcessEnv,
    Home: string
): Promise<TerminalFont | undefined> =>
{
    const ConfigHome: string = Environment.XDG_CONFIG_HOME ?? Path.join(Home, ".config");
    const Paths: ReadonlyArray<string> = Environment.WEZTERM_CONFIG_FILE === undefined
        ? [ Path.join(Home, ".wezterm.lua"), Path.join(ConfigHome, "wezterm", "wezterm.lua") ]
        : [ Environment.WEZTERM_CONFIG_FILE ];

    for (const ConfigPath of Paths)
    {
        const Content: string | undefined = await ReadText(ConfigPath);
        if (Content === undefined)
        {
            continue;
        }
        const Family: string | undefined = Content.match(/font\s*=\s*wezterm\.font\(\s*["']([^"']+)/)?.[1]
            ?? Content.match(/font\s*=\s*wezterm\.font_with_fallback\(\s*\{\s*["']([^"']+)/)?.[1];
        if (Family !== undefined)
        {
            return { ConfigPath, Family, Source: TerminalFontSource.Configuration() };
        }
    }
    return undefined;
};

const QueryItermFont = async (
    Environment: NodeJS.ProcessEnv,
    Home: string
): Promise<TerminalFont | undefined> =>
{
    if (process.platform !== "darwin")
    {
        return undefined;
    }
    const ConfigPath: string = Path.join(Home, "Library", "Preferences", "com.googlecode.iterm2.plist");
    try
    {
        const { stdout } = await ExecuteFile("plutil", [ "-convert", "json", "-o", "-", ConfigPath ], {
            encoding: "utf8",
            timeout: 1_000
        });
        const Settings: unknown = JSON.parse(stdout);
        if (!IsRecord(Settings))
        {
            return undefined;
        }
        const Bookmarks: ReadonlyArray<unknown> = Array.isArray(Settings["New Bookmarks"])
            ? Settings["New Bookmarks"]
            : [ ];
        const ProfileKey: string | undefined = FirstValue(
            Environment.ITERM_PROFILE,
            StringValue(Settings["Default Bookmark Guid"])
        ).valueOrUndefined;
        const Profile: UnknownRecord | undefined = Bookmarks.filter(IsRecord)
            .find((Candidate: UnknownRecord) => [ Candidate.Name, Candidate.Guid ]
                .some((Value: unknown) => StringValue(Value) === ProfileKey));
        const NormalFont: string | undefined = StringValue(Profile?.["Normal Font"]);
        const Family: string | undefined = NormalFont?.replace(/\s+\d+(?:\.\d+)?$/, "").trim();
        return Family === undefined || Family.length === 0
            ? undefined
            : { ConfigPath, Family, Source: TerminalFontSource.Configuration() };
    }
    catch
    {
        return undefined;
    }
};

const QueryKeyValueFont = async (
    Paths: ReadonlyArray<string>,
    Pattern: RegExp
): Promise<TerminalFont | undefined> =>
{
    for (const ConfigPath of Paths)
    {
        const Content: string | undefined = await ReadText(ConfigPath);
        if (Content === undefined)
        {
            continue;
        }
        Pattern.lastIndex = 0;
        const Matches: ReadonlyArray<RegExpMatchArray> = [ ...Content.matchAll(Pattern) ];
        const Family: string | undefined = Matches.at(-1)?.[1];
        if (Family !== undefined && Family.length > 0)
        {
            return {
                ConfigPath,
                Family: Unquote(Family.trim()),
                Source: TerminalFontSource.Configuration()
            } as const;
        }
    }
    return undefined;
};

const LogicalLines = (Content: string): ReadonlyArray<string> =>
{
    const Lines: Array<string> = [ ];
    for (const Line of Content.split(/\r?\n/))
    {
        if (Line.startsWith("\\") && Lines.length > 0)
        {
            Lines[Lines.length - 1] += Line.slice(1).trimStart();
        }
        else
        {
            Lines.push(Line);
        }
    }
    return Lines;
};

const ExpandPath = (Value: string, Environment: NodeJS.ProcessEnv, Base: string): string =>
{
    const Expanded: string = Unquote(Value)
        .replace(/^~(?=$|[\\/])/, Environment.HOME ?? homedir())
        .replace(/\$\{([^}]+)\}/g, (_Match: string, Name: string) => Environment[Name] ?? "");
    return Path.isAbsolute(Expanded) ? Expanded : Path.join(Base, Expanded);
};

const ReadText = async (FilePath: string): Promise<string | undefined> =>
{
    try
    {
        return await readFile(FilePath, "utf8");
    }
    catch
    {
        return undefined;
    }
};

const FirstValue = (...Values: ReadonlyArray<string | undefined>): Option.Option<string> =>
    pipe(
        Values,
        Array.filter(Predicate.isNotUndefined),
        Array.findFirst(flow(String.trim, String.isNonEmpty)),
        Option.map(String.trim)
    );

const StringValue = (Value: unknown): string | undefined =>
    (
        typeof Value === "string" &&
        Value.trim().length > 0
    )
        ? Value.trim()
        : undefined;

const NormalizeIdentifier = (Value: string): string =>
{
    return Value.trim().replace(/^\{?|\}?$/g, "").toLowerCase();
};

const Unquote = (Value: string): string =>
{
    return Value.trim().replace(/^(["'])(.*)\1$/, "$2");
};

type UnknownRecord = Record<string, unknown>;

const IsRecord = (Value: unknown): Value is UnknownRecord =>
    typeof Value === "object" && Value !== null && !Array.isArray(Value);
