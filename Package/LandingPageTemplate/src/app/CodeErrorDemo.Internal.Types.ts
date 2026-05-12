/**
 * @file      CodeErrorDemo.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { BundledLanguage } from "shiki";
import type { FTheme } from "@sorrell/react/client";

export type PRenderCodeLine =
    {
        Line: FCodeLine;
        Index: number;
        Opacity: number;
        SquiggleOpacity: number;
        TranslateY: number;
    };

export type PToken =
    {
        TokenValue: FCodeToken;
        SquiggleOpacity: number;
    };

export type FCodeToken =
    {
        ClassName?: string;
        Color?: string;
        HasSquiggle?: boolean;
        Text: string;
    };

export type FCodeLine =
    {
        Indent: number;
        Key: string;
        Tokens: Array<FCodeToken>;
    };

export type PAnimatedCodeLines =
    {
        ChangeEndFrame: number;
        ChangeStartFrame: number;
        Frame: number;
        NewLines: Array<FCodeLine>;
        OldLines: Array<FCodeLine>;
        SquiggleOpacity?: number;
    };

export type FFrameRange =
    Record<
        | "ErrorVisibleStart"
        | "ErrorVisibleEnd"
        | "OldLineFadeStart"
        | "OldLineFadeEnd"
        | "NewLineFadeStart"
        | "NewLineFadeEnd",
        number
    >;
export type PCodeCard =
    {
        New: Array<FCodeLine>;
        Old: Array<FCodeLine>;
    };

export type FTokenAnnotation =
    {
        ClassName?: string;
        Color?: string;
        EndColumn: number;
        HasSquiggle?: boolean;
        LineIndex: number;
        StartColumn: number;
    };

export type FBuildCodeLinesOptions =
    {
        Annotations?: Array<FTokenAnnotation>;
        BaseKey: string;
        Language?: BundledLanguage;
        SpacesPerIndent?: number;
        Theme?: FTheme;
    };
