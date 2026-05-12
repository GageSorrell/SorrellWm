/**
 * @file      CodeErrorDemo.Internal.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable */

import {
    type BundledLanguage,
    type BundledTheme,
    type Highlighter,
    type ThemeRegistration,
    type ThemedToken,
    type TokensResult,
    createHighlighter
} from "shiki";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type {
    FBuildCodeLinesOptions,
    FCodeLine,
    FCodeToken,
    FFrameRange,
    FTokenAnnotation,
    PAnimatedCodeLines,
    PCodeCard,
    PRenderCodeLine,
    PToken
} from "./CodeErrorDemo.Internal.Types";
import { Fragment, type ReactNode } from "react";
import type { FTheme } from "@sorrell/react/client";
import GitHubDarkDefaultTheme from "@shikijs/themes/github-dark-default";
import GitHubLightDefaultTheme from "@shikijs/themes/github-light-default";
import { OperatorMonoLigFontFamily } from "./Font";
import { useTheme } from "next-themes";

const CodeLineHeight: number = 48;
const CodeFontSize: number = 35;
const CodeLetterSpacing: number = 0.2;

const FrameRange: Readonly<FFrameRange> =
    {
        ErrorVisibleEnd: 60,
        ErrorVisibleStart: 0,
        NewLineFadeEnd: 102,
        NewLineFadeStart: 78,
        OldLineFadeEnd: 82,
        OldLineFadeStart: 62
    } as const;

const TokenColors: Readonly<Record<string, string>> =
    {
        Error: "#ff6b7a",
        Identifier: "#7cc7ff",
        Keyword: "#ff8a65",
        Method: "#c89cff",
        Primitive: "#8fcaff",
        Type: "#d6a4ff"
    } as const;

function Squiggle(): ReactNode
{
    const d: string =
        [
            "M0 6 C4 0",
            "8 0",
            "12 6 S20 8",
            "24 6 S32 0",
            "36 6 S44 8",
            "48 6 S56 0",
            "60 6 S68 8",
            "72 6 S80 0",
            "84 6 S92 8",
            "96 6"
        ].join(", ");

    const { resolvedTheme: Theme } = useTheme();
    const ShikiTheme: ThemeRegistration = (Theme || "dark") === "dark"
        ? GitHubDarkDefaultTheme
        : GitHubLightDefaultTheme;

    const Color: string =
        ShikiTheme.colors?.["editorError.foreground"]
        ?? ShikiTheme.colors?.errorForeground
        ?? "#F85149";

    return (
        <svg
            height="8"
            style={ {
                bottom: -7,
                left: 0,
                overflow: "visible",
                position: "absolute"
            } }
            viewBox="0 0 96 8"
            width="96">
            <path
                fill="none"
                stroke={ Color }
                strokeLinecap="round"
                strokeWidth="3"
                { ...{ d } }
            />
        </svg>
    );
};

function Token({ SquiggleOpacity, TokenValue }: PToken): ReactNode
{
    const Color: string =
        TokenValue.Color
        ?? (
            TokenValue.ClassName === undefined
                ? "#d5d9e2"
                : TokenColors[TokenValue.ClassName]
        );

    return (
        <span
            style={ {
                color: Color,
                display: "inline-block",
                position: "relative"
            } }>
            { TokenValue.Text }
            { TokenValue.HasSquiggle === true
                ? (
                    <span
                        style={ {
                            opacity: SquiggleOpacity,
                            transition: "none"
                        } }>
                        <Squiggle />
                    </span>
                )
                : null
            }
        </span>
    );
}

function RenderCodeLine({
    Line,
    Index,
    Opacity,
    TranslateY,
    SquiggleOpacity
}: PRenderCodeLine): ReactNode
{
    function TransformLineToken(TokenValue: FCodeToken, TokenIndex: number): ReactNode
    {
        return (
            <Token
                { ...{ SquiggleOpacity, TokenValue } }
                key={ `${ Line.Key }-${ TokenIndex }` }
            />
        );
    };

    return (
        <div
            style={ {
                height: CodeLineHeight,
                left: Line.Indent * 48,
                opacity: Opacity,
                position: "absolute",
                top: Index * CodeLineHeight,
                transform: `translateY(${TranslateY}px)`,
                whiteSpace: "pre"
            } }>
            { Line.Tokens.map(TransformLineToken) }
        </div>
    );
};

