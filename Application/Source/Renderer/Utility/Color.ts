/* File:      Color.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { FColor, FHexColor, FHslColor } from "@sorrellwm/windows";
import type { FThemeColors } from "./Color.Types";
import { UseStore } from "@/Store";
import { contrast } from "./Theme/FluentThemeDesigner";
import { hex_to_sRGB } from "./Theme/FluentThemeDesigner/Palettes";
import { useMemo } from "react";

export const GetForegroundColor = (BackgroundColor: FHexColor): FHexColor =>
{
    /* eslint-disable @stylistic/max-len */
    /**
     * This magic number was lifted from
     * https://github.com/microsoft/fluentui/blob/0eca6fb68963b15b664b8560984f0f742bae280b/packages/react-components/theme-designer
     */
    return contrast(hex_to_sRGB(BackgroundColor), hex_to_sRGB("#FFFFFF")) <= 0.45
        ? "#242424"
        : "#FFFFFF";
    /* eslint-enable @stylistic/max-len */
};

export const UseThemeColors = (): Readonly<FThemeColors> =>
{
    const { ThemeColor: BackgroundColor } = UseStore();
    const ForegroundColor: FHexColor = useMemo((): FHexColor =>
    {
        return GetForegroundColor(BackgroundColor);
    }, [ BackgroundColor ]);

    return [ BackgroundColor, ForegroundColor ] as const;
};

export const HexToHsl = (HexColor: FHexColor): FHslColor =>
{
    const Red: number = parseInt(HexColor.slice(1, 3), 16) / 255;
    const Green: number = parseInt(HexColor.slice(3, 5), 16) / 255;
    const Blue: number = parseInt(HexColor.slice(5, 7), 16) / 255;

    const Max: number = Math.max(Red, Green, Blue);
    const Min: number = Math.min(Red, Green, Blue);
    let Hue: number = 0;
    let Saturation: number = 0;
    let Lightness: number = (Max + Min) / 2;

    if (Max !== Min)
    {
        const Difference: number = Max - Min;
        Saturation = Lightness > 0.5 ? Difference / (2 - Max - Min) : Difference / (Max + Min);
        switch (Max)
        {
            case Red:
                Hue = (Green - Blue) / Difference + (Green < Blue ? 6 : 0);
                break;
            case Green:
                Hue = (Blue - Red) / Difference + 2;
                break;
            case Blue:
                Hue = (Red - Green) / Difference + 4;
                break;
        }
        Hue *= 60;
    }

    Saturation *= 100;
    Lightness *= 100;

    return {
        Hue,
        Lightness,
        Saturation
    };
};

export const HslToHex = ({ Hue, Lightness, Saturation }: FHslColor): FColor =>
{
    Saturation /= 100;
    Lightness /= 100;

    const Convert = (n: number) => (n + Hue / 30) % 12;
    const A: number = Saturation * Math.min(Lightness, 1 - Lightness);
    const Format = (Input: number) =>
    {
        return Math.round(
            255 * (Lightness - A * Math.max(-1, Math.min(Convert(Input) - 3, 9 - Convert(Input), 1)))
        );
    };

    const Red: number = Format(0);
    const Green: number = Format(8);
    const Blue: number = Format(4);

    return `#${((1 << 24) | (Red << 16) | (Green << 8) | Blue)
        .toString(16)
        .slice(1)
        .toUpperCase()}`;
};
