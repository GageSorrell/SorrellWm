/* File:      Select.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { Action } from "@/Action";
import type { FCardinalDirection } from "?/Shared.Types";
import type { FInsertSizingMethod } from "?/Transaction.Types";
import { type ReactElement } from "react";
import { UseIpc } from "@/Utility";
import { UseIpcNavigatorState } from "@/Router";

type FSelectNavigatorState = Readonly<[ FInsertSizingMethod, FCardinalDirection ] | [ undefined, undefined ]>;

const UseSelectNavigatorState = (): FSelectNavigatorState =>
{
    const [ State ] = UseIpcNavigatorState();
    if (
        State !== undefined &&
        typeof State === "object" &&
        State !== null &&
        "Position" in State &&
        "SizingMethod" in State
    )
    {
        return [ State.SizingMethod as FInsertSizingMethod, State.Position as FCardinalDirection ] as const;
    }
    else
    {
        return [ undefined, undefined ] as const;
    }
};

export const Select = (): ReactElement =>
{
    const [ SizingMethod, Direction ] = UseSelectNavigatorState();

    const [ InsertableWindowData ] = UseIpc("GetInsertableWindowData", undefined);

    return (
        <Action>
            <div>
                Select
            </div>
        </Action>
    );
};
