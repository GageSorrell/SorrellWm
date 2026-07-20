/**
 * @file      CodeEditorAnimation.Internal.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import {
    type BundledLanguage,
    type BundledTheme,
    type Highlighter,
    type ThemeRegistration,
    type ThemedToken,
    type TokensResult,
    createHighlighter
} from "shiki";
import {
    ClampNumber,
    GetNormalizedCursorPosition,
    GetValidatedInsertionPosition,
    GetValidatedLineInsertionIndex
} from "./Math.Internal";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type {
    FBuildCodeLinesOptions,
    FBuildCodeSnapshotsOptions,
    FCodeChange,
    FCodeSnapshot,
    FIntellisenseContent,
    PCodeCard,
    PIntellisenseWindow
} from "./CodeEditor.Internal.Types";
import type { FCodeLine, FCodeToken, PCursor } from "./Component.Internal.Types";
import { type ReactNode, useCallback } from "react";
import { CodeLine } from "./Component.Internal";
import type { FCursorPosition } from "./CodeEditor.Types";
import { GetChangeIntellisense } from "./Intellisense.Internal";
import GitHubDarkDefaultTheme from "@shikijs/themes/github-dark-default";
import GitHubLightDefaultTheme from "@shikijs/themes/github-light-default";
import { OperatorMonoLigFontFamily } from "../../app/Font";
import { Tokens } from "./Tokens";
import { UseTheme } from "@sorrell/react/client";

function UseCodeTheme(): readonly [ BundledTheme ]
{
    const { Theme } = UseTheme();

    const CodeTheme: BundledTheme = Theme === "Dark"
        ? "github-dark-default"
        : "github-light-default";

    return [ CodeTheme ] as const;
}

function UseCodeBackground(): readonly [ string ]
{
    const { Theme } = UseTheme();

    const Background: string = Theme === "Dark"
        ? (GitHubDarkDefaultTheme.bg ?? "#0D1117")
        : (GitHubLightDefaultTheme.bg ?? "#F8F8F8");

    return [ Background ] as const;
}

let CodeHighlighterPromise: Promise<Highlighter> | undefined;

function UseCodeHighlighter(): readonly [ Promise<Highlighter> ]
{
    const [ CodeTheme ] = UseCodeTheme();

    if (CodeHighlighterPromise === undefined)
    {
        CodeHighlighterPromise = createHighlighter({
            langs: [ "tsx", "typescript", "javascript" ],
            themes: [ CodeTheme ]
        });
    }

    return [ CodeHighlighterPromise ] as const;
}

function AddTextToCode(
    Code: string,
    Position: FCursorPosition,
    TextToAdd: string
): string
{
    const CodeLines: Array<string> = Code.split("\n");

    const [ LineIndex, ColumnIndex ] = Position;

    const LineText: string = CodeLines[LineIndex] ?? "";

    CodeLines[LineIndex] =
        LineText.slice(0, ColumnIndex)
        + TextToAdd
        + LineText.slice(ColumnIndex);

    return CodeLines.join("\n");
}

function AddLineToCode(
    Code: string,
    LineIndex: number,
    LineText: string = ""
): string
{
    const CodeLines: Array<string> = Code.split("\n");

    CodeLines.splice(
        LineIndex,
        0,
        LineText
    );

    return CodeLines.join("\n");
}

function GetCursorPositionAfterAddedLine(
    LineIndex: number,
    LineText: string = ""
): FCursorPosition
{
    return [
        LineIndex,
        LineText.length
    ];
}

function GetInitialCursorPositionForChange(
    Change: FCodeChangeResolved | undefined
): FCursorPosition | undefined
{
    if (Change === undefined)
    {
        return undefined;
    }

    switch (Change.Type)
    {
        case "Add":
            return Change.Position;

        case "AddLine":
            return [ Change.LineIndex, 0 ];
    }
}

function GetCursorPositionAfterAddedText(
    Position: FCursorPosition,
    AddedText: string
): FCursorPosition
{
    const AddedLines: Array<string> = AddedText.split("\n");

    if (AddedLines.length === 1)
    {
        return [
            Position[0],
            Position[1] + AddedText.length
        ];
    }

    return [
        Position[0] + AddedLines.length - 1,
        AddedLines[AddedLines.length - 1]?.length ?? 0
    ];
}

function GetDisplayedSnapshot(
    Frame: number,
    Fps: number,
    InitialCode: string,
    Changes: ReadonlyArray<FCodeChange>,
    Snapshots: ReadonlyArray<FCodeSnapshot>,
    CursorPosition: FCursorPosition | undefined
): FCodeSnapshot
{
    if (Snapshots.length === 0)
    {
        return {
            Code: InitialCode,
            CursorPosition,
            Lines: [ ]
        };
    }

    const SnapshotIndex: number = GetSnapshotIndex(
        Frame,
        Fps,
        Changes,
        Snapshots
    );

    return Snapshots[SnapshotIndex] ?? Snapshots[0];
}

function Cursor({
    Code,
    CursorOpacity,
    CursorPosition
}: PCursor): ReactNode
{
    const Frame: number = useCurrentFrame();

    // @TODO Here *et al. (?)*: Use new context to get current line index and "End"
    // position value, if `CursorPosition` uses either of those.

    const [ LineIndex, ColumnIndex ] = GetNormalizedCursorPosition(
        Code,
        CursorPosition
    );

    const BreathingProgress: number = (Math.sin(Frame / 14) + 1) / 2;

    const BreathingOpacity: number = interpolate(
        BreathingProgress,
        [ 0, 1 ],
        [ 1, 0 ],
        {
            easing: Easing.sin,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp"
        }
    );

    const { Theme } = UseTheme();

    return (
        <div
            style={ {
                backgroundColor: Theme === "Dark"
                    ? "#AEAFAD"
                    : "#000000",
                borderRadius: 0,
                boxShadow: `0 0 ${ 10 + BreathingProgress * 16 }px rgba(255, 255, 255, 0.24)`,
                height: Tokens.CodeLineHeight,
                left: `${ ColumnIndex }ch`,
                opacity: CursorOpacity * BreathingOpacity,
                position: "absolute",
                top: LineIndex * Tokens.CodeLineHeight,
                width: "0.62em"
            } }
        />
    );
}

function RenderIntellisenseContent(
    Intellisense: FIntellisenseContent
): ReactNode
{
    if (typeof Intellisense === "function")
    {
        /* eslint-disable-next-line @typescript-eslint/typedef */
        const IntellisenseComponent = Intellisense;

        return <IntellisenseComponent />;
    }

    return Intellisense;
}

