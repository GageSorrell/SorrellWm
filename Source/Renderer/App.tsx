import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../Resource/icon.svg';
import './App.css';
import { useEffect, useRef, useState, type EffectCallback } from 'react';
import { ipcRenderer } from 'electron';
import { animated, easings, useSpring } from '@react-spring/web';
import { GetThemeColor } from './Api';

function Hello() {
    const [ BackgroundImage, SetBackgroundImage ] = useState<string>("");
    // const [ height, SetHeight ] = useState<number>(200);
    // const [ width, SetWidth ] = useState<number>(200);
    const HasLoadedBackgroundImage = useRef<boolean>(false);
    const BackgroundImageElement = useRef<HTMLImageElement>(null);
    const SystemColor: string = "#CC00CC";
    // const [ styles, api ] = useSpring(() =>
    // {
    //     return {
    //         from:
    //         {
    //             filter: "blur(0%)",
    //             backgroundColor: "#FFFFFF"
    //         },
    //         to:
    //         {
    //             filter: "blur(75%)",
    //             backgroundColor: SystemColor
    //         },
    //         config:
    //         {
    //             duration: 250,
    //             easing: easings.easeInOutExpo
    //         }
    //     };
    // });

    useEffect((): void =>
    {
        window.electron.ipcRenderer.on("BackgroundImage", (Event: Electron.IpcRendererEvent) =>
        {
            console.log("Received image!");
            SetBackgroundImage((_Old: string): string => Event as unknown as string);
            // api.start({
            //     from:
            //     {
            //         filter: "blur(0%)",
            //         backgroundColor: "#FFFFFF"
            //     },
            //     to:
            //     {
            //         filter: "blur(75%)",
            //         backgroundColor: SystemColor
            //     }
            // });
        });

        console.log("Adding load event listener");
        BackgroundImageElement.current?.addEventListener("load", (): void =>
        {
            // window.electron.ipcRenderer.sendMessage("BackgroundImageBack", "Inside listener");
            if (!HasLoadedBackgroundImage.current)
            {
                console.log("Image has been loaded!");
                HasLoadedBackgroundImage.current = true;
                window.electron.ipcRenderer.sendMessage("BackgroundImage");
            }
        });
    }, [ SystemColor ]);

    // const [ Blur, SetBlur ] = useState<number>(0);
    // useEffect((): void =>
    // {
    //     if (BackgroundImage !== "")
    //     {
    //         SetBlur(0.5);
    //     }
    // }, [ BackgroundImage ]);
    // useEffect((): void =>
    // {
    //     if (Blur > 0 && Blur < 4)
    //     {
    //         setTimeout((): void =>
    //         {
    //             SetBlur((Old: number): number =>
    //             {
    //                 return Old + 0.5;
    //             });
    //         }, 1000);
    //     }
    // }, [ Blur ]);

    /* @TODO Instead of delaying arbitrarily, the main thread should let the renderer      *
     * know when the window is done moving, and the blur animation should be started then. */
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
            GetThemeColor();
        }
    }, [ BackgroundImage ]);

    return (
        <div style={{ backgroundColor: SystemColor }}>
            <img
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
