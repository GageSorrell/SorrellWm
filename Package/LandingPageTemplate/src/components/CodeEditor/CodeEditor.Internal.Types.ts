/**
 * @file      CodeEditorAnimation.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { ComponentType, ReactNode } from "react";
import type { BundledLanguage } from "shiki";
import type { FCursorPosition } from "./CodeEditor.Types";
import type { FCodeLine } from "./Component.Internal.Types";

export type FIntellisenseContent =
    | ReactNode
    | ComponentType<Record<string, never>>;

export type FBaseCodeChange =
    {
        // Delay?: number;
        Intellisense?: FIntellisenseContent;
        SpeedScalar?: number;
    };

export type FPauseCodeChange =
    FBaseCodeChange &
    {
        Duration: number;
        Type: "Pause";
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
    | FAddLineCodeChange
    | FPauseCodeChange;

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

export type PIntellisenseWindow =
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

export type FCursorPositionResolved = readonly [ number, number ];
