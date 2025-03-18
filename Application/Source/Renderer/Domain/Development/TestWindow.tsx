/* File:      TestWindow.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import {
    type CSSProperties,
    type ReactElement,
    useEffect,
    useState } from "react";
import { Log } from "#/Development";

export const TestWindow = (): ReactElement =>
{
    const [ Index, SetIndex ] = useState<number>(0);
    useEffect((): void =>
    {
        Log("Loaded TestWindow!");
        const InductiveStep = (): void =>
        {
            SetIndex((Old: number): number => (Old + 1) % 4);

            setTimeout(InductiveStep, 500);
        };

        InductiveStep();
    }, [ ]);

    const Colors: Array<string> =
    [
        "pink",
        "cyan",
        "purple",
        "red"
    ];

    const [ left, SetLeft ] = useState<number>(0);
    useEffect((): void =>
    {
        const Animate = (): void =>
        {
            SetLeft((Old: number) =>
            {
                return (Old + 2) % 24;
            });
            setTimeout(Animate, 100);
        };

        Animate();
    }, [ ]);

    const style: CSSProperties =
    {
        backgroundColor: Colors[Index],
        height: "10rem",
        left: `${ Math.floor(left * 100) / 100 }rem`,
        position: "absolute",
        top: 0,
        width: "10rem"
    };

    const RootStyle: CSSProperties =
    {
        alignItems: "flex-center",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "flex-start",
        width: "100%"
    };

    const InnerStyle: CSSProperties =
    {
        alignItems: "center",
        backgroundColor: "#00CC00",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        left: 0,
        position: "absolute",
        top: 256,
        width: "100%"
    };

    return (
        <div style={ RootStyle }>
            <div style={ InnerStyle }>
                <div { ...{ style } }>
                    <span>
                        {
                            Colors[Index]
                        }
                    </span>
                </div>
            </div>
        </div>
    );
};
