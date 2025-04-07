/* File:      Direction.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { Command, CompoundCommand } from "@/Domain/Common";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { type ReactElement, useState } from "react";
import { Action } from "@/Action";
import type { FCardinalDirection } from "?/Shared.Types";
import type { FInsertSizingMethod } from "?/Transaction.Types";
import { HighlightedHalf } from "../Component";
import { UseIpcNavigatorState } from "@/Router";

const UseDirectionNavigatorState = (): Readonly<[ FInsertSizingMethod ]> =>
{
    const [ State ] = UseIpcNavigatorState();

    if (State !== undefined && typeof State === "string")
    {
        return [ State as FInsertSizingMethod ] as const;
    }
    else
    {
        return [ "Bisection" ] as const;
    }
};

export const Direction = (): ReactElement =>
{
    const Navigator: NavigateFunction = useNavigate();
    const [ SizingMethod ] = UseDirectionNavigatorState();
    const [ Position, SetPosition ] = useState<FCardinalDirection>("Left");

    const Confirm = (): void =>
    {
        Navigator("/Insert/Direction/Select", { state: { Position, SizingMethod } });
    };

    return (
        <Action>
            <HighlightedHalf { ...{ Position } }/>
            <CompoundCommand
                SubCommands={ [
                    {
                        Action: () => SetPosition("Left"),
                        Key: "D"
                    },
                    {
                        Action: () => SetPosition("Up"),
                        Key: "H"
                    },
                    {
                        Action: () => SetPosition("Down"),
                        Key: "T"
                    },
                    {
                        Action: () => SetPosition("Right"),
                        Key: "N"
                    }
                ] }
                Title="Choose Direction"
            />
            { /* @TODO "Or hover and click to select." */ }
            <Command
                Action={ Confirm }
                Key="C"
                Title="Confirm"
            />
        </Action>
    );
};
