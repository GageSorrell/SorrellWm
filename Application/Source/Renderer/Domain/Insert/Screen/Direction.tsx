/* File:      Direction.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { Command, CompoundCommand } from "@/Domain/Common";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { type ReactElement, useState } from "react";
import { Action } from "@/Action";
import type { FCardinalDirection } from "!/Shared.Types";
import type { FInsertSizingMethod } from "../../../../Shared/Event/Insert.Types";
import type { FSimpleCallback } from "../../../../Shared/Utility";
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
    const [ Position, SetPositionProper ] = useState<FCardinalDirection>("Left");

    const SetPosition = (In: FCardinalDirection): FSimpleCallback =>
    {
        return (): void =>
        {
            return SetPositionProper(In);
        };
    };

    const Confirm = (): void =>
    {
        Navigator("/Insert/Direction/Select", { state: { Position, SizingMethod } });
    };

    return (
        <Action>
            <HighlightedHalf { ...{ Position } }/>
            <CompoundCommand
                Description="@TODO"
                Name="Choose Direction"
                SubCommands={ [
                    {
                        Callback: SetPosition("Left"),
                        Keybind: [ "Direction.Left" ]
                    },
                    {
                        Callback: SetPosition("Up"),
                        Keybind: [ "Direction.Up" ]
                    },
                    {
                        Callback: SetPosition("Down"),
                        Keybind: [ "Direction.Down" ]
                    },
                    {
                        Callback: SetPosition("Right"),
                        Keybind: [ "Direction.Right" ]
                    }
                ] }
            />
            { /* @TODO "Or hover and click to select." */ }
            <Command
                Callback={ Confirm }
                Description="@TODO"
                Keybind={ [ "Primary[1]" ] }
                Name="Confirm"
            />
        </Action>
    );
};
