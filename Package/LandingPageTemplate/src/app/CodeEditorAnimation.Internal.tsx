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
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type {
    FBuildCodeLinesOptions,
    FBuildCodeSnapshotsOptions,
    FCodeChange,
    FCodeLine,
    FCodeSnapshot,
    FCodeToken,
    FIntellisenseContent,
    PCodeCard,
    PRenderCodeLine,
    PRenderCursor,
    PRenderIntellisenseWindow,
    PToken
} from "./CodeEditorAnimation.Internal.Types";
import { type ReactNode, useCallback } from "react";
import type { FCursorPosition } from "./CodeEditorAnimation.Types";
import GitHubDarkDefaultTheme from "@shikijs/themes/github-dark-default";
import GitHubLightDefaultTheme from "@shikijs/themes/github-light-default";
import { OperatorMonoLigFontFamily } from "./Font";
import { UseTheme } from "@sorrell/react/client";

const CodeLineHeight: number = 48;
const CodeFontSize: number = 35;
const CodeFadeStartFrame: number = 12;
const CodeFadeEndFrame: number = 42;
const CodeDefaultTextColor: string = "#d5d9e2";
const ChangeStartFrame: number = 58;
const FramesPerAddedCharacter: number = 3;
const CodeAreaWidth: number = 1200;
const IntellisenseWindowWidth: number = 720;
const IntellisenseWindowOffsetY: number = 8;

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

function Token({ TokenValue }: PToken): ReactNode
{
    return (
        <span
            style={ {
                color: TokenValue.Color ?? CodeDefaultTextColor
            } }>
            { TokenValue.Text }
        </span>
    );
}

function RenderCodeLine({ Index, Line }: PRenderCodeLine): ReactNode
{
    function TransformLineToken(TokenValue: FCodeToken, TokenIndex: number): ReactNode
    {
        return (
            <Token
                TokenValue={ TokenValue }
                key={ `${ Line.Key }-${ TokenIndex }` }
            />
        );
    }

    return (
        <div
            style={ {
                height: CodeLineHeight,
                left: 0,
                position: "absolute",
                top: Index * CodeLineHeight,
                whiteSpace: "pre"
            } }>
            { Line.Tokens.map(TransformLineToken) }
        </div>
    );
}

function ClampNumber(
    Value: number,
    Minimum: number,
    Maximum: number
): number
{
    return Math.max(Minimum, Math.min(Maximum, Value));
}

function GetNormalizedCursorPosition(
    Code: string,
    CursorPosition: FCursorPosition
): FCursorPosition
{
    const RawLines: Array<string> = Code.split("\n");

    const RequestedLineIndex: number = Math.trunc(CursorPosition[0]);
    const LineIndex: number = ClampNumber(
        RequestedLineIndex,
        0,
        Math.max(0, RawLines.length - 1)
    );

    const RawLine: string = RawLines[LineIndex] ?? "";
    const RequestedColumnIndex: number = Math.trunc(CursorPosition[1]);
    const ColumnIndex: number = ClampNumber(
        RequestedColumnIndex,
        0,
        RawLine.length
    );

    return [ LineIndex, ColumnIndex ];
}

