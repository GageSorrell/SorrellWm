/* File:    App.tsx
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

import "./App.css";
import {
    type MutableRefObject,
    type ReactElement,
    type RefObject,
    useEffect,
    useMemo,
    useRef,
    useState } from "react";
import { Route, MemoryRouter as Router, Routes } from "react-router-dom";
import { GetIsLightMode } from "./Api";
import { GetThemeColor } from "@sorrellwm/windows";

const Hello = (): ReactElement =>
{
    const [ BackgroundImage, SetBackgroundImage ] = useState<string>("");
    const HasLoadedBackgroundImage: MutableRefObject<boolean> = useRef<boolean>(false);
    const BackgroundImageElement: RefObject<HTMLImageElement> = useRef<HTMLImageElement>(null);
    const SystemColor: string = "#CC00CC";

    useEffect((): void =>
    {
        window.electron.ipcRenderer.on("BackgroundImage", (..._Arguments: Array<unknown>) =>
        {
            SetBackgroundImage((_Old: string): string => Event as unknown as string);
        });

        BackgroundImageElement.current?.addEventListener("load", (): void =>
        {
            if (!HasLoadedBackgroundImage.current)
            {
                HasLoadedBackgroundImage.current = true;
                window.electron.ipcRenderer.sendMessage("BackgroundImage");
            }
        });
    }, [ SystemColor ]);

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

    const [ ThemeColor, SetThemeColor ] = useState<string>(window.electron.GetThemeColor());

    // useEffect((): void =>
    // {
    //     GetThemeColor().then((InThemeColor: string) => SetThemeColor(InThemeColor));
    // }, [ ]);

    const [ BaseColor, SetBaseColor ] = useState<string>("");

    useEffect((): void =>
    {
        GetIsLightMode().then((IsLightMode: boolean) =>
        {
            SetBaseColor(IsLightMode ? "#FFFFFF" : "#CCCCCC");
        });
    }, [ ]);

    return (
        <div style={{ backgroundColor: SystemColor, overflow: "hidden" }}>
            <div className={ ColorImageClasses } style={{ backgroundColor: ThemeColor }}/>
            <div className={ ColorImageClasses } style={{ backgroundColor: BaseColor }}/>
            <img
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
            />
            <div style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                width: "100%"
            }}>
                <span style={{ fontWeight: 300 }}>
                    SorrellWm
                </span>
            </div>
        </div>
    );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
