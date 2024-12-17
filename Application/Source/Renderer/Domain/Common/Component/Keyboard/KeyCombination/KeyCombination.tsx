/* File:      KeyCombination.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

import { type ReactElement, useMemo } from "react";
import type { FVirtualKey } from "../Keyboard.Types";
import { Key } from "../Key";
import type { PKeyCombination } from "./KeyCombination.Types";

/**
 * A key combination is any set of buttons that can trigger
 * an action within SorrellWm (**i.e.**, *one* or more keys).
 */
export const KeyCombination = ({ Keys }: PKeyCombination): ReactElement =>
{
    const KeyElements: Array<ReactElement> = useMemo((): Array<ReactElement> =>
    {
        const KeyArray: Array<FVirtualKey> = Array.isArray(Keys)
            ? Keys
            : [ Keys ];

        return KeyArray.map((VirtualKey: FVirtualKey): ReactElement =>
        {
            return (
                <Key
                    Value={ VirtualKey }
                    key={ VirtualKey }
                />
            );
        });
    }, [ Keys ]);

    return (
        <div style={ { alignItems: "center", display: "flex", justifyContent: "flex-start" } }>
            {
                KeyElements
            }
        </div>
    );
};
