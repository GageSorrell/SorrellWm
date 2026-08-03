/**
 * Tests support behavior for `@sorrell/ink-ui`.
 *
 * @module @sorrell/ink-ui/Test/Support.test
 *
 * @file      Support.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/** Terminal support detection tests. */

import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import * as Path from "node:path";
import { PassThrough } from "node:stream";
import { afterEach, describe, expect, it } from "vitest";
import {
    DetectTerminal,
    GetPassiveSupport,
    QueryTerminalFont,
    QueryTerminalSupport
} from "../Source/Support/index.js";

const TemporaryDirectories: Array<string> = [ ];

afterEach(async () =>
{
    await Promise.all(TemporaryDirectories.splice(0)
        .map((Directory: string) => rm(Directory, { force: true, recursive: true })));
});

describe("DetectTerminal", () =>
{
    it.each([
        [ { WT_SESSION: "session" }, "windows-terminal" ],
        [ { TERM_PROGRAM: "iTerm.app", TERM_PROGRAM_VERSION: "3.6.9" }, "iterm2" ],
        [ { KITTY_WINDOW_ID: "1", TERM: "xterm-kitty" }, "kitty" ],
        [ { KONSOLE_VERSION: "260401" }, "konsole" ],
        [ { WEZTERM_PANE: "3" }, "wezterm" ],
        [ { GHOSTTY_RESOURCES_DIR: "/opt/ghostty" }, "ghostty" ],
        [ { TERM: "mystery" }, "unknown" ]
    ])("identifies %s as %s", (Environment, Kind) =>
    {
        expect(DetectTerminal(Environment).Kind).toBe(Kind);
    });

    it("prefers an XTVERSION response and preserves a multiplexer", () =>
    {
        expect(DetectTerminal({ TERM: "screen-256color", TMUX: "socket" }, "kitty 0.42.1"))
            .toMatchObject({ Kind: "kitty", Multiplexer: "tmux", Version: "0.42.1" });
    });

    it("prefers WezTerm's pane identity over an inherited WT_SESSION", () =>
    {
        expect(DetectTerminal({
            TERM_PROGRAM: "WezTerm",
            WEZTERM_PANE: "1",
            WT_SESSION: "inherited"
        }).Kind).toBe("wezterm");
    });
});

describe("GetPassiveSupport", () =>
{
    it("reports truecolor while leaving unverified graphics support unknown", () =>
    {
        const Support = GetPassiveSupport({ COLORTERM: "truecolor", TERM: "xterm-256color" });
        expect(Support.TrueColor).toBe(true);
        expect(Support.ColorDepth).toBe(24);
        expect(Support.Sixel).toBeUndefined();
        expect(Support.Mouse.Granularity._tag).toBe("Unknown");
    });

    it("reports features as unsupported for a dumb terminal", () =>
    {
        const Support = GetPassiveSupport({ TERM: "dumb" });
        expect(Support.AlternateScreen).toBe(false);
        expect(Support.Mouse.Granularity._tag).toBe("None");
        expect(Support.TrueColor).toBe(false);
    });

    it("reads image protocols from TERM_FEATURES", () =>
    {
        const Support = GetPassiveSupport({
            TERM: "xterm-256color",
            TERM_FEATURES: "FileSixel"
        });

        expect(Support.ItermImages).toBe(true);
        expect(Support.Sixel).toBe(true);
    });

    it("recognizes WezTerm's iTerm2-compatible image protocol", () =>
    {
        const Support = GetPassiveSupport({
            TERM: "xterm-256color",
            TERM_FEATURES: "Sixel",
            TERM_PROGRAM: "WezTerm",
            WEZTERM_PANE: "1"
        });

        expect(Support.Terminal.Kind).toBe("wezterm");
        expect(Support.ItermImages).toBe(true);
    });

    it("recognizes WezTerm image support after active identity detection", () =>
    {
        const Environment = { TERM: "xterm-256color" };
        const Terminal = DetectTerminal(Environment, "WezTerm 20240203-110809-5046fc22");

        expect(GetPassiveSupport(Environment, Terminal).ItermImages).toBe(true);
    });
});

