/* File:    App.tsx
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

import "./App.css";
import {
    type CSSProperties,
    type ReactElement,
    type ReactNode,
    type RefObject,
    useEffect,
    useRef,
    useState } from "react";
import { type NavigateFunction, Route, MemoryRouter as Router, Routes, useNavigate } from "react-router-dom";
import { FluentThemeProvider } from "./Utility/Theme";
import { Key } from "./Domain/Common/Component/Keyboard/Key";
import { KeyboardProvider } from "./Keyboard";
import { Log } from "./Api";
import { StoreProvider } from "./Store";
import { Vk } from "./Domain/Common/Component/Keyboard/Keyboard";
import { KeyCombination } from "./Domain/Common/Component/Keyboard/KeyCombination";

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
                display: "flex",
                flexDirection: "row",
                gap: 16,
                height: 256,
                justifyContent: "center",
                left: 0,
                maxHeight: 256,
                minWidth: "100%",
                position: "absolute",
                top: 0
            } }>
                <Key Value={ Vk["Shift"] }/>
                <Key Value={ Vk["LWin"] }/>
                <Key Value={ Vk["RWin"] }/>
                <Key Value={ Vk["LShift"] }/>
                <Key Value={ Vk["Num0"] }/>
                <Key Value={ Vk["Num1"] }/>
                <Key Value={ Vk["+"] }/>
                <Key Value={ Vk["Num9"] }/>
            </div>
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
                <div { ...{ style } }><span>pink</span></div>
            </div>
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

    const Command = ({ KeyValue, Title, Route }) =>
    {
        return (
            <div style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                gap: 16,
                justifyContent: "flex-start"
            }}>
                <Key Value={ KeyValue }/>
                <span style={ { fontSize: 18 } }>
                    { Title }
                </span>
            </div>
        );
    };

    return (
        <div
            ref={ DivRef }
            style={ {
                background: "none",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%"
            } }>
            <span style={ { color: "black", fontSize: 64 } }>
                SorrellWm
            </span>
            <div style={{ width: "100%", height: "100%" }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <div style={{
                        alignItems: "flex-start",
                        display: "flex",
                        flexDirection: "column",
                        gap: 24,
                        justifyContent: "flex-start"
                    }}>
                        <Command
                            KeyValue="H"
                            Route=""
                            Title="Focus"
                        />
                        <Command
                            KeyValue="J"
                            Route=""
                            Title="New"
                        />
                        <Command
                            KeyValue="K"
                            Route=""
                            Title="Move"
                        />
                        <Command
                            KeyValue="L"
                            Route=""
                            Title="Resize"
                        />
                    </div>
                </div>
                <div style={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column-reverse",
                    justifyContent: "flex-start"
                }}>
                    <Command
                        KeyValue={ "\uE734" }
                        Route=""
                        Title="Tools"
                    />
                </div>
            </div>
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

export const App = (): ReactNode =>
{
    return (
        <StoreProvider>
            <KeyboardProvider>
                <FluentThemeProvider>
                    <Router>
                        <IpcNavigator/>
                        <Routes>
                            <Route
                                element={ <Main /> }
                                path="/"
                            />
                            <Route
                                element={ <TestWindow /> }
                                path="/TestWindow"
                            />
                        </Routes>
                    </Router>
                </FluentThemeProvider>
            </KeyboardProvider>
        </StoreProvider>
    );
};
