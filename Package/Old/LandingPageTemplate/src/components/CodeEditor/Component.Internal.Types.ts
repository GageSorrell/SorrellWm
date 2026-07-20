/**
 * @file      Component.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { FCursorPosition } from "./CodeEditor.Types";

export type FCodeToken =
    {
        Color?: string;
        Text: string;
    };

export type PToken =
    {
        TokenValue: FCodeToken;
    };

export type FCodeLine =
    {
        Key: string;
        Text: string;
        Tokens: Array<FCodeToken>;
    };

export type PCodeLine =
    {
        Index: number;
        Line: FCodeLine;
    };

export type PCursor =
    {
        Code: string;
        CursorOpacity: number;
        CursorPosition: FCursorPosition;
    };
