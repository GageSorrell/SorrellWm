/* File:      KeyCombination.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

import { type CSSProperties, type ReactElement, useMemo } from "react";
import type { FVirtualKey } from "../../../../../../Shared/Keyboard.Types";
import { Key } from "../Key";
import { KeyIdsById } from "../../../../../../Shared/Keyboard";
import type { PKeyCombination } from "./KeyCombination.Types";

/**
 * A key combination is any set of buttons that can trigger
 * an action within SorrellWm (*i.e.*, *one* or more keys).
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
                    KeyId={ KeyIdsById[VirtualKey] }
                    key={ VirtualKey }
                />
            );
        });
    }, [ Keys ]);

    const RootStyle: CSSProperties =
    {
        alignItems: "center",
        display: "flex",
        justifyContent: "flex-start"
    };

    return (
        <div style={ RootStyle }>
            { KeyElements }
        </div>
    );
};
