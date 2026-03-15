/* File:      Direction.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

// import { Command, CompoundCommand } from "@/Domain/Common";
// import { type NavigateFunction, useNavigate } from "react-router-dom";
// import { type ReactElement, useState } from "react";
// import { Action } from "@/Action";
// import type { FCardinalDirection } from "()/Shared.Types";
// import type { FInsertSizingMethod } from "!/Event/Insert.Types";
// import type { FSimpleCallback } from "!/Utility";
// import { HighlightedHalf } from "../Component";
// import { UseIpcNavigatorState } from "@/Router";

import { type ReactNode } from "react";

// const UseDirectionNavigatorState = (): Readonly<[ FInsertSizingMethod ]> =>
// {
//     const [ State ] = UseIpcNavigatorState();

//     if (State !== undefined && typeof State === "string")
//     {
//         return [ State as FInsertSizingMethod ] as const;
//     }
//     else
//     {
//         return [ "Bisection" ] as const;
//     }
// };

export const Direction = (): ReactNode =>
{
    // const Navigator: NavigateFunction = useNavigate();
    // const [ SizingMethod ] = UseDirectionNavigatorState();
    // const [ Position, SetPositionProper ] = useState<FCardinalDirection>("Left");

    // const SetPosition = (In: FCardinalDirection): FSimpleCallback =>
    // {
    //     return (): void =>
    //     {
    //         return SetPositionProper(In);
    //     };
    // };

    // const Confirm = (): void =>
    // {
    //     Navigator("/Insert/Direction/Select", { state: { Position, SizingMethod } });
    // };

    return <div></div>;

    // return (
    //     <Action>
    //         <HighlightedHalf { ...{ Position } }/>
    //         <CompoundCommand
    //             Description="@TODO"
    //             Name="Choose Direction"
    //             SubCommands={ [
    //                 {
    //                     Action: [ "Direction.Left" ],
    //                     Callback: SetPosition("Left")
    //                 },
    //                 {
    //                     Action: [ "Direction.Up" ],
    //                     Callback: SetPosition("Up")
    //                 },
    //                 {
    //                     Action: [ "Direction.Down" ],
    //                     Callback: SetPosition("Down")
    //                 },
    //                 {
    //                     Action: [ "Direction.Right" ],
    //                     Callback: SetPosition("Right")
    //                 }
    //             ] }
    //         />
    //         { /* @TODO "Or hover and click to select." */ }
    //         <Command
    //             Action={ [ "Primary[1]" ] }
    //             Callback={ Confirm }
    //             Description="@TODO"
    //             Name="Confirm"
    //         />
    //     </Action>
    // );
};