function AreCodeTokensEqual(
    FirstToken: FCodeToken,
    SecondToken: FCodeToken
): boolean
{
    return FirstToken.ClassName === SecondToken.ClassName
        && FirstToken.Color === SecondToken.Color
        && FirstToken.HasSquiggle === SecondToken.HasSquiggle
        && FirstToken.Text === SecondToken.Text;
}

function AreCodeLinesEqual(
    FirstLine: FCodeLine | undefined,
    SecondLine: FCodeLine | undefined
): boolean
{
    if (FirstLine === undefined || SecondLine === undefined)
    {
        return FirstLine === SecondLine;
    }

    if (
        FirstLine.Indent !== SecondLine.Indent
        || FirstLine.Tokens.length !== SecondLine.Tokens.length
    )
    {
        return false;
    }

    return FirstLine.Tokens.every((
        FirstToken: FCodeToken,
        TokenIndex: number
    ): boolean =>
    {
        return AreCodeTokensEqual(FirstToken, SecondLine.Tokens[TokenIndex]);
    });
}

function GetChangeOpacity(
    Frame: number,
    ChangeStartFrame: number,
    ChangeEndFrame: number
): number
{
    return interpolate(
        Frame,
        [ ChangeStartFrame, ChangeEndFrame ],
        [ 0, 1 ],
        {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp"
        }
    );
}

function GetLineEntryTranslateY(
    Frame: number,
    ChangeStartFrame: number,
    ChangeEndFrame: number
): number
{
    return interpolate(
        Frame,
        [ ChangeStartFrame, ChangeEndFrame ],
        [ 14, 0 ],
        {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp"
        }
    );
}

function AnimatedCodeLines({
    ChangeEndFrame,
    ChangeStartFrame,
    Frame,
    NewLines,
    OldLines,
    SquiggleOpacity = 1
}: PAnimatedCodeLines): ReactNode
{
    const MaximumLineCount: number = Math.max(OldLines.length, NewLines.length);

    const ChangeOpacity: number = GetChangeOpacity(
        Frame,
        ChangeStartFrame,
        ChangeEndFrame
    );

    // const NewLineTranslateY: number = GetLineEntryTranslateY(
    //     Frame,
    //     ChangeStartFrame,
    //     ChangeEndFrame
    // );

    return Array.from({ length: MaximumLineCount }).map((
        _: unknown,
        LineIndex: number
    ): ReactNode =>
    {
        const OldLine: FCodeLine | undefined = OldLines[LineIndex];
        const NewLine: FCodeLine | undefined = NewLines[LineIndex];

        const IsSameLine: boolean = AreCodeLinesEqual(OldLine, NewLine);

        if (IsSameLine === true && NewLine !== undefined)
        {
            return (
                <RenderCodeLine
                    Index={ LineIndex }
                    Line={ NewLine }
                    Opacity={ 1 }
                    SquiggleOpacity={ SquiggleOpacity }
                    TranslateY={ 0 }
                    key={ NewLine.Key }
                />
            );
        }

        return (
            <Fragment key={ `${ OldLine?.Key ?? "none" }-${ NewLine?.Key ?? "none" }` }>
                { OldLine !== undefined
                    ? (
                        <RenderCodeLine
                            Index={ LineIndex }
                            Line={ OldLine }
                            Opacity={ 1 - ChangeOpacity }
                            SquiggleOpacity={ SquiggleOpacity * (1 - ChangeOpacity) }
                            TranslateY={ 0 }
                        />
                    )
                    : null
                }

                { NewLine !== undefined
                    ? (
                        <RenderCodeLine
                            Index={ LineIndex }
                            Line={ NewLine }
                            Opacity={ ChangeOpacity }
                            SquiggleOpacity={ SquiggleOpacity * ChangeOpacity }
                            // TranslateY={ NewLineTranslateY }
                            TranslateY={ 0 }
                        />
                    )
                    : null
                }
            </Fragment>
        );
    });
}

