/* File:    App.tsx
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

import "./App.css";
import {
    type CSSProperties,
    type MutableRefObject,
    type ReactElement,
    type RefObject,
    useEffect,
    useMemo,
    useRef,
    useState } from "react";
import { type NavigateFunction, Route, MemoryRouter as Router, Routes, useNavigate } from "react-router-dom";
import { Log } from "./Api";
import type { HWindow } from "@sorrellwm/windows";

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
        position: "absolute",
        top: 0,
        left: `${ Math.floor(left * 100) / 100 }rem`,
        backgroundColor: Colors[Index],
        height: "10rem",
        width: "10rem"
    };

    return (
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "#00CC00", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div { ...{ style } }><span>pink</span></div>
        </div>
    );
};

export const Main = (): ReactElement =>
{
    const DivRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    useEffect((): void =>
    {
        window.electron.ipcRenderer.on("TearDown", (): void =>
        {
            setTimeout((): void =>
            {
                window.electron.ipcRenderer.sendMessage("TearDown");
            }, 100);
        });
    }, [ ]);

    return (
        <div style={{ width: "100%", height: "100%" }} ref={ DivRef }>
            <span style={{ color: "black" }}>SorrellWm</span>
        </div>
    );
};

const IpcNavigator = (): undefined =>
{
    const Navigator: NavigateFunction = useNavigate();
    useEffect((): void =>
    {
        window.electron.ipcRenderer.on("Navigate", (...Arguments: Array<unknown>): void =>
        {
            const HasRoute: boolean = Arguments.length > 0 && typeof Arguments[0] === "string";
            if (HasRoute)
            {
                const Route: string = Arguments[0] as string;
                Navigator(Route);
            }
        });
    }, [ Navigator ]);

    return undefined;
};

export const App = (): ReactElement =>
{
    return (
        <Router>
            <IpcNavigator/>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/TestWindow" element={<TestWindow />} />
            </Routes>
        </Router>
    );
};