export function IntellisenseWindow({
    Code,
    CursorPosition,
    Intellisense,
    Opacity
}: PIntellisenseWindow): ReactNode
{
    const [ LineIndex, ColumnIndex ] = GetNormalizedCursorPosition(
        Code,
        CursorPosition
    );

    const { Theme } = UseTheme();

    const EditorTheme: ThemeRegistration = Theme ===  "Dark"
        ? GitHubDarkDefaultTheme
        : GitHubLightDefaultTheme;

    return (
        <div
            style={ {
                background: EditorTheme.colors?.["editorWidget.background"],
                borderColor: EditorTheme.colors?.["editorSuggestWidget.border"],
                borderRadius: 16,
                borderStyle: "solid",
                borderWidth: "1px",
                boxShadow:
                [
                    "0 18px 24px rgba(0, 0, 0, 0.24)",
                    "0 4px 8px rgba(0, 0, 0, 0.18)"
                ].join(", "),
                color: EditorTheme.colors?.["panelTitle.activeForeground"],
                left: `clamp(0px, ${ ColumnIndex }ch, calc(100% - ${ Tokens.IntellisenseWindowWidth }px))`,
                maxWidth: "100%",
                opacity: Opacity,
                overflow: "hidden",
                position: "absolute",
                top: ((LineIndex + 1) * Tokens.CodeLineHeight) + Tokens.IntellisenseWindowOffsetY,
                width: Tokens.IntellisenseWindowWidth,
                zIndex: 4
            } }>
            { RenderIntellisenseContent(Intellisense) }
        </div>
    );
}

