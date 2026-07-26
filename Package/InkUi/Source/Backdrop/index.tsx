/**
 * Terminal-aware application backdrop.
 *
 * @module @sorrell/ink-ui/Backdrop
 *
 * @file      index.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { useTerminalSupport } from "../Support/Hook.js";
import { QueryTerminalSupport } from "../Support/Query.js";
import type { RgbColor, TerminalSupport } from "../Support/Types.js";

const DefaultDarkenRatio = 0.18;
const VeryDarkDarkenRatio = 0.45;
const VeryDarkLuminance = 0.025;

const TerminalBackgroundContext = React.createContext<string | undefined>(undefined);

/** Props for {@link BackdropProvider}. */
export interface BackdropProviderProps extends React.PropsWithChildren
{
    /** Backdrop color. Defaults to a darkened terminal background color. */
    readonly backgroundColor?: string | undefined;
}

/**
 * Paints its assumed full-screen region with a terminal-relative backdrop.
 *
 * When the terminal background cannot be queried, this returns its children
 * without introducing a layout element.
 */
export function BackdropProvider({
    backgroundColor,
    children
}: BackdropProviderProps): React.ReactElement
{
    const Support: TerminalSupport | undefined = useTerminalSupport();
    const TerminalRgb: RgbColor | undefined = Support?.BackgroundColor;
    const TerminalBackground: string | undefined = RgbToCss(TerminalRgb);

    if (TerminalRgb === undefined || TerminalBackground === undefined)
    {
        return <>{ children }</>;
    }

    const BackdropColor: string = backgroundColor
        ?? DarkenTerminalBackground(TerminalRgb);

    return (
        <TerminalBackgroundContext.Provider value={ TerminalBackground }>
            <Ink.Box
                backgroundColor={ BackdropColor }
                flexDirection="column"
                flexGrow={ 1 }
                height="100%"
                width="100%">
                { children }
            </Ink.Box>
        </TerminalBackgroundContext.Provider>
    );
}

/**
 * Read the original terminal background, preferring the nearest provider.
 *
 * @internal
 */
export function useTerminalBackgroundColor(): string | undefined
{
    const ProvidedColor: string | undefined = React.useContext(TerminalBackgroundContext);
    const { stdin, setRawMode } = Ink.useStdin();
    const { stdout } = Ink.useStdout();
    const [ DetectedColor, SetDetectedColor ] = React.useState<string>();

    React.useEffect(() =>
    {
        if (ProvidedColor !== undefined)
        {
            return;
        }
        let Cancelled: boolean = false;

        void QueryTerminalSupport({ SetRawMode: setRawMode, Stdin: stdin, Stdout: stdout })
            .then((Support: TerminalSupport) =>
            {
                const Color: string | undefined = RgbToCss(Support.BackgroundColor);
                // Do not introduce a Box rerender when detection was inconclusive.
                if (!Cancelled && Color !== undefined)
                {
                    SetDetectedColor(Color);
                }
            });

        return () =>
        {
            Cancelled = true;
        };
    }, [ ProvidedColor, setRawMode, stdin, stdout ]);

    return ProvidedColor ?? DetectedColor;
}

/** Produce the default contrast-aware backdrop color for a terminal background. */
export function DarkenTerminalBackground(Background: RgbColor): string
{
    const Ratio: number = RelativeLuminance(Background) <= VeryDarkLuminance
        ? VeryDarkDarkenRatio
        : DefaultDarkenRatio;
    const Scale: number = 1 - Ratio;

    return RgbToCss({
        Blue: Math.round(Background.Blue * Scale),
        Green: Math.round(Background.Green * Scale),
        Red: Math.round(Background.Red * Scale)
    });
}

function RgbToCss(Value: RgbColor): string;
function RgbToCss(Value: undefined): undefined;
function RgbToCss(Value: RgbColor | undefined): string | undefined;
function RgbToCss(Value: RgbColor | undefined): string | undefined
{
    return Value === undefined ? undefined : `rgb(${ Value.Red }, ${ Value.Green }, ${ Value.Blue })`;
}

function RelativeLuminance(Color: RgbColor): number
{
    return 0.2126 * LinearChannel(Color.Red)
        + 0.7152 * LinearChannel(Color.Green)
        + 0.0722 * LinearChannel(Color.Blue);
}

function LinearChannel(Value: number): number
{
    const Channel: number = Math.max(0, Math.min(255, Value)) / 255;
    return Channel <= 0.04045
        ? Channel / 12.92
        : ((Channel + 0.055) / 1.055) ** 2.4;
}
