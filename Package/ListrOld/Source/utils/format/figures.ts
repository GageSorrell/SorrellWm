/**
 * @file      figures.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { isUnicodeSupported } from "@utils/index.js";

const FIGURES_MAIN: Record<string, string> =
    {
        arrowDown: "↓",
        arrowLeft: "←",
        arrowRight: "→",
        checkboxOn: "☒",
        cross: "✖",
        pointer: "❯",
        pointerSmall: "›",
        squareSmallFilled: "◼",
        tick: "✔",
        warning: "⚠"
    };

const FIGURES_FALLBACK: Record<string, string> =
    {
        ...FIGURES_MAIN,
        checkboxOn: "[×]",
        cross: "×",
        pointer: ">",
        squareSmallFilled: "■",
        tick: "√",
        warning: "‼"
    };

export type Figures = typeof FIGURES_MAIN;

export const figures: Figures = isUnicodeSupported()
    ? FIGURES_MAIN
    : FIGURES_FALLBACK;
