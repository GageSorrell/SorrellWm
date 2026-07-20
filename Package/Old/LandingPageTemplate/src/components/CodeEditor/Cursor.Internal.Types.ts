/**
 * @file      Cursor.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { Dispatch, SetStateAction } from "react";

export type CCursorPosition =
    Readonly<{
        Positions: ReadonlyArray<number>;
        SetPositions: Dispatch<SetStateAction<ReadonlyArray<number>>>;
    }>;

export type FCursorPositionContext =
    readonly [
        Positions: CCursorPosition["Positions"],
        SetPositions: CCursorPosition["SetPositions"]
    ];
