/**
 *
 *
 * @module @sorrell/ink-ui/CodeEditor/CodeEditor
 *
 * @file      CodeEditor.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import type { CodeLanguage } from "./index.ts";
import { TextArea } from "../TextArea.tsx";
import { ValidationNotice } from "../ValidationNotice.tsx";
import { useTheme } from "../Theme.tsx";
// import { Box } from "../Box/Box.tsx";

/** {@inheritDoc CodeEditor} */
export interface CodeEditorProps
{
    readonly Focused?: boolean;
    readonly Height?: number;
    readonly Language?: CodeLanguage;
    readonly OnChange?: ((Value: string) => void) | undefined;
    readonly OnSubmit?: ((Value: string) => void) | undefined;
    readonly ReadOnly?: boolean;
    readonly ShowLineNumbers?: boolean;
    readonly Validate?: ((Value: string) => string | null) | undefined;
    readonly Value: string;
}

const SyntaxLine = ({
    Language,
    Line
}: {
    readonly Language: CodeLanguage;
    readonly Line: string;
}): React.ReactNode =>
{
    const Theme = useTheme();
    const Segments = Language === "json"
        ? TokenizeJson(Line)
        : Language === "yaml"
            ? TokenizeYaml(Line)
            : [ { Kind: "text" as const, Value: Line } ];
    const Colors: Record<SyntaxSegment["Kind"], string> = {
        boolean: Theme.Info,
        key: Theme.Secondary,
        null: Theme.Info,
        number: Theme.Warning,
        punctuation: Theme.TextMuted,
        string: Theme.Success,
        text: Theme.Text
    };

    return (
        <Ink.Text>
            { Segments.map((Segment: SyntaxSegment, Index: number) => (
                <Ink.Text
                    color={ Colors[Segment.Kind] }
                    key={ `${ Index }-${ Segment.Value }` }>
                    { Segment.Value }
                </Ink.Text>
            )) }
        </Ink.Text>
    );
};

const TokenizeJson = (Line: string): ReadonlyArray<SyntaxSegment> =>
    [ ...Line.matchAll(JsonTokenPattern) ].map((Match: RegExpMatchArray) =>
    {
        const Value = Match[0];
        const Kind: SyntaxSegment["Kind"] =
            Match[1] !== undefined ? "key"
                : Match[2] !== undefined ? "string"
                    : Match[3] !== undefined ? "boolean"
                        : Match[4] !== undefined ? "null"
                            : "{}[],:".includes(Value) ? "punctuation"
                                : /^-?\d/u.test(Value) ? "number"
                                    : "text";
        return { Kind, Value };
    });

interface SyntaxSegment
{
    readonly Kind:
        | "boolean"
        | "key"
        | "null"
        | "number"
        | "punctuation"
        | "string"
        | "text";

    readonly Value: string;
}

const JsonTokenPattern = new RegExp([
    String.raw`("(?:\\.|[^"\\])*")(?=\s*:)`,
    String.raw`("(?:\\.|[^"\\])*")`,
    String.raw`\b(true|false)\b`,
    String.raw`\b(null)\b`,
    String.raw`-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?`,
    String.raw`(?:\{|\}|\[|\]|,|:)`,
    String.raw`[^"{}\[\],:\d-]+`,
    "- "
].join("|"), "gu");

const TokenizeYaml = (Line: string): ReadonlyArray<SyntaxSegment> =>
{
    const Match = /^(\s*)([^:#]+)(:)(.*)$/u.exec(Line);
    if (Match === null)
    {
        return [ { Kind: Line.trimStart().startsWith("#") ? "punctuation" : "text", Value: Line } ];
    }

    return [
        { Kind: "text", Value: Match[1] ?? "" },
        { Kind: "key", Value: Match[2] ?? "" },
        { Kind: "punctuation", Value: Match[3] ?? "" },
        { Kind: "string", Value: Match[4] ?? "" }
    ];
};

export/**
       * Edits or views multiline code with lightweight JSON and YAML highlighting.
       *
       * @category CodeEditor
       * @since 1.0.0
       */
const CodeEditor = ({
    Focused = true,
    Height = 8,
    Language = "text",
    OnChange,
    OnSubmit,
    ReadOnly = false,
    ShowLineNumbers = true,
    Validate,
    Value
}: CodeEditorProps): React.ReactNode =>
{
    const Theme = useTheme();
    const ValidationMessage = React.useMemo(
        () => Validate?.(Value) ?? null,
        [ Validate, Value ]
    );
    const LineNumberWidth = String(Value.split("\n").length).length;
    const RenderLine = (Line: string, Index: number): React.ReactNode => (
        <Ink.Text>
            { ShowLineNumbers && (
                <Ink.Text color={ Theme.TextMuted }>
                    { String(Index + 1).padStart(LineNumberWidth) } │{" "}
                </Ink.Text>
            ) }
            <SyntaxLine
                Language={ Language }
                Line={ Line } />
        </Ink.Text>
    );

    return (
        <Ink.Box flexDirection="column">
            <Ink.Box flexDirection="row-reverse">
                <Ink.Text
                    bold
                    color={ Theme.TextMuted }
                    inverse>
                    { Language.toLocaleUpperCase() }
                    { ReadOnly ? " · read only" : " · Ctrl+Enter to submit" }
                </Ink.Text>
            </Ink.Box>
            <TextArea { ...{  Focused, Height, OnChange, OnSubmit, ReadOnly, RenderLine, Value } } />
            <ValidationNotice Message={ ValidationMessage } />
        </Ink.Box>
    );
};
