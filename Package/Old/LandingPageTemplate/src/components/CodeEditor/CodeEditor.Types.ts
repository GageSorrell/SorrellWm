/**
 * @file      CodeEditorAnimation.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { FCodeChangeResolved, FIntellisenseContent } from "./CodeEditor.Internal.Types";

export type FCursorPosition = readonly [ number | "Current", number | "End" ];

export type PCodeEditorAnimation =
    {
        Changes?: ReadonlyArray<FCodeChangeResolved>;
        CursorPosition?: FCursorPosition;
        InitialCode: string;
        InitialIntellisense?: FIntellisenseContent;
        Intellisense?: FIntellisenseContent;
    };

