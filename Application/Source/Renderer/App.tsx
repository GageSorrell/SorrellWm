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

    const style: CSSProperties =
    {
        backgroundColor: Colors[Index],
        height: "10rem",
        width: "10rem"
    };

    return (
        <div { ...{ style } }><span>pink</span></div>
    );
};

export const Main = (): ReactElement =>
{
    const [ BackgroundImage, SetBackgroundImage ] = useState<string>("");
    const HasLoadedBackgroundImage: MutableRefObject<boolean> = useRef<boolean>(false);
    const BackgroundImageElement: RefObject<HTMLImageElement> = useRef<HTMLImageElement>(null);
    const SystemColor: string = "#CC00CC";

    useEffect((): void =>
    {
        Log("Loaded Main page!");
        window.electron.ipcRenderer.on("BackgroundImage", (..._Arguments: Array<unknown>) =>
        {
            Log("MainWindow: BackgroundImage received!");
            SetBackgroundImage((_Old: string): string => Event as unknown as string);
        });

        BackgroundImageElement.current?.addEventListener("load", (): void =>
        {
            Log("LoadEventListener");
            if (!HasLoadedBackgroundImage.current)
            {
                HasLoadedBackgroundImage.current = true;
                window.electron.ipcRenderer.sendMessage("BackgroundImage");
            }
        });
    }, [ ]);

    const [ ImageClasses, SetImageClasses ] = useState<string>("BackgroundImage");
    useEffect((): void =>
    {
        if (BackgroundImage !== "")
        {
            setTimeout((): void =>
            {
                SetImageClasses((_Old: string): string =>
                {
                    return "BackgroundImage BackgroundImageBlurred";
                });
            }, 100);
        }
    }, [ BackgroundImage ]);

    useEffect((): void =>
    {
        Log("BackgroundImage received!");
    }, [ ]);

    const ColorImageClasses: string = useMemo<string>((): string =>
    {
        if (ImageClasses.includes("Blurred"))
        {
            return "BackgroundColor BackgroundColorOn";
        }
        else
        {
            return "BackgroundColor";
        }
    }, [ ImageClasses ]);

    // const [ ThemeColor, SetThemeColor ] = useState<string>(window.electron.GetThemeColor());
    const [ ThemeColor, SetThemeColor ] = useState<string>("#CC00CC");

    // useEffect((): void =>
    // {
    //     GetThemeColor().then((InThemeColor: string) => SetThemeColor(InThemeColor));
    // }, [ ]);

    const [ BaseColor, SetBaseColor ] = useState<string>("");

    // useEffect((): void =>
    // {
    //     GetIsLightMode().then((IsLightMode: boolean) =>
    //     {
    //         SetBaseColor(IsLightMode ? "#FFFFFF" : "#CCCCCC");
    //     });
    // }, [ ]);

    return (
        <div style={{ backgroundColor: SystemColor, overflow: "hidden", width: "100%", height: "100%", margin: 0, padding: 0 }}>
            {/* <div className={ ColorImageClasses } style={{ backgroundColor: ThemeColor }}/>
            <div className={ ColorImageClasses } style={{ backgroundColor: BaseColor }}/> */}
            {/* <img
                alt=""
                key="BackgroundImage"
                src={ BackgroundImage }
                // style={{ filter: `blur(${ Blur }px)` }}
                // style={{
                //     width: "auto",
                //     height: "100%",
                //     position: "absolute",
                //     top: 0,
                //     // animation: ""
                //     transition: "opacity 0.25s ease, filter 0.25s ease",
                //     filter: BackgroundImage === "" ? "none" : "blur(0.75)",
                //     mixBlendMode: "multiply",
                //     left: 0,
                //     // ...styles
                // }}
                // className={ BackgroundImage === "" ? "BackgroundImage" : "BackgroundImage BackgroundImageBlurred" }
                className={ ImageClasses }
                ref={ BackgroundImageElement }
            /> */}
            <div style={ {
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                width: "100%"
            } }>
                <span style={ { fontWeight: 300 } }>
                    SorrellWm
                </span>
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
