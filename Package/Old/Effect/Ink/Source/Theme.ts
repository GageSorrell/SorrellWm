/**
 *
 *
 * @module @sorrell/effect-ink/Theme
 *
 * @file      Theme.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Brand from "effect/Brand";
import type * as CliBoxes from "cli-boxes";
import * as Color from "./Color.ts";
import type * as Ink from "ink";
import type * as Record from "effect/Record";
import type { SpinnerName } from "cli-spinners";

export type BorderStyleRaw = NonNullable<Ink.BoxProps["borderStyle"]>;
export type BorderStyle = Brand.Branded<BorderStyleRaw, "BorderStyle">;
export type BoxStyleConstructor = (Value: CliBoxes.BoxStyle) => BorderStyle;

type BorderStyleRecord =
    Record.ReadonlyRecord<Exclude<BorderStyleRaw, CliBoxes.BoxStyle>, BorderStyle> &
    {
        readonly box: BoxStyleConstructor;
    };

const BorderStyleConstructor: Brand.Constructor<BorderStyle> = Brand.nominal<BorderStyle>();

export const BorderStyle: Brand.Constructor<BorderStyle> & BorderStyleRecord = Object.assign(
    Brand.nominal<BorderStyle>(),
    {
        arrow: BorderStyleConstructor("arrow"),
        bold: BorderStyleConstructor("bold"),
        box: (BoxStyle: CliBoxes.BoxStyle) => Brand.nominal<BorderStyle>()(BoxStyle),
        classic: BorderStyleConstructor("classic"),
        double: BorderStyleConstructor("double"),
        doubleSingle: BorderStyleConstructor("doubleSingle"),
        round: BorderStyleConstructor("round"),
        single: BorderStyleConstructor("single"),
        singleDouble: BorderStyleConstructor("singleDouble")
    }
);

export interface ColorPalette
{
    readonly Foreground: Color.Color;
    readonly Background: Color.Color;

    readonly Accent: Color.Color;
    readonly Primary: Color.Color;
    readonly Secondary: Color.Color;

    readonly InProgress: Color.Color;
    readonly Success: Color.Color;
    readonly Warning: Color.Color;
    readonly Error: Color.Color;
}

export interface Theme
{
    readonly ColorPalette: ColorPalette;

    readonly BorderStyle: BorderStyle;

    readonly Spinner: SpinnerName;
}

export const DefaultTheme: Theme =
    {
        BorderStyle: BorderStyle.round,
        ColorPalette:
        {
            Background: Color.Chalk[Color.Undefined],
            Foreground: Color.Chalk[Color.Undefined],

            Accent: Color.Chalk.magentaBright,
            Primary: Color.Chalk.greenBright,
            Secondary: Color.Chalk.cyanBright,

            Error: Color.Chalk.redBright,
            InProgress: Color.Chalk.magentaBright,
            Success: Color.Chalk.greenBright,
            Warning: Color.Chalk.yellowBright
        },

        Spinner: "circleHalves"
    } as const;
