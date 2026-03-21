/* File:      DummyWindow.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import {
    type CSSProperties,
    type PropsWithChildren,
    type ReactNode,
    type RefObject,
    useEffect,
    useRef,
    useState} from "react";
import { UseSendEventDeferred } from "./EventNew";
// import { UseSendIpcEventDeferred } from "./Event";

const DummyWindow = (): ReactNode =>
{
    const GradientReference: RefObject<FGradientData | null> = useRef<FGradientData | null>(null);

    if (GradientReference.current === null)
    {
        GradientReference.current = CreateGradientData();
    }

    const GradientStyle: CSSProperties =
    {
        /* eslint-disable-next-line @stylistic/max-len */
        background: `linear-gradient(${ GradientReference.current.Angle }deg, ${ GradientReference.current.ColorStops.join(", ") })`,
        boxShadow: "0 18px 45px rgba(0, 0, 0, 0.18)",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        width: "100vw"
    };

    const OverlayStyle: CSSProperties =
    {
        /* eslint-disable-next-line @stylistic/max-len */
        background: "radial-gradient(circle at top left, rgba(255, 255, 255, 0.25), transparent 40%), radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.12), transparent 35%)",
        inset: 0,
        pointerEvents: "none",
        position: "absolute"
    };

    const ContentStyle: CSSProperties =
    {
        height: "100%",
        position: "relative",
        width: "100%",
        zIndex: 1
    };

    return (
        <div style={ GradientStyle }>
            <div style={ OverlayStyle } />
            <div style={ ContentStyle } />
        </div>
    );
};

type FGradientData =
{
    Angle: number;
    ColorStops: Array<string>;
};

const CreateGradientData = (): FGradientData =>
{
    const BaseHue: number = Math.random() * 360;
    const Angle: number = 20 + Math.random() * 320;
    const StopCount: number = 4;
    const HueStep: number = 360 / StopCount;

    const ColorStops: Array<string> = Array.from({ length: StopCount }, (_: unknown, Index: number): string =>
    {
        const Hue: number = (BaseHue + HueStep * Index + RandomBetween(-18, 18) + 360) % 360;
        const Saturation: number = RandomBetween(68, 88);
        const Lightness: number = RandomBetween(52, 68);
        const Position: number = Math.round((Index / (StopCount - 1)) * 100);

        return `hsl(${Hue.toFixed(0)} ${Saturation.toFixed(0)}% ${Lightness.toFixed(0)}%) ${Position}%`;
    });

    return {
        Angle,
        ColorStops
    };
};

const RandomBetween = (Minimum: number, Maximum: number): number =>
{
    return Minimum + Math.random() * (Maximum - Minimum);
};

export const DummyWindowProvider = ({ children }: PropsWithChildren): ReactNode =>
{
    // const [ SendIpcEvent ] = UseSendIpcEventDeferred();
    const [ SendIpcEvent ] = UseSendEventDeferred();

    const [ IsDummyWindow, SetIsDummyWindow ] = useState<boolean>(false);

    useEffect((): void =>
    {
        (async (): Promise<void> =>
        {
            const { Data } = await SendIpcEvent("GetIsDummyWindow", undefined);
            SetIsDummyWindow(Data !== undefined && Data.IsDummyWindow);
        })();
    }, [ SendIpcEvent ]);

    return IsDummyWindow
        ? <DummyWindow />
        : children;
};
