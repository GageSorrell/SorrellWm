/* File:      Predicate.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { useCallback, useMemo, type CSSProperties, type ReactElement } from "react";
import type { FColor, FHexColor } from "Windows";
import type { PPredicate } from "./Predicate.Types";

/** The base element for the elements within a logged statement. */
export const Predicate = ({ Color, Text }: PPredicate): ReactElement =>
{
    const GetBackgroundColorFromText = (InputText: string): FHexColor =>
    {
        let HashValue: number = 0;
        for (let Index: number = 0; Index < InputText.length; Index++)
        {
            HashValue = InputText.charCodeAt(Index) + ((HashValue << 5) - HashValue);
        }

        let Hue: number = HashValue % 360;
        if (Hue < 0)
        {
            Hue += 360;
        }

        const Saturation: number = 70;
        const Lightness: number = 50;

        return HSLToHex(Hue, Saturation, Lightness);
    };

    const HSLToHex = (Hue: number, Saturation: number, Lightness: number): FHexColor =>
    {
        Saturation /= 100;
        Lightness /= 100;

        const Chromaticity: number = (1 - Math.abs(2 * Lightness - 1)) * Saturation;
        const X: number = Chromaticity * (1 - Math.abs((Hue / 60) % 2 - 1));
        const Match: number = Lightness - Chromaticity / 2;
        let RedPrime: number = 0;
        let GreenPrime: number = 0;
        let BluePrime: number = 0;

        if (Hue < 60)
        {
            RedPrime = Chromaticity;
            GreenPrime = X;
            BluePrime = 0;
        }
        else if (Hue < 120)
        {
            RedPrime = X;
            GreenPrime = Chromaticity;
            BluePrime = 0;
        }
        else if (Hue < 180)
        {
            RedPrime = 0;
            GreenPrime = Chromaticity;
            BluePrime = X;
        }
        else if (Hue < 240)
        {
            RedPrime = 0;
            GreenPrime = X;
            BluePrime = Chromaticity;
        }
        else if (Hue < 300)
        {
            RedPrime = X;
            GreenPrime = 0;
            BluePrime = Chromaticity;
        }
        else
        {
            RedPrime = Chromaticity;
            GreenPrime = 0;
            BluePrime = X;
        }

        const Red: number = Math.round((RedPrime + Match) * 255);
        const Green: number = Math.round((GreenPrime + Match) * 255);
        const Blue: number = Math.round((BluePrime + Match) * 255);

        return "#" + ((1 << 24) + (Red << 16) + (Green << 8) + Blue)
            .toString(16)
            .slice(1)
            .toUpperCase() as FHexColor;
    };

    if (Color === undefined)
    {
        Color = GetBackgroundColorFromText(Text);
    }

    const GetForegroundColor: (HexColor: FHexColor) => FColor =
        useCallback<(HexColor: FHexColor) => FColor>((HexColor: FHexColor): FHexColor =>
        {
            let HexColorString: string = HexColor;

            if (HexColor[0] === "#")
            {
                HexColorString = HexColor.substring(1);
            }

            const Red: number = parseInt(HexColorString.substring(0, 2), 16);
            const Green: number = parseInt(HexColorString.substring(2, 4), 16);
            const Blue: number = parseInt(HexColorString.substring(4, 6), 16);

            const YIQ: number = ((Red * 299) + (Green * 587) + (Blue * 114)) / 1000;

            return (YIQ >= 128) ? "#000000" : "#FFFFFF";
        }, [ ]);

    const RootStyle: CSSProperties = useMemo<CSSProperties>((): CSSProperties =>
    {
        return {
            backgroundClip: Color,
            color: GetForegroundColor(Color) as FHexColor
        };
    }, [ Color, GetForegroundColor ]);

    return (
        <div style={ RootStyle }>
            { Text }
        </div>
    );
};
