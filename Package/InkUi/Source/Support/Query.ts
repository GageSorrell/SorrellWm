/**
 * Active terminal capability queries.
 *
 * @module @sorrell/ink-ui/Support/Query
 *
 * @file      Query.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { DetectTerminal, GetPassiveSupport } from "./Detect.js";
import {
    MouseGranularity,
    type MouseSupport,
    type PixelSize,
    type RgbColor,
    type TerminalQueryOptions,
    type TerminalSupport
} from "./Types.js";

const QueryCache = new WeakMap<NodeJS.WriteStream, Promise<TerminalSupport>>();
const ModeNumbers = [ 1000, 1002, 1003, 1004, 1006, 1016, 2004, 2026 ] as const;

/**
 * Query the attached terminal and merge its replies with conservative
 * environment-based hints. This function never throws.
 */
export function QueryTerminalSupport(Options: TerminalQueryOptions = { }): Promise<TerminalSupport>
{
    const Stdin: NodeJS.ReadStream = Options.Stdin ?? process.stdin;
    const Stdout: NodeJS.WriteStream = Options.Stdout ?? process.stdout;
    const Environment: NodeJS.ProcessEnv = Options.Environment ?? process.env;

    if (Options.Refresh !== true && Options.Environment === undefined)
    {
        const Cached: Promise<TerminalSupport> | undefined = QueryCache.get(Stdout);
        if (Cached !== undefined) {return Cached;}
    }

    const Query: Promise<TerminalSupport> = QuerySupport(Stdin, Stdout, Environment, Options);
    if (Options.Refresh !== true && Options.Environment === undefined)
    {
        QueryCache.set(Stdout, Query);
    }
    return Query;
}

async function QuerySupport(
    Stdin: NodeJS.ReadStream,
    Stdout: NodeJS.WriteStream,
    Environment: NodeJS.ProcessEnv,
    Options: TerminalQueryOptions
): Promise<TerminalSupport>
{
    const Passive: TerminalSupport = GetPassiveSupport(Environment);
    if (!Stdin.isTTY || !Stdout.isTTY) {return Passive;}

    try
    {
        const Response: string = await CollectResponses(Stdin, Stdout, Options);
        return MergeResponse(Passive, Response, Stdout, Environment);
    }
    catch
    {
        return Passive;
    }
}

