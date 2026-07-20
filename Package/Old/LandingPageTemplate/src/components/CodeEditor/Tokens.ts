/**
 * @file      Tokens.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { FTokens } from "./Tokens.Types";

export const Tokens: FTokens =
    {
        ChangeStartFrame: 58,
        CodeAreaWidth: 1200,
        CodeDefaultTextColor: "#d5d9e2",
        CodeFadeEndFrame: 42,
        CodeFadeStartFrame: 12,
        CodeFontSize: 35,
        CodeLineHeight: 48,
        FramesPerAddedCharacter: 3,
        IntellisenseWindowOffsetY: 8,
        IntellisenseWindowWidth: 720
    } as const;
