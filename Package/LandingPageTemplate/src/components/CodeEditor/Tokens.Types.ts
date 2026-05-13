/**
 * @file      Tokens.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

export type FTokens =
    Readonly<{
        ChangeStartFrame: number;
        CodeAreaWidth: number;
        CodeDefaultTextColor: string;
        CodeFadeEndFrame: number;
        CodeFadeStartFrame: number;
        CodeFontSize: number;
        CodeLineHeight: number;
        FramesPerAddedCharacter: number;
        IntellisenseWindowOffsetY: number;
        IntellisenseWindowWidth: number;
    }>;