export function CodeCard({
    Changes,
    CursorPosition,
    InitialCode,
    Snapshots
}: PCodeCard): ReactNode
{
    const Frame: number = useCurrentFrame();
    const { fps: Fps } = useVideoConfig();

    const DisplayedSnapshot: FCodeSnapshot = GetDisplayedSnapshot(
        Frame,
        Fps,
        InitialCode,
        Changes,
        Snapshots,
        CursorPosition
    );

    const DisplayedIntellisense: FIntellisenseContent | undefined =
        DisplayedSnapshot.Intellisense;

    const DisplayedCursorPosition: FCursorPosition | undefined =
        DisplayedSnapshot.CursorPosition ?? CursorPosition;

    const CardEntrance: number = spring({
        config:
        {
            damping: 22,
            mass: 0.7,
            stiffness: 90
        },
        fps: Fps,
        frame: Frame
    });

    const CodeOpacity: number = interpolate(
        Frame,
        [ Tokens.CodeFadeStartFrame, Tokens.CodeFadeEndFrame ],
        [ 0, 1 ],
        {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp"
        }
    );

    const CodeTranslateY: number = interpolate(
        Frame,
        [ Tokens.CodeFadeStartFrame, Tokens.CodeFadeEndFrame ],
        [ 14, 0 ],
        {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp"
        }
    );

    const [ CodeBackground ] = UseCodeBackground();

    return (
        <div
            style={ {
                background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                borderRadius: 70,
                boxShadow: "0 12px 48px rgba(0, 0, 0, 0.45)",
                inset: 64,
                opacity: CardEntrance,
                padding: 16,
                position: "absolute",
                transform: `scale(${ interpolate(CardEntrance, [ 0, 1 ], [ 0.985, 1 ]) })`,
                userSelect: "none"
            } }>
            <div
                style={ {
                    background:
                    [
                        "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08), transparent 38%)",
                        "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                        CodeBackground
                    ].join(", "),
                    border: "1px solid rgba(255, 255, 255, 0.16)",
                    borderRadius: 54,
                    inset: 18,
                    overflow: "hidden",
                    position: "absolute"
                } }>
                <div
                    style={ {
                        background: CodeBackground,
                        inset: 0,
                        position: "absolute"
                    } }
                />

                <div
                    style={ {
                        color: Tokens.CodeDefaultTextColor,
                        fontFamily: OperatorMonoLigFontFamily,
                        fontSize: Tokens.CodeFontSize,
                        height: 620,
                        left: 136,
                        lineHeight: `${ Tokens.CodeLineHeight }px`,
                        opacity: CodeOpacity,
                        position: "absolute",
                        top: 150,
                        transform: `translateY(${ CodeTranslateY }px)`,
                        width: Tokens.CodeAreaWidth
                    } }>
                    { DisplayedSnapshot.Lines.map((Line: FCodeLine, Index: number): ReactNode =>
                    {
                        return (
                            <CodeLine
                                Index={ Index }
                                Line={ Line }
                                key={ Line.Key }
                            />
                        );
                    }) }

                    { DisplayedCursorPosition === undefined
                        ? null
                        : (
                            <Cursor
                                Code={ DisplayedSnapshot.Code }
                                CursorOpacity={ CodeOpacity }
                                CursorPosition={ DisplayedCursorPosition }
                            />
                        )
                    }

                    { DisplayedCursorPosition === undefined || DisplayedIntellisense === undefined
                        ? null
                        : (
                            <RenderIntellisenseWindow
                                Code={ DisplayedSnapshot.Code }
                                CursorPosition={ DisplayedCursorPosition }
                                Intellisense={ DisplayedIntellisense }
                                Opacity={ CodeOpacity }
                            />
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export function UseBuildCodeLines(
): readonly [ (Code: string, Options: FBuildCodeLinesOptions) => Promise<Array<FCodeLine>> ]
{
    const [ Highlighter ] = UseCodeHighlighter();

    const [ CodeTheme ] = UseCodeTheme();

    /* eslint-disable-next-line @typescript-eslint/typedef */
    const BuildCodeLinesCallback = useCallback(async function(
        Code: string,
        Options: FBuildCodeLinesOptions
    ): Promise<Array<FCodeLine>>
    {
        return BuildCodeLines(Code, Options, Highlighter, CodeTheme);
    }, [ Highlighter, CodeTheme ]);

    return [ BuildCodeLinesCallback ] as const;
}

export function UseBuildCodeSnapshots(
): readonly [
    (
        InitialCode: string,
        Changes: ReadonlyArray<FCodeChangeResolved>,
        Options: FBuildCodeSnapshotsOptions
    ) => Promise<Array<FCodeSnapshot>>
]
{
    const [ BuildCodeLines ] = UseBuildCodeLines();

    /* eslint-disable-next-line @typescript-eslint/typedef */
    const BuildCodeSnapshotsCallback = useCallback(async function(
        InitialCode: string,
        Changes: ReadonlyArray<FCodeChangeResolved>,
        Options: FBuildCodeSnapshotsOptions
    ): Promise<Array<FCodeSnapshot>>
    {
        return BuildCodeSnapshots(
            InitialCode,
            Changes,
            Options,
            BuildCodeLines
        );
    }, [ BuildCodeLines ]);

    return [ BuildCodeSnapshotsCallback ] as const;
}

async function BuildCodeSnapshots(
    InitialCode: string,
    Changes: ReadonlyArray<FCodeChangeResolved>,
    Options: FBuildCodeSnapshotsOptions,
    BuildCodeLines: (Code: string, Options: FBuildCodeLinesOptions) => Promise<Array<FCodeLine>>
): Promise<Array<FCodeSnapshot>>
{
    const Snapshots: Array<FCodeSnapshot> = [ ];

    let CurrentCode: string = InitialCode;
    let CurrentIntellisense: FIntellisenseContent | undefined = Options.InitialIntellisense;
    let SnapshotIndex: number = 0;

    const FirstChange: FCodeChangeResolved | undefined = Changes[0];

    Snapshots.push({
        Code: CurrentCode,
        CursorPosition: GetInitialCursorPositionForChange(FirstChange)
            ?? Options.InitialCursorPosition,
        Intellisense: CurrentIntellisense,
        Lines: await BuildCodeLines(
            CurrentCode,
            {
                BaseKey: `${ Options.BaseKey }-${ SnapshotIndex }`,
                Language: Options.Language
            }
        )
    });

    SnapshotIndex++;

    for (const Change of Changes)
    {
        switch (Change.Type)
        {
            case "Add":
            {
                const InsertionPosition: FCursorPosition = GetValidatedInsertionPosition(
                    CurrentCode,
                    Change.Position
                );

                const ChangeIntellisense: FIntellisenseContent | undefined =
                    GetChangeIntellisense(
                        Change,
                        CurrentIntellisense
                    );

                for (
                    let CharacterCount: number = 1;
                    CharacterCount <= Change.Text.length;
                    CharacterCount++
                )
                {
                    const AddedText: string = Change.Text.slice(0, CharacterCount);

                    const NextCode: string = AddTextToCode(
                        CurrentCode,
                        InsertionPosition,
                        AddedText
                    );

                    Snapshots.push({
                        Code: NextCode,
                        CursorPosition: GetCursorPositionAfterAddedText(
                            InsertionPosition,
                            AddedText
                        ),
                        Intellisense: ChangeIntellisense,
                        Lines: await BuildCodeLines(
                            NextCode,
                            {
                                BaseKey: `${ Options.BaseKey }-${ SnapshotIndex }`,
                                Language: Options.Language
                            }
                        )
                    });

                    SnapshotIndex++;
                }

                CurrentCode = AddTextToCode(
                    CurrentCode,
                    InsertionPosition,
                    Change.Text
                );

                CurrentIntellisense = ChangeIntellisense;

                break;
            }

            case "AddLine":
            {
                const LineIndex: number = GetValidatedLineInsertionIndex(
                    CurrentCode,
                    Change.LineIndex
                );

                const ChangeIntellisense: FIntellisenseContent | undefined =
                    GetChangeIntellisense(
                        Change,
                        CurrentIntellisense
                    );

                const NextCode: string = AddLineToCode(
                    CurrentCode,
                    LineIndex,
                    Change.Text
                );

                Snapshots.push({
                    Code: NextCode,
                    CursorPosition: GetCursorPositionAfterAddedLine(
                        LineIndex,
                        Change.Text
                    ),
                    Intellisense: ChangeIntellisense,
                    Lines: await BuildCodeLines(
                        NextCode,
                        {
                            BaseKey: `${ Options.BaseKey }-${ SnapshotIndex }`,
                            Language: Options.Language
                        }
                    )
                });

                SnapshotIndex++;

                CurrentCode = NextCode;
                CurrentIntellisense = ChangeIntellisense;

                break;
            }
        }
    }

    return Snapshots;
}

function GetNormalizedSpeedScalar(SpeedScalar: number | undefined): number
{
    if (
        SpeedScalar === undefined
        || Number.isFinite(SpeedScalar) === false
        || SpeedScalar <= 0
    )
    {
        return 1;
    }

    return SpeedScalar;
}

function GetFramesPerSnapshot(
    Change: FCodeChangeResolved
): number
{
    const SpeedScalar: number = GetNormalizedSpeedScalar(Change.SpeedScalar);

    return Tokens.FramesPerAddedCharacter / SpeedScalar;
}

function GetChangeFrameCount(
    Change: FCodeChangeResolved
): number
{
    switch (Change.Type)
    {
        case "Add":
            return Math.ceil(Change.Text.length * GetFramesPerSnapshot(Change));
        case "AddLine":
            return Math.ceil(GetFramesPerSnapshot(Change));
        case "Pause":
            return 0;
    }
}

function GetAppliedSnapshotCount(
    Frame: number,
    ChangeStartFrame: number,
    Change: FCodeChangeResolved
): number
{
    switch (Change.Type)
    {
        case "Add":
        {
            const FramesPerSnapshot: number = GetFramesPerSnapshot(Change);

            return ClampNumber(
                Math.floor((Frame - ChangeStartFrame) / FramesPerSnapshot),
                0,
                Change.Text.length
            );
        }
        case "AddLine":
        {
            const FramesPerSnapshot: number = GetFramesPerSnapshot(Change);

            return ClampNumber(
                Math.floor((Frame - ChangeStartFrame) / FramesPerSnapshot),
                0,
                1
            );
        }
        case "Pause":
            return 0;
    }
}

function GetChangeSnapshotCount(
    Change: FCodeChangeResolved
): number
{
    switch (Change.Type)
    {
        case "Add":
            return Change.Text.length;
        case "AddLine":
            return 1;
        case "Pause":
            return 0;
    }
}

function GetDelayFrameCount(
    DelayInMilliseconds: number | undefined,
    Fps: number
): number
{
    if (
        DelayInMilliseconds === undefined
        || Number.isFinite(DelayInMilliseconds) === false
        || DelayInMilliseconds <= 0
    )
    {
        return 0;
    }

    return Math.ceil((DelayInMilliseconds / 1000) * Fps);
}

function GetSnapshotIndex(
    Frame: number,
    Fps: number,
    Changes: ReadonlyArray<FCodeChangeResolved>,
    Snapshots: ReadonlyArray<FCodeSnapshot>
): number
{
    let CurrentFrame: number = Tokens.ChangeStartFrame;
    let SnapshotIndex: number = 0;

    for (
        let ChangeIndex: number = 0;
        ChangeIndex < Changes.length;
        ChangeIndex++
    )
    {
        const Change: FCodeChangeResolved = Changes[ChangeIndex];

        const ChangeFrameCount: number = GetChangeFrameCount(Change);
        const ChangeEndFrame: number = CurrentFrame + ChangeFrameCount;

        if (Frame < ChangeEndFrame)
        {
            // const AddedCharacterCount: number = GetAddedCharacterCount(
            //     Frame,
            //     CurrentFrame,
            //     Change
            // );

            // return ClampNumber(
            //     SnapshotIndex + AddedCharacterCount,
            //     0,
            //     Math.max(0, Snapshots.length - 1)
            // );
            const AppliedSnapshotCount: number = GetAppliedSnapshotCount(
                Frame,
                CurrentFrame,
                Change
            );

            return ClampNumber(
                SnapshotIndex + AppliedSnapshotCount,
                0,
                Math.max(0, Snapshots.length - 1)
            );
        }

        SnapshotIndex += GetChangeSnapshotCount(Change);
        CurrentFrame = ChangeEndFrame;

        if (ChangeIndex < Changes.length - 1)
        {
            // const DelayFrameCount: number = GetDelayFrameCount(
            //     Change.Delay,
            //     Fps
            // );

            const DelayFrameCount: number = "Duration" in Change
                ? GetDelayFrameCount(
                    Change.Duration,
                    Fps
                )
                : 0;

            const DelayEndFrame: number = CurrentFrame + DelayFrameCount;

            if (Frame < DelayEndFrame)
            {
                return ClampNumber(
                    SnapshotIndex,
                    0,
                    Math.max(0, Snapshots.length - 1)
                );
            }

            CurrentFrame = DelayEndFrame;
        }
    }

    return ClampNumber(
        SnapshotIndex,
        0,
        Math.max(0, Snapshots.length - 1)
    );
}

async function BuildCodeLines(
    Code: string,
    Options: FBuildCodeLinesOptions,
    InHighlighter: Promise<Highlighter>,
    CodeTheme: BundledTheme
): Promise<Array<FCodeLine>>
{
    const Language: BundledLanguage = Options.Language ?? "tsx";

    const RawLines: Array<string> = Code.split("\n");
    const HighlightedCode: string = Code.length === 0
        ? " "
        : Code;

    const Highlighter: Highlighter = await InHighlighter;

    const Result: TokensResult = Highlighter.codeToTokens(
        HighlightedCode,
        {
            lang: Language,
            theme: CodeTheme
        }
    );

    return RawLines.map((RawLineText: string, LineIndex: number): FCodeLine =>
    {
        const LineTokens: Array<ThemedToken> = Result.tokens[LineIndex] ?? [ ];

        const Tokens: Array<FCodeToken> = LineTokens.length === 0
            ? [
                {
                    Text: RawLineText
                }
            ]
            : LineTokens.map((LineToken: ThemedToken): FCodeToken =>
            {
                return {
                    Color: LineToken.color,
                    Text: LineToken.content
                };
            });

        return {
            Key: `${ Options.BaseKey }-${ LineIndex }`,
            Text: RawLineText,
            Tokens
        };
    });
}
