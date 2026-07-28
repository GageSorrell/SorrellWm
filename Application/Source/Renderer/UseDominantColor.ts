/**
 * Sample a raster icon's average color for use as a subtle UI tint.
 *
 * @module @sorrell/wm/Renderer/UseDominantColor
 *
 * @file      UseDominantColor.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { useEffect, useState } from "react";

/** An RGB color sampled from an icon. */
export interface SampledColor
{
    readonly B: number;
    readonly G: number;
    readonly R: number;
}

export/** Format a sampled color as a CSS `rgb()` value. */
const ToCssColor = (Color: SampledColor): string => `rgb(${ Color.R }, ${ Color.G }, ${ Color.B })`;

// Keyed by the base64-encoded PNG payload so repeated icons (and re-renders)
// never re-sample the same image.
const Cache = new Map<string, SampledColor | undefined>();

const SampleAverageColor = (Base64Png: string): Promise<SampledColor | undefined> =>
    new Promise((Resolve: (Value: SampledColor | undefined) => void) =>
    {
        const IconImage = new Image();

        IconImage.onload = () =>
        {
            try
            {
                const Canvas = document.createElement("canvas");
                Canvas.width = 1;
                Canvas.height = 1;
                const Context = Canvas.getContext("2d");

                if (Context === null)
                {
                    Resolve(undefined);
                    return;
                }

                // Downscaling the whole icon to a single pixel lets the canvas
                // do the averaging for us.
                Context.drawImage(IconImage, 0, 0, 1, 1);
                const Pixel = Context.getImageData(0, 0, 1, 1).data;
                Resolve({ B: Pixel[2] ?? 0, G: Pixel[1] ?? 0, R: Pixel[0] ?? 0 });
            }
            catch
            {
                Resolve(undefined);
            }
        };
        IconImage.onerror = () => Resolve(undefined);
        IconImage.src = `data:image/png;base64,${ Base64Png }`;
    });

export/** Sample and cache a base64-encoded PNG icon's average color. */
const UseDominantColor = (Base64Png: string | undefined): SampledColor | undefined =>
{
    const [ Color, SetColor ] = useState<SampledColor | undefined>(
        Base64Png === undefined ? undefined : Cache.get(Base64Png)
    );

    useEffect(() =>
    {
        if (Base64Png === undefined)
        {
            SetColor(undefined);
            return;
        }

        if (Cache.has(Base64Png))
        {
            SetColor(Cache.get(Base64Png));
            return;
        }

        let Cancelled = false;

        SampleAverageColor(Base64Png).then((Sampled: SampledColor | undefined) =>
        {
            Cache.set(Base64Png, Sampled);

            if (!Cancelled)
            {
                SetColor(Sampled);
            }
        });

        return (): void =>
        {
            Cancelled = true;
        };
    }, [ Base64Png ]);

    return Color;
};
