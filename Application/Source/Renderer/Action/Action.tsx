/* File:      Action.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

import { useMemo, type ReactElement } from "react";
import type { PAction } from "./Action.Types";
import { KeyCombinationDisplay } from "../Key/Key";

export const Action = ({ OnSelect, Name, KeyCombination }: PAction): ReactElement =>
{
    // @TODO Register keyboard combinations by `react-hotkeys-hook`.
    return (
        <div>
            <KeyCombinationDisplay
                Keys={ KeyCombination }
            />
            <div onMouseDown={ OnSelect }>
                { Name }
            </div>
        </div>
    );
};

/** @TODO Move these actions somewhere else... */

export const MoveAction = (): ReactElement =>
{
    const OnSelect = (): void =>
    {
        // @TODO
    };

    return (
        <Action
            Name="Move"
            KeyCombination={ 0x48 }
            { ...{ OnSelect } }
        />
    );
};

export const ResizeAction = (): ReactElement =>
{
    const OnSelect = (): void =>
    {
        // @TODO
    };

    return (
        <Action
            Name="Resize"
            KeyCombination={ 0x4A }
            { ...{ OnSelect } }
        />
    );
};

export const InsertAction = (): ReactElement =>
{
    const OnSelect = (): void =>
    {
        // @TODO
    };

    return (
        <Action
            Name="Insert"
            KeyCombination={ 0x4B }
            { ...{ OnSelect } }
        />
    );
};
