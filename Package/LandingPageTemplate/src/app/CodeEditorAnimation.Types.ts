/**
 * @file      CodeEditorAnimation.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FCodeChange } from "./CodeEditorAnimation.Internal.Types";

export type FCursorPosition = readonly [ number, number ];

export type PCodeEditorAnimation =
    {
        Changes?: ReadonlyArray<FCodeChange>;
        CursorPosition?: FCursorPosition;
        InitialCode: string;
    };