describe("QueryTerminalSupport", () =>
{
    it("parses active graphics, dimensions, identity, and mouse protocol replies", async () =>
    {
        const Stdin = new PassThrough() as PassThrough & NodeJS.ReadStream;
        const Stdout = new PassThrough() as PassThrough & NodeJS.WriteStream;
        Object.assign(Stdin, { isRaw: false, isTTY: true });
        Object.assign(Stdout, { columns: 100, isTTY: true, rows: 40 });
        let Raw: boolean = false;
        const SetRawMode = (Value: boolean): void => { Raw = Value; };

        Stdout.once("data", (Query: Buffer) =>
        {
            expect(Query.toString()).toContain("\u001B]1337;Capabilities\u001B\\");
            Stdin.write([
                "\u001B[6;20;10t",
                "\u001B]10;rgb:aaaa/bbbb/cccc\u001B\\",
                "\u001B]11;rgb:1212/3434/5656\u001B\\",
                "\u001BP>|kitty 0.42.1\u001B\\",
                "\u001B[?1;2;4c",
                "\u001B[?1000;2$y",
                "\u001B[?1006;2$y",
                "\u001B[?1016;2$y",
                "\u001B[?2004;2$y",
                "\u001B[?2026;2$y",
                "\u001B[?1u",
                "\u001BP1+r5463\u001B\\",
                "\u001B]1337;Capabilities=FileSixel\u001B\\",
                "\u001B_Gi=31;OK\u001B\\"
            ].join(""));
        });

        const Support = await QueryTerminalSupport({
            Environment: { TERM: "xterm-256color" },
            Refresh: true,
            SetRawMode,
            Stdin,
            Stdout,
            TimeoutMs: 10
        });

        expect(Support.Terminal).toMatchObject({ Kind: "kitty", Version: "0.42.1" });
        expect(Support.CellSizePixels).toMatchObject({ X: 10, Y: 20 });
        expect(Support.BackgroundColor).toEqual({ Blue: 86, Green: 52, Red: 18 });
        expect(Support.ForegroundColor).toEqual({ Blue: 204, Green: 187, Red: 170 });
        expect(Support.Sixel).toBe(true);
        expect(Support.ItermImages).toBe(true);
        expect(Support.KittyGraphics).toBe(true);
        expect(Support.TrueColor).toBe(true);
        expect(Support.Mouse.Granularity._tag).toBe("Both");
        expect(Support.BracketedPaste).toBe(true);
        expect(Support.SynchronizedOutput).toBe(true);
        expect(Support.KittyKeyboard).toBe(true);
        expect(Raw).toBe(false);
    });
});

describe("QueryTerminalFont", () =>
{
    it("reads the active Windows Terminal profile from JSONC settings", async () =>
    {
        const Root: string = await MakeTemporaryDirectory();
        const LocalAppData: string = Path.join(Root, "LocalAppData");
        const SettingsPath: string = Path.join(
            LocalAppData,
            "Packages",
            "Microsoft.WindowsTerminal_8wekyb3d8bbwe",
            "LocalState",
            "settings.json"
        );
        await mkdir(Path.dirname(SettingsPath), { recursive: true });
        await writeFile(SettingsPath, `{
            // Windows Terminal settings are JSON with comments.
            "defaultProfile": "{alpha}",
            "profiles": {
                "defaults": { "font": { "face": "Cascadia Mono" } },
                "list": [
                    { "guid": "{alpha}", "name": "PowerShell", "font": { "face": "Iosevka Term" }, },
                ],
            },
        }`);
        const Environment: NodeJS.ProcessEnv = { LOCALAPPDATA: LocalAppData, WT_SESSION: "session" };

        await expect(QueryTerminalFont({
            Environment, HomeDirectory: Root, Terminal: DetectTerminal(Environment)
        }))
            .resolves.toMatchObject({ Family: "Iosevka Term", Source: { _tag: "Configuration" } });
    });

    it("follows kitty include files", async () =>
    {
        const Root: string = await MakeTemporaryDirectory();
        const ConfigDirectory: string = Path.join(Root, "kitty");
        await mkdir(ConfigDirectory, { recursive: true });
        await writeFile(
            Path.join(ConfigDirectory, "kitty.conf"),
            "font_family monospace\ninclude local.conf\n"
        );
        await writeFile(Path.join(ConfigDirectory, "local.conf"), "font_family JetBrains Mono\n");
        const Environment: NodeJS.ProcessEnv = {
            KITTY_CONFIG_DIRECTORY: ConfigDirectory,
            KITTY_WINDOW_ID: "1"
        };

        await expect(QueryTerminalFont({
            Environment, HomeDirectory: Root, Terminal: DetectTerminal(Environment)
        }))
            .resolves.toMatchObject({ Family: "JetBrains Mono", Source: { _tag: "Configuration" } });
    });

    it("reads the configured Konsole profile", async () =>
    {
        const Root: string = await MakeTemporaryDirectory();
        const ConfigHome: string = Path.join(Root, "config");
        const DataHome: string = Path.join(Root, "data");
        await mkdir(Path.join(DataHome, "konsole"), { recursive: true });
        await mkdir(ConfigHome, { recursive: true });
        await writeFile(
            Path.join(ConfigHome, "konsolerc"),
            "[Desktop Entry]\nDefaultProfile=Shell.profile\n"
        );
        await writeFile(
            Path.join(DataHome, "konsole", "Shell.profile"),
            "[Appearance]\nFont=Hack,11,-1,5,50,0,0,0,0,0\n"
        );
        const Environment: NodeJS.ProcessEnv = {
            KONSOLE_VERSION: "260401",
            XDG_CONFIG_HOME: ConfigHome,
            XDG_DATA_HOME: DataHome
        };

        await expect(QueryTerminalFont({
            Environment, HomeDirectory: Root, Terminal: DetectTerminal(Environment)
        }))
            .resolves.toMatchObject({ Family: "Hack", Source: { _tag: "Configuration" } });
    });
});

async function MakeTemporaryDirectory(): Promise<string>
{
    const Directory: string = await mkdtemp(Path.join(tmpdir(), "ink-ui-support-"));
    TemporaryDirectories.push(Directory);
    return Directory;
}