export function CodeCard({ Old, New }: PCodeCard): ReactNode
{
    const Frame: number = useCurrentFrame();
    const { fps: Fps } = useVideoConfig();

    const { resolvedTheme: Theme } = useTheme();

    // const CardEntrance: number = spring({
    //     config:
    //     {
    //         damping: 22,
    //         mass: 0.7,
    //         stiffness: 90
    //     },
    //     fps: Fps,
    //     frame: Frame
    // });

    const LineBackground: string = (Theme === "dark"
        ? GitHubDarkDefaultTheme.bg
        : GitHubLightDefaultTheme.bg)
        || "#FFFFFF";

    return (
        <div
            style={ {
                background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                borderRadius: 70,
                boxShadow: "0 12px 48px rgba(0, 0, 0, 0.45)",
                inset: 64,
                // opacity: CardEntrance,
                padding: 16,
                position: "absolute"
                // transform: `scale(${ interpolate(CardEntrance, [ 0, 1 ], [ 0.985, 1 ]) })`
            } }>
            <div
                style={ {
                    background:
                    [
                        "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08), transparent 38%)",
                        "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                        "#111214"
                    ].join(", "),
                    border: "1px solid rgba(255, 255, 255, 0.16)",
                    borderRadius: 54,
                    inset: 18,
                    overflow: "hidden",
                    position: "absolute"
                } }>
                <div
                    style={ {
                        background: LineBackground,
                        inset: 0,
                        position: "absolute"
                    } }
                />

                <div
                    style={ {
                        color: "#d5d9e2",
                        fontFamily: OperatorMonoLigFontFamily,
                        fontSize: CodeFontSize,
                        height: 360,
                        left: 136,
                        letterSpacing: CodeLetterSpacing,
                        lineHeight: `${ CodeLineHeight }px`,
                        position: "absolute",
                        top: 214,
                        width: 1100
                    } }>
                    <AnimatedCodeLines
                        ChangeEndFrame={ FrameRange.NewLineFadeEnd }
                        ChangeStartFrame={ FrameRange.OldLineFadeStart }
                        Frame={ Frame }
                        NewLines={ New }
                        OldLines={ Old }
                        SquiggleOpacity={ 1 }
                    />
                </div>
            </div>
        </div>
    );
};

function DoesRangeOverlap(
    FirstStart: number,
    FirstEnd: number,
    SecondStart: number,
    SecondEnd: number
): boolean
{
    return FirstStart < SecondEnd && SecondStart < FirstEnd;
}

function GetMatchingAnnotation(
    Annotations: Array<FTokenAnnotation>,
    LineIndex: number,
    StartColumn: number,
    EndColumn: number
): FTokenAnnotation | undefined
{
    return Annotations.find((Annotation: FTokenAnnotation): boolean =>
    {
        return Annotation.LineIndex === LineIndex
            && DoesRangeOverlap(
                StartColumn,
                EndColumn,
                Annotation.StartColumn,
                Annotation.EndColumn
            );
    });
}

function GetSegmentBoundaries(
    Annotations: Array<FTokenAnnotation>,
    LineIndex: number,
    StartColumn: number,
    EndColumn: number
): Array<number>
{
    const Boundaries: Set<number> = new Set([ StartColumn, EndColumn ]);

    for (const Annotation of Annotations)
    {
        if (
            Annotation.LineIndex === LineIndex
            && DoesRangeOverlap(
                StartColumn,
                EndColumn,
                Annotation.StartColumn,
                Annotation.EndColumn
            )
        )
        {
            Boundaries.add(Math.max(StartColumn, Annotation.StartColumn));
            Boundaries.add(Math.min(EndColumn, Annotation.EndColumn));
        }
    }

    return [ ...Boundaries ].sort((First: number, Second: number): number =>
    {
        return First - Second;
    });
}

