/* File:      TestWindow.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import "./TestWindow.css";
import {
    type CSSProperties,
    type ReactElement,
    useEffect,
    useState } from "react";

// export const TestWindow = (): ReactElement =>
// {
//     const [ Index, SetIndex ] = useState<number>(0);
//     useEffect((): void =>
//     {
//         Log("Loaded TestWindow!");
//         const InductiveStep = (): void =>
//         {
//             SetIndex((Old: number): number => (Old + 1) % 4);

//             setTimeout(InductiveStep, 500);
//         };

//         InductiveStep();
//     }, [ ]);

//     const Colors: Array<string> =
//     [
//         "pink",
//         "cyan",
//         "purple",
//         "red"
//     ];

//     const [ left, SetLeft ] = useState<number>(0);
//     useEffect((): void =>
//     {
//         const Animate = (): void =>
//         {
//             SetLeft((Old: number) =>
//             {
//                 return (Old + 2) % 24;
//             });
//             setTimeout(Animate, 100);
//         };

//         Animate();
//     }, [ ]);

//     const style: CSSProperties =
//     {
//         backgroundColor: Colors[Index],
//         height: "10rem",
//         left: `${ Math.floor(left * 100) / 100 }rem`,
//         position: "absolute",
//         top: 0,
//         width: "10rem"
//     };

//     const RootStyle: CSSProperties =
//     {
//         alignItems: "flex-center",
//         display: "flex",
//         flexDirection: "column",
//         height: "100%",
//         justifyContent: "flex-start",
//         width: "100%"
//     };

//     const InnerStyle: CSSProperties =
//     {
//         alignItems: "center",
//         backgroundColor: "#00CC00",
//         display: "flex",
//         height: "100%",
//         justifyContent: "center",
//         left: 0,
//         position: "absolute",
//         top: 256,
//         width: "100%"
//     };

//     return (
//         <div style={ RootStyle }>
//             <div style={ InnerStyle }>
//                 <div { ...{ style } }>
//                     <span>
//                         {
//                             Colors[Index]
//                         }
//                     </span>
//                 </div>
//             </div>
//         </div>
//     );
// };

export const TestWindow = (): ReactElement =>
{
    const [ Direction, SetDirection ] = useState<number>(-45);
    useEffect((): void =>
    {
        SetDirection((_Old: number): number =>
        {
            return Math.floor(Math.random() * 360);
        });
    }, [ ]);

    const RootStyle: CSSProperties =
    {
        animation: "gradient 5s ease infinite",
        background: `linear-gradient(${ Direction }deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)`,
        backgroundSize: "400% 400%",
        minHeight: "100vh",
        minWidth: "100vw"
    };

    return (
        <div className="BackgroundGradient" style={ RootStyle }>
        </div>
    );
};
