/**
 * @file      CodeEditorAnimation.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { ComponentType, ReactNode } from "react";
import type { BundledLanguage } from "shiki";
import type { FCursorPosition } from "./CodeEditorAnimation.Types";

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

export type FIntellisenseContent =
    | ReactNode
    | ComponentType<Record<string, never>>;

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

export type FBaseCodeChange =
    {
        Delay?: number;
        Intellisense?: FIntellisenseContent;
        SpeedScalar?: number;
    };

export type FAddCodeChange =
    FBaseCodeChange
    & {
        Position: FCursorPosition;
        Text: string;
        Type: "Add";
    };

export type FAddLineCodeChange =
    FBaseCodeChange
    & {
        LineIndex: number;
        Text?: string;
        Type: "AddLine";
    };

export type FCodeChange =
    | FAddCodeChange
    | FAddLineCodeChange;

export type FCodeSnapshot =
    {
        Code: string;
        CursorPosition?: FCursorPosition;
        Intellisense?: FIntellisenseContent;
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
        InitialIntellisense?: FIntellisenseContent;
    };

export type PRenderIntellisenseWindow =
    {
        Code: string;
        CursorPosition: FCursorPosition;
        Intellisense: FIntellisenseContent;
        Opacity: number;
    };

export type PCodeCard =
    {
        Changes: ReadonlyArray<FCodeChange>;
        CursorPosition?: FCursorPosition;
        InitialCode: string;
        Snapshots: ReadonlyArray<FCodeSnapshot>;
    };