function CountLeadingSpaces(LineText: string): number
{
    const Match: RegExpMatchArray | null = LineText.match(/^ */u);
    return Match?.[0].length ?? 0;
}

function GetCodeHighlighter(Theme: FTheme): Promise<Highlighter>
{
    const HighlighterTheme: string = Theme === "Dark"
        ? "github-dark-default"
        : "github-light-default";

    return createHighlighter({
        langs: [ "tsx", "typescript", "javascript" ],
        themes: [ HighlighterTheme ]
    });
}

export function BuildCodeLines(
    Code: string,
    Options: FBuildCodeLinesOptions
): Promise<Array<FCodeLine>>
{
    const Theme: FTheme = Options.Theme || "Dark";
    const Language: BundledLanguage = Options.Language ?? "tsx";
    const CodeTheme: BundledTheme = Theme === "Dark"
        ? "github-dark-default"
        : "github-light-default";

    const SpacesPerIndent: number = Options.SpacesPerIndent ?? 4;

    return GetCodeHighlighter(Theme).then((Highlighter: Highlighter): Array<FCodeLine> =>
    {
        const Result: TokensResult = Highlighter.codeToTokens(
            Code.trimEnd(),
            {
                lang: Language,
                theme: CodeTheme
            }
        );

        const Annotations: Array<FTokenAnnotation> = Options.Annotations ?? [ ];

        return Result.tokens.map((LineTokens: Array<ThemedToken>, LineIndex: number): FCodeLine =>
        {
            const RawLineText: string = LineTokens
                .map((LineToken: ThemedToken): string => LineToken.content)
                .join("");

            const LeadingSpaces: number = CountLeadingSpaces(RawLineText);
            const Indent: number = Math.floor(LeadingSpaces / SpacesPerIndent);

            let CurrentColumn: number = 0;
            let RemainingLeadingSpaces: number = LeadingSpaces;

            const Tokens: Array<FCodeToken> = [ ];

            for (const LineToken of LineTokens)
            {
                const OriginalText: string = LineToken.content;
                const OriginalStartColumn: number = CurrentColumn;
                const OriginalEndColumn: number = OriginalStartColumn + OriginalText.length;

                CurrentColumn = OriginalEndColumn;

                let DisplayStartColumn: number = OriginalStartColumn;
                let DisplayText: string = OriginalText;

                if (RemainingLeadingSpaces > 0)
                {
                    const SpacesToRemove: number = Math.min(
                        RemainingLeadingSpaces,
                        DisplayText.length
                    );

                    DisplayText = DisplayText.slice(SpacesToRemove);
                    DisplayStartColumn += SpacesToRemove;
                    RemainingLeadingSpaces -= SpacesToRemove;
                }

                if (DisplayText.length === 0)
                {
                    continue;
                }

                const DisplayEndColumn: number = DisplayStartColumn + DisplayText.length;

                const SegmentBoundaries: Array<number> = GetSegmentBoundaries(
                    Annotations,
                    LineIndex,
                    DisplayStartColumn,
                    DisplayEndColumn
                );

                for (let Index: number = 0; Index < SegmentBoundaries.length - 1; Index++)
                {
                    const SegmentStartColumn: number = SegmentBoundaries[Index];
                    const SegmentEndColumn: number = SegmentBoundaries[Index + 1];

                    const Annotation: FTokenAnnotation | undefined = GetMatchingAnnotation(
                        Annotations,
                        LineIndex,
                        SegmentStartColumn,
                        SegmentEndColumn
                    );

                    Tokens.push({
                        ClassName: Annotation?.ClassName,
                        Color: Annotation?.Color ?? LineToken.color,
                        HasSquiggle: Annotation?.HasSquiggle,
                        Text: RawLineText.slice(SegmentStartColumn, SegmentEndColumn)
                    });
                }
            }

            return {
                Indent,
                Key: `${ Options.BaseKey }-${ LineIndex }`,
                Tokens: Tokens.length === 0 ? [ { Text: "" } ] : Tokens
            };
        });
    });
}
