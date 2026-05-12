/**
 * @file      CodeEditorAnimation.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { FCodeChange, FIntellisenseContent } from "./CodeEditorAnimation.Internal.Types";

export type FCursorPosition = readonly [ number, number ];

export type PCodeEditorAnimation =
    {
        Changes?: ReadonlyArray<FCodeChange>;
        CursorPosition?: FCursorPosition;
        InitialCode: string;
        InitialIntellisense?: FIntellisenseContent;
        Intellisense?: FIntellisenseContent;
    };

