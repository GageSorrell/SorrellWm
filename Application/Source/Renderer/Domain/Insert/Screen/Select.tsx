/* File:      Select.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FInsertSizingMethod, FInsertableWindowData } from "?/Transaction.Types";
import { Action } from "@/Action";
import type { FCardinalDirection } from "?/Shared.Types";
import { type ReactElement } from "react";
import { UseIpcEffect } from "@/Utility/Hook";
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

    UseIpcEffect(
        "GetInsertableWindowData",
        async (InsertableWindowData: Array<FInsertableWindowData>): Promise<void> =>
        {

        },
        undefined
    );

    return (
        <Action>
            <div>
                Select
            </div>
        </Action>
    );
};
