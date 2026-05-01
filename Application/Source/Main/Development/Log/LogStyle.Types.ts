/**
 * @file      LogStyle.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { BackgroundColor, ForegroundColor } from "chalk";
import type { FHexColor } from "@sorrell/wm-windows";

export type FLogStyleFunction = (In: string) => string;

export type FLogStyleFactory = (Color: FHexColor | FLogColor) => FLogStyleFunction;

type TLogColor<ColorType extends string> =
    | ColorType
    | `${ ColorType }Bright`;

type FLogColorBase = "Gray";

type FLogColorBright =
    | "Black"
    | "Red"
    | "Green"
    | "Yellow"
    | "Blue"
    | "Magenta"
    | "Cyan"
    | "White";

export type FLogColor =
    | TLogColor<FLogColorBright>
    | FLogColorBase;

export type FColorKeywords = Readonly<{
    Background: Readonly<{
        [ Key in FLogColor ]: typeof BackgroundColor;
    }>;
    Foreground: Readonly<{
        [ Key in FLogColor ]: typeof ForegroundColor;
    }>;
}>;

export type FLogStyleComposer = (...StyleFunctions: Array<FLogStyleFunction>) => FLogStyleFunction;
