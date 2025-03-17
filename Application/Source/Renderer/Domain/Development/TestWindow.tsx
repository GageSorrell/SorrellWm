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
            // Log("Animated!");
            SetLeft((Old: number) =>
            {
                // Log(`Old is ${ Old }.`);
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

    const [ Foo, SetFoo ] = useState<string>("");
    useEffect((): void =>
    {
        window.electron.ipcRenderer.sendMessage("GetScreenshot");
        window.electron.ipcRenderer.on("GetScreenshot", (...Arguments: Array<unknown>): void =>
        {
            // Log("GetScreenshot was received on the frontend: ", ...Arguments);
            // navigator.clipboard.writeText(Arguments[0] as string);
            SetFoo((_Old: string): string =>
            {
                return (Arguments[0] as string);
                // return "file:///" + (Arguments[0] as string).replaceAll("\\", "/");
                // return "file:///" + (Arguments[0] as string);
            });
        });
    }, [ SetFoo ]);

    return (
        <div style={ {
            alignItems: "flex-center",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "flex-start",
            width: "100%"
        } }>
            <div style={ {
                alignItems: "center",
                backgroundColor: "#00CC00",
                display: "flex",
                height: "100%",
                justifyContent: "center",
                left: 0,
                position: "absolute",
                top: 256,
                width: "100%"
            } }>
                <img src={ Foo } width={200} height={200} style={{ maxWidth: 200 }}/>
                <div { ...{ style } }><span>{ Colors[Index] }</span></div>
            </div>
        </div>
    );
};
