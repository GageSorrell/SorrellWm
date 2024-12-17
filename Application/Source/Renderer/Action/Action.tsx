/* File:      Action.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

import { KeyCombinationDisplay } from "../Domain/Common/Component/Keyboard/Key/Key";
import type { PAction } from "./Action.Types";
import { type ReactElement } from "react";

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
            KeyCombination={ 0x48 }
            Name="Move"
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
            KeyCombination={ 0x4A }
            Name="Resize"
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
            KeyCombination={ 0x4B }
            Name="Insert"
            { ...{ OnSelect } }
        />
    );
};
