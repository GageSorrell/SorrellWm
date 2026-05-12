/**
 * @file      CodeEditorAnimation.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { BundledLanguage } from "shiki";
import type { FCursorPosition } from "./CodeEditorAnimation.Types";

export type FCodeToken =
    {
        Color?: string;
        Text: string;
    };

export type FCodeLine =
    {
        Key: string;
        Text: string;
        Tokens: Array<FCodeToken>;
    };

export type FAddCodeChange =
    {
        Type: "Add";
        Position: FCursorPosition;
        Text: string;
    };

export type FCodeChange = FAddCodeChange;

export type FCodeSnapshot =
    {
        Code: string;
        CursorPosition?: FCursorPosition;
        Lines: Array<FCodeLine>;
    };

export type FBuildCodeLinesOptions =
    {
        BaseKey: string;
        Language?: BundledLanguage;
    };

export type FBuildCodeSnapshotsOptions =
    FBuildCodeLinesOptions
    & {
        InitialCursorPosition?: FCursorPosition;
    };

export type PRenderCodeLine =
    {
        Index: number;
        Line: FCodeLine;
    };

export type PRenderCursor =
    {
        Code: string;
        CursorOpacity: number;
        CursorPosition: FCursorPosition;
    };

export type PToken =
    {
        TokenValue: FCodeToken;
    };

export type PCodeCard =
    {
        Changes: ReadonlyArray<FCodeChange>;
        CursorPosition?: FCursorPosition;
        InitialCode: string;
        Snapshots: ReadonlyArray<FCodeSnapshot>;
    };
