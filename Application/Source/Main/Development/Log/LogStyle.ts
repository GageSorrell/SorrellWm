/* File:      LogStyle.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FColorKeywords, FLogColor, FLogStyleFunction } from "./LogStyle.Types";
import Chalk from "chalk";
import type { FHexColor } from "Windows";

export function Code(In: string): string
{
    return Chalk.hex("#EB4657")(In);
};

export function Bold(In: string): string
{
    return Chalk.bold(In);
};

export function Italic(In: string): string
{
    return Chalk.italic(In);
};

export function Underline(In: string): string
{
    return Chalk.underline(In);
}

function IsHexColor(In: string): In is FHexColor
{
    return In.includes("#");
}

export function Background(Color: FHexColor | FLogColor): FLogStyleFunction
{
    if (IsHexColor(Color))
    {
        return (In: string): string =>
        {
            return Chalk.bgHex(Color)(In);
        };
    }
    else
    {
        return (In: string): string =>
        {
            return Chalk[ColorKeywords.Background[Color]](In);
        };
    }
};

export function Foreground(Color: FHexColor | FLogColor): FLogStyleFunction
{
    if (IsHexColor(Color))
    {
        return (In: string): string =>
        {
            return Chalk.hex(Color)(In);
        };
    }
    else
    {
        return (In: string): string =>
        {
            return Chalk[ColorKeywords.Foreground[Color]](In);
        };
    }
};

export function ComposeStyles(...StyleFunctions: Array<FLogStyleFunction>): FLogStyleFunction
{
    function Identity(In: string): string
    {
        return In;
    }

    function Reducer(PreviousValue: FLogStyleFunction, CurrentValue: FLogStyleFunction): FLogStyleFunction
    {
        return function(In: string): string
        {
            return PreviousValue(CurrentValue(In));
        };
    }

    return StyleFunctions.reduce(Reducer, Identity);
};

const ColorKeywords: FColorKeywords =
{
    Background:
    {
        Black: "bgBlack",
        BlackBright: "bgBlack",
        Blue: "bgBlue",
        BlueBright: "bgBlue",
        Cyan: "bgCyan",
        CyanBright: "bgCyan",
        Gray: "bgGray",
        Green: "bgGreen",
        GreenBright: "bgGreen",
        Magenta: "bgMagenta",
        MagentaBright: "bgMagenta",
        Red: "bgRed",
        RedBright: "bgRed",
        White: "bgWhite",
        WhiteBright: "bgWhite",
        Yellow: "bgYellow",
        YellowBright: "bgYellow"
    },
    Foreground:
    {
        Black: "black",
        BlackBright: "blackBright",
        Blue: "blue",
        BlueBright: "blueBright",
        Cyan: "cyan",
        CyanBright: "cyanBright",
        Gray: "gray",
        Green: "green",
        GreenBright: "greenBright",
        Magenta: "magenta",
        MagentaBright: "magentaBright",
        Red: "red",
        RedBright: "redBright",
        White: "white",
        WhiteBright: "whiteBright",
        Yellow: "yellow",
        YellowBright: "yellowBright"
    }
} as const;