function GetValidatedInsertionPosition(
    Code: string,
    Position: FCursorPosition
): FCursorPosition
{
    const CodeLines: Array<string> = Code.split("\n");

    const LineIndex: number = Math.trunc(Position[0]);
    const ColumnIndex: number = Math.trunc(Position[1]);

    if (LineIndex < 0 || LineIndex > CodeLines.length)
    {
        throw new RangeError(`The insertion line ${ LineIndex } does not exist.`);
    }

    const LineText: string = CodeLines[LineIndex] ?? "";

    if (ColumnIndex < 0 || ColumnIndex > LineText.length)
    {
        throw new RangeError(`The insertion position ${ ColumnIndex } is outside line ${ LineIndex }.`);
    }

    return [ LineIndex, ColumnIndex ];
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

function GetValidatedLineInsertionIndex(
    Code: string,
    LineIndex: number
): number
{
    const CodeLines: Array<string> = Code.split("\n");
    const NormalizedLineIndex: number = Math.trunc(LineIndex);

    if (
        NormalizedLineIndex < 0
        || NormalizedLineIndex > CodeLines.length
    )
    {
        throw new RangeError(`The line insertion index ${ NormalizedLineIndex } is outside the code.`);
    }

    return NormalizedLineIndex;
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
    Change: FCodeChange | undefined
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

function GetChangeIntellisense(
    Change: FCodeChange,
    CurrentIntellisense: FIntellisenseContent | undefined
): FIntellisenseContent | undefined
{
    return Change.Intellisense === undefined
        ? CurrentIntellisense
        : Change.Intellisense;
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

function RenderCursor({
    Code,
    CursorOpacity,
    CursorPosition
}: PRenderCursor): ReactNode
{
    const Frame: number = useCurrentFrame();

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
                height: CodeLineHeight,
                left: `${ ColumnIndex }ch`,
                opacity: CursorOpacity * BreathingOpacity,
                position: "absolute",
                top: LineIndex * CodeLineHeight,
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

function RenderIntellisenseWindow({
    Code,
    CursorPosition,
    Intellisense,
    Opacity
}: PRenderIntellisenseWindow): ReactNode
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
                // color: EditorTheme.colors?.["editorSuggestWidget.foreground"],
                color: EditorTheme.colors?.["panelTitle.activeForeground"],
                left: `clamp(0px, ${ ColumnIndex }ch, calc(100% - ${ IntellisenseWindowWidth }px))`,
                maxWidth: "100%",
                opacity: Opacity,
                overflow: "hidden",
                position: "absolute",
                top: ((LineIndex + 1) * CodeLineHeight) + IntellisenseWindowOffsetY,
                width: IntellisenseWindowWidth,
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
        [ CodeFadeStartFrame, CodeFadeEndFrame ],
        [ 0, 1 ],
        {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp"
        }
    );

    const CodeTranslateY: number = interpolate(
        Frame,
        [ CodeFadeStartFrame, CodeFadeEndFrame ],
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
                transform: `scale(${ interpolate(CardEntrance, [ 0, 1 ], [ 0.985, 1 ]) })`
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
                        color: CodeDefaultTextColor,
                        fontFamily: OperatorMonoLigFontFamily,
                        fontSize: CodeFontSize,
                        height: 620,
                        left: 136,
                        lineHeight: `${ CodeLineHeight }px`,
                        opacity: CodeOpacity,
                        position: "absolute",
                        top: 150,
                        transform: `translateY(${ CodeTranslateY }px)`,
                        width: CodeAreaWidth
                    } }>
                    { DisplayedSnapshot.Lines.map((Line: FCodeLine, Index: number): ReactNode =>
                    {
                        return (
                            <RenderCodeLine
                                Index={ Index }
                                Line={ Line }
                                key={ Line.Key }
                            />
                        );
                    }) }

                    { DisplayedCursorPosition === undefined
                        ? null
                        : (
                            <RenderCursor
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
        Changes: ReadonlyArray<FCodeChange>,
        Options: FBuildCodeSnapshotsOptions
    ) => Promise<Array<FCodeSnapshot>>
]
{
    const [ BuildCodeLines ] = UseBuildCodeLines();

    /* eslint-disable-next-line @typescript-eslint/typedef */
    const BuildCodeSnapshotsCallback = useCallback(async function(
        InitialCode: string,
        Changes: ReadonlyArray<FCodeChange>,
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
    Changes: ReadonlyArray<FCodeChange>,
    Options: FBuildCodeSnapshotsOptions,
    BuildCodeLines: (Code: string, Options: FBuildCodeLinesOptions) => Promise<Array<FCodeLine>>
): Promise<Array<FCodeSnapshot>>
{
    const Snapshots: Array<FCodeSnapshot> = [ ];

    let CurrentCode: string = InitialCode;
    let CurrentIntellisense: FIntellisenseContent | undefined = Options.InitialIntellisense;
    let SnapshotIndex: number = 0;

    const FirstChange: FCodeChange | undefined = Changes[0];

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

    // for (const Change of Changes)
    // {
    //     switch (Change.Type)
    //     {
    //         case "Add":
    //         {
    //             const InsertionPosition: FCursorPosition = GetValidatedInsertionPosition(
    //                 CurrentCode,
    //                 Change.Position
    //             );

    //             const ChangeIntellisense: FIntellisenseContent | undefined =
    //                 Change.Intellisense === undefined
    //                     ? CurrentIntellisense
    //                     : Change.Intellisense;

    //             for (
    //                 let CharacterCount: number = 1;
    //                 CharacterCount <= Change.Text.length;
    //                 CharacterCount++
    //             )
    //             {
    //                 const AddedText: string = Change.Text.slice(0, CharacterCount);

    //                 const NextCode: string = AddTextToCode(
    //                     CurrentCode,
    //                     InsertionPosition,
    //                     AddedText
    //                 );

    //                 Snapshots.push({
    //                     Code: NextCode,
    //                     CursorPosition: GetCursorPositionAfterAddedText(
    //                         InsertionPosition,
    //                         AddedText
    //                     ),
    //                     Intellisense: ChangeIntellisense,
    //                     Lines: await BuildCodeLines(
    //                         NextCode,
    //                         {
    //                             BaseKey: `${ Options.BaseKey }-${ SnapshotIndex }`,
    //                             Language: Options.Language
    //                         }
    //                     )
    //                 });

    //                 SnapshotIndex++;
    //             }

    //             CurrentCode = AddTextToCode(
    //                 CurrentCode,
    //                 InsertionPosition,
    //                 Change.Text
    //             );

    //             CurrentIntellisense = ChangeIntellisense;

    //             break;
    //         }
    //     }
    // }

    return Snapshots;
}

// function GetDelayFrameCount(
//     DelayInMilliseconds: number | undefined,
//     Fps: number
// ): number
// {
//     if (
//         DelayInMilliseconds === undefined
//         || Number.isFinite(DelayInMilliseconds) === false
//         || DelayInMilliseconds <= 0
//     )
//     {
//         return 0;
//     }

//     return Math.ceil((DelayInMilliseconds / 1000) * Fps);
// }

function GetNormalizedSpeedScalar(
    SpeedScalar: number | undefined
): number
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

// function GetFramesPerAddedCharacter(
//     Change: FCodeChange
// ): number
// {
//     const SpeedScalar: number = GetNormalizedSpeedScalar(Change.SpeedScalar);

//     return FramesPerAddedCharacter / SpeedScalar;
// }

function GetFramesPerSnapshot(
    Change: FCodeChange
): number
{
    const SpeedScalar: number = GetNormalizedSpeedScalar(Change.SpeedScalar);

    return FramesPerAddedCharacter / SpeedScalar;
}

function GetChangeFrameCount(
    Change: FCodeChange
): number
{
    switch (Change.Type)
    {
        case "Add":
            return Math.ceil(Change.Text.length * GetFramesPerSnapshot(Change));

        case "AddLine":
            return Math.ceil(GetFramesPerSnapshot(Change));
    }
}

function GetAppliedSnapshotCount(
    Frame: number,
    ChangeStartFrame: number,
    Change: FCodeChange
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
    }
}

function GetChangeSnapshotCount(
    Change: FCodeChange
): number
{
    switch (Change.Type)
    {
        case "Add":
            return Change.Text.length;

        case "AddLine":
            return 1;
    }
}

// function GetChangeFrameCount(
//     Change: FCodeChange
// ): number
// {
//     switch (Change.Type)
//     {
//         case "Add":
//             return Math.ceil(Change.Text.length * GetFramesPerAddedCharacter(Change));
//     }
// }

// function GetAddedCharacterCount(
//     Frame: number,
//     ChangeStartFrame: number,
//     Change: FCodeChange
// ): number
// {
//     switch (Change.Type)
//     {
//         case "Add":
//         {
//             const FramesPerCharacter: number = GetFramesPerAddedCharacter(Change);

//             return ClampNumber(
//                 Math.floor((Frame - ChangeStartFrame) / FramesPerCharacter),
//                 0,
//                 Change.Text.length
//             );
//         }
//     }
// }

// function GetChangeSnapshotCount(
//     Change: FCodeChange
// ): number
// {
//     switch (Change.Type)
//     {
//         case "Add":
//             return Change.Text.length;
//     }
// }

// function GetSnapshotIndex(
//     Frame: number,
//     Fps: number,
//     Changes: ReadonlyArray<FCodeChange>,
//     Snapshots: ReadonlyArray<FCodeSnapshot>
// ): number
// {
//     let CurrentFrame: number = ChangeStartFrame;
//     let SnapshotIndex: number = 0;

//     for (
//         let ChangeIndex: number = 0;
//         ChangeIndex < Changes.length;
//         ChangeIndex++
//     )
//     {
//         const Change: FCodeChange = Changes[ChangeIndex];

//         const ChangeFrameCount: number = GetChangeFrameCount(Change);
//         const ChangeEndFrame: number = CurrentFrame + ChangeFrameCount;

//         if (Frame < ChangeEndFrame)
//         {
//             const AppliedSnapshotCount: number = GetAppliedSnapshotCount(
//                 Frame,
//                 CurrentFrame,
//                 Change
//             );

//             return ClampNumber(
//                 SnapshotIndex + AppliedSnapshotCount,
//                 0,
//                 Math.max(0, Snapshots.length - 1)
//             );

//             // const AddedCharacterCount: number = GetAddedCharacterCount(
//             //     Frame,
//             //     CurrentFrame,
//             //     Change
//             // );

//             // return ClampNumber(
//             //     SnapshotIndex + AddedCharacterCount,
//             //     0,
//             //     Math.max(0, Snapshots.length - 1)
//             // );
//         }

//         SnapshotIndex += GetChangeSnapshotCount(Change);
//         CurrentFrame = ChangeEndFrame;

//         if (ChangeIndex < Changes.length - 1)
//         {
//             const DelayFrameCount: number = GetDelayFrameCount(
//                 Change.Delay,
//                 Fps
//             );

//             const DelayEndFrame: number = CurrentFrame + DelayFrameCount;

//             if (Frame < DelayEndFrame)
//             {
//                 return ClampNumber(
//                     SnapshotIndex,
//                     0,
//                     Math.max(0, Snapshots.length - 1)
//                 );
//             }

//             CurrentFrame = DelayEndFrame;
//         }
//     }

//     return ClampNumber(
//         SnapshotIndex,
//         0,
//         Math.max(0, Snapshots.length - 1)
//     );
// }

//////////////////////////////////////////////////////////

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

// function GetAddedCharacterCount(
//     Frame: number,
//     ChangeStartFrame: number,
//     CharacterCount: number
// ): number
// {
//     return ClampNumber(
//         Math.floor((Frame - ChangeStartFrame) / FramesPerAddedCharacter),
//         0,
//         CharacterCount
//     );
// }

function GetSnapshotIndex(
    Frame: number,
    Fps: number,
    Changes: ReadonlyArray<FCodeChange>,
    Snapshots: ReadonlyArray<FCodeSnapshot>
): number
{
    let CurrentFrame: number = ChangeStartFrame;
    let SnapshotIndex: number = 0;

    for (
        let ChangeIndex: number = 0;
        ChangeIndex < Changes.length;
        ChangeIndex++
    )
    {
        const Change: FCodeChange = Changes[ChangeIndex];

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
            const DelayFrameCount: number = GetDelayFrameCount(
                Change.Delay,
                Fps
            );

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

// function GetSnapshotIndex(
//     Frame: number,
//     Fps: number,
//     Changes: ReadonlyArray<FCodeChange>,
//     Snapshots: ReadonlyArray<FCodeSnapshot>
// ): number
// {
//     let CurrentFrame: number = ChangeStartFrame;
//     let SnapshotIndex: number = 0;

//     for (
//         let ChangeIndex: number = 0;
//         ChangeIndex < Changes.length;
//         ChangeIndex++
//     )
//     {
//         const Change: FCodeChange = Changes[ChangeIndex];

//         switch (Change.Type)
//         {
//             case "Add":
//             {
//                 const CharacterCount: number = Change.Text.length;
//                 const ChangeEndFrame: number =
//                     CurrentFrame + (CharacterCount * FramesPerAddedCharacter);

//                 if (Frame < ChangeEndFrame)
//                 {
//                     // const AddedCharacterCount: number = GetAddedCharacterCount(
//                     //     Frame,
//                     //     CurrentFrame,
//                     //     CharacterCount
//                     // );

//                     // return ClampNumber(
//                     //     SnapshotIndex + AddedCharacterCount,
//                     //     0,
//                     //     Math.max(0, Snapshots.length - 1)
//                     // );
//                     const AppliedSnapshotCount: number = GetAppliedSnapshotCount(
//                         Frame,
//                         CurrentFrame,
//                         Change
//                     );

//                     return ClampNumber(
//                         SnapshotIndex + AppliedSnapshotCount,
//                         0,
//                         Math.max(0, Snapshots.length - 1)
//                     );
//                 }

//                 SnapshotIndex += CharacterCount;
//                 CurrentFrame = ChangeEndFrame;

//                 if (ChangeIndex < Changes.length - 1)
//                 {
//                     const DelayFrameCount: number = GetDelayFrameCount(
//                         Change.Delay,
//                         Fps
//                     );

//                     const DelayEndFrame: number = CurrentFrame + DelayFrameCount;

//                     if (Frame < DelayEndFrame)
//                     {
//                         return ClampNumber(
//                             SnapshotIndex,
//                             0,
//                             Math.max(0, Snapshots.length - 1)
//                         );
//                     }

//                     CurrentFrame = DelayEndFrame;
//                 }

//                 break;
//             }
//         }
//     }

//     return ClampNumber(
//         SnapshotIndex,
//         0,
//         Math.max(0, Snapshots.length - 1)
//     );
// }

/////////////////////////////////////////////////////////

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
