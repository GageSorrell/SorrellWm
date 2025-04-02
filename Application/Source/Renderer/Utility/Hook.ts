/* File:      Hook.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { type Dispatch, type SetStateAction, useState } from "react";

type FUseIndexReturnValue = Readonly<[
    Value: number,
    Increment: () => void,
    Decrement: () => void,
    SetIndex: Dispatch<SetStateAction<number>>
]>;

export const UseIndex = (
    InitialValue: number = 0,
    Minimum: number = 0,
    Maximum?: number
): FUseIndexReturnValue =>
{
    const [ Index, SetIndex ] = useState<number>(InitialValue || 0);

    const Increment = (): void =>
    {
        SetIndex((Old: number): number =>
        {
            return Maximum !== undefined && Old === Maximum
                ? Minimum
                : Old + 1;
        });
    };

    const Decrement = (): void =>
    {
        SetIndex((Old: number): number =>
        {
            return Old === Minimum
                ? Maximum !== undefined
                    ? Maximum
                    : Minimum
                : Old - 1;
        });
    };

    return [ Index, Increment, Decrement, SetIndex ] as const;
};
