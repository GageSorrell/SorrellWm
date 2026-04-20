/**
 * @file      KeyCombination.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
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
    const KeyElements: TArray<ReactElement> = useMemo((): TArray<ReactElement> =>
    {
        const KeyArray: TArray<FVirtualKey> = Array.isArray(Keys)
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