function CollectResponses(
    Stdin: NodeJS.ReadStream,
    Stdout: NodeJS.WriteStream,
    Options: TerminalQueryOptions
): Promise<string>
{
    /* eslint-disable-next-line @typescript-eslint/typedef */
    return new Promise((Resolve) =>
    {
        let Response: string = "";
        let Finished: boolean = false;
        let SettleTimeout: NodeJS.Timeout | undefined;
        let Timeout: NodeJS.Timeout;
        const WasRaw: boolean = Stdin.isRaw === true;
        const SetRawMode: ((Value: boolean) => void) | undefined = Options.SetRawMode
            ?? (typeof Stdin.setRawMode === "function" ? Stdin.setRawMode.bind(Stdin) : undefined);

        const Finish = (): void =>
        {
            if (Finished) {return;}
            Finished = true;
            clearTimeout(Timeout);
            if (SettleTimeout !== undefined)
            {
                clearTimeout(SettleTimeout);
            }
            Stdin.off("data", OnData);
            if (!WasRaw && SetRawMode !== undefined)
            {
                try { SetRawMode(false); }
                catch { /* The owning Ink tree may have unmounted. */ }
            }
            Resolve(Response);
        };

        const OnData = (Chunk: string | Buffer): void =>
        {
            Response += Buffer.isBuffer(Chunk) ? Chunk.toString() : Chunk;
            // Primary DA is the final query and acts as a response-order sentinel.
            // eslint-disable-next-line no-control-regex
            if (/\u001B\[\?\d+(?:;\d+)*c/.test(Response) && SettleTimeout === undefined)
            {
                SettleTimeout = setTimeout(Finish, 25);
                SettleTimeout.unref();
            }
        };

        try
        {
            if (!WasRaw && SetRawMode !== undefined) {SetRawMode(true);}
            Stdin.on("data", OnData);
            Timeout = setTimeout(Finish, Options.TimeoutMs ?? 750);
            Timeout.unref();

            const ModeQueries: string = ModeNumbers.map((Mode: number) => `\u001B[?${ Mode }$p`).join("");
            const KittyGraphicsQuery: string = "\u001B_Gi=31,s=1,v=1,a=q,t=d,f=24;AAAA\u001B\\";
            const TrueColorQuery: string = "\u001BP+q5463;524742\u001B\\";
            const ItermCellQuery: string = "\u001B]1337;ReportCellSize\u0007";
            Stdout.write(
                "\u001B]10;?\u001B\\\u001B]11;?\u001B\\\u001B[16t\u001B[14t\u001B[>q\u001B[?u" +
                ModeQueries +
                TrueColorQuery +
                ItermCellQuery +
                KittyGraphicsQuery +
                "\u001B[c"
            );
        }
        catch
        {
            Timeout = setTimeout(Finish, 0);
        }
    });
}

/* eslint-disable no-control-regex */
function MergeResponse(
    Passive: TerminalSupport,
    Response: string,
    Stdout: NodeJS.WriteStream,
    Environment: NodeJS.ProcessEnv
): TerminalSupport
{
    const VersionReport: string | undefined =
        MatchValue(Response, /\u001BP>\|([^\u001B\u0007]+)(?:\u001B\\|\u0007)/);

    const Terminal = DetectTerminal(Environment, VersionReport);
    const Modes: ReadonlyMap<number, boolean> = ParseModes(Response);
    const CellSizePixels: PixelSize | undefined = ParseCellSize(Response, Stdout);
    const BackgroundColor: RgbColor | undefined = ParseBackgroundColor(Response);
    const ForegroundColor: RgbColor | undefined = ParseDynamicColor(Response, 10);
    const Attributes: string | undefined = MatchValue(Response, /\u001B\[\?(\d+(?:;\d+)*)c/);
    const Sixel: boolean | undefined = Attributes === undefined
        ? Passive.Sixel
        : Attributes.split(";").includes("4");
    const KittyReply: RegExpMatchArray | null = Response.match(/\u001B_Gi=31;([^\u001B]*)(?:\u001B\\)/);
    const KittyGraphics: boolean | undefined = KittyReply === null
        ? (Attributes === undefined ? Passive.KittyGraphics : false)
        : KittyReply[1]?.startsWith("OK") === true;
    const TrueColorReply: boolean | undefined = ParseTrueColorReply(Response);
    const CellMouse: boolean | undefined = AnyMode(Modes, [ 1000, 1002, 1003 ]) ?? Passive.Mouse.Cell;
    const PixelMouse: boolean | undefined = Modes.get(1016) ?? Passive.Mouse.Pixel;
    const SgrMouse: boolean | undefined = Modes.get(1006) ?? Passive.Mouse.Sgr;
    const Mouse: MouseSupport = MakeMouseSupport(CellMouse, PixelMouse, SgrMouse);
    const KittyKeyboardReply: boolean | undefined = /\u001B\[\?\d+u/.test(Response) ? true : undefined;
    const ItermCellSize: boolean = /\u001B\]1337;ReportCellSize=/.test(Response);

    return {
        ...Passive,
        BackgroundColor,
        BracketedPaste: Modes.get(2004) ?? Passive.BracketedPaste,
        CellSizePixels,
        FocusEvents: Modes.get(1004) ?? Passive.FocusEvents,
        ForegroundColor,
        KittyGraphics,
        KittyKeyboard: KittyKeyboardReply ?? Passive.KittyKeyboard,
        Mouse,
        Sixel,
        SynchronizedOutput: Modes.get(2026) ?? Passive.SynchronizedOutput,
        Terminal: ItermCellSize && Terminal.Kind === "unknown"
            ? DetectTerminal({ ...Environment, TERM_PROGRAM: "iTerm.app" }, VersionReport)
            : Terminal,
        TrueColor: TrueColorReply ?? Passive.TrueColor,
        ColorDepth: TrueColorReply === true ? 24 : Passive.ColorDepth
    };
}

function ParseBackgroundColor(Response: string): RgbColor | undefined
{
    return ParseDynamicColor(Response, 11);
}

function ParseDynamicColor(Response: string, Slot: number): RgbColor | undefined
{
    const Pattern = new RegExp(
        `\\u001B\\]${ Slot };rgb:([\\da-f]{1,4})/([\\da-f]{1,4})/([\\da-f]{1,4})` +
        "(?:\\u0007|\\u001B\\\\)",
        "iu"
    );
    const Match: RegExpMatchArray | null = Response.match(Pattern);

    if (Match === null)
    {
        return undefined;
    }

    const Red: number | undefined = ScaleHexColor(Match[1]);
    const Green: number | undefined = ScaleHexColor(Match[2]);
    const Blue: number | undefined = ScaleHexColor(Match[3]);

    return Red === undefined || Green === undefined || Blue === undefined
        ? undefined
        : { Blue, Green, Red };
}

function ScaleHexColor(Value: string | undefined): number | undefined
{
    if (Value === undefined || Value.length === 0)
    {
        return undefined;
    }

    const Parsed: number = Number.parseInt(Value, 16);
    const Maximum: number = 16 ** Value.length - 1;

    return Number.isFinite(Parsed) ? Math.round(Parsed / Maximum * 255) : undefined;
}

function ParseModes(Response: string): ReadonlyMap<number, boolean>
{
    const Modes = new Map<number, boolean>();
    const Pattern: RegExp = /\u001B\[\?(\d+);(\d+)\$y/g;
    for (const Match of Response.matchAll(Pattern))
    {
        const Mode: number = Number(Match[1]);
        const Status: number = Number(Match[2]);
        if (Number.isFinite(Mode) && Number.isFinite(Status)) {Modes.set(Mode, Status !== 0);}
    }
    return Modes;
}

function ParseCellSize(Response: string, Stdout: NodeJS.WriteStream): PixelSize | undefined
{
    const CellMatch: RegExpMatchArray | null = Response.match(/\u001B\[6;(\d+);(\d+);?t/);
    let Height: number | undefined = PositiveNumber(CellMatch?.[1]);
    let Width: number | undefined = PositiveNumber(CellMatch?.[2]);
    const ItermMatch: RegExpMatchArray | null = Response.match(
        /\u001B\]1337;ReportCellSize=([\d.]+);([\d.]+)(?:;([\d.]+))?(?:\u0007|\u001B\\)/
    );

    if ((Height === undefined || Width === undefined) && ItermMatch !== null)
    {
        const Scale: number = PositiveNumber(ItermMatch[3]) ?? 1;
        Height = (PositiveNumber(ItermMatch[1]) ?? 0) * Scale;
        Width = (PositiveNumber(ItermMatch[2]) ?? 0) * Scale;
    }

    if (Height === undefined || Width === undefined || Height <= 0 || Width <= 0)
    {
        const WindowMatch: RegExpMatchArray | null = Response.match(/\u001B\[4;(\d+);(\d+);?t/);
        const WindowHeight: number | undefined = PositiveNumber(WindowMatch?.[1]);
        const WindowWidth: number | undefined = PositiveNumber(WindowMatch?.[2]);
        if (WindowHeight !== undefined && WindowWidth !== undefined
            && Stdout.rows !== undefined && Stdout.rows > 0
            && Stdout.columns !== undefined && Stdout.columns > 0)
        {
            Height = WindowHeight / Stdout.rows;
            Width = WindowWidth / Stdout.columns;
        }
    }

    return Height === undefined || Width === undefined || Height <= 0 || Width <= 0
        ? undefined
        : { Height, Width };
}

function ParseTrueColorReply(Response: string): boolean | undefined
{
    // XTGETTCAP returns 1+r for a recognized capability and 0+r otherwise.
    if (/\u001BP1\+r(?:5463|524742)(?:=|;|\u001B)/.test(Response)) {return true;}
    if (/\u001BP0\+r(?:5463|524742)(?:;|\u001B)/.test(Response)) {return false;}
    return undefined;
}

/* eslint-enable no-control-regex */
function MakeMouseSupport(
    Cell: boolean | undefined,
    Pixel: boolean | undefined,
    Sgr: boolean | undefined
): MouseSupport
{
    const Supported: boolean | undefined = Cell === true || Pixel === true
        ? true
        : (Cell === false && Pixel === false ? false : undefined);
    const Granularity = Pixel === true && Cell === true
        ? MouseGranularity.Both()
        : (Pixel === true
            ? MouseGranularity.Pixel()
            : (Cell === true
                ? MouseGranularity.Cell()
                : (Supported === false ? MouseGranularity.None() : MouseGranularity.Unknown())));
    return { Cell, Granularity, Pixel, Sgr, Supported };
}

function AnyMode(Modes: ReadonlyMap<number, boolean>, Values: ReadonlyArray<number>): boolean | undefined
{
    const Answers: ReadonlyArray<boolean | undefined> = Values.map((Value: number) => Modes.get(Value));
    if (Answers.includes(true)) {return true;}
    if (Answers.every((Value: boolean | undefined) => Value === false)) {return false;}
    return undefined;
}

function MatchValue(Value: string, Pattern: RegExp): string | undefined
{
    return Value.match(Pattern)?.[1];
}

function PositiveNumber(Value: string | undefined): number | undefined
{
    if (Value === undefined) {return undefined;}
    const Result: number = Number(Value);
    return Number.isFinite(Result) && Result > 0 ? Result : undefined;
}
