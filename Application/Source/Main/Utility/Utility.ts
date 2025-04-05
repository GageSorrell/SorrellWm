/* File:    util.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

import type { FBox } from "@sorrellwm/windows";
import type { HHandle } from "./Utility.Types";
import type { TRef } from "#/Core";

export const MakeRef = <T>(): TRef<T> =>
{
    return {
        Ref: undefined
    } as TRef<T>;
};

export const AreBoxesEqual = (A: FBox, B: FBox): boolean =>
{
    return (
        A.X === B.X &&
        A.Y === B.Y &&
        A.Width === B.Width &&
        A.Height === B.Height
    );

};

export const AreHandlesEqual = (A: HHandle, B: HHandle): boolean =>
{
    return A.Handle === B.Handle;
};

export const MapKeys = <T extends object = object, U = unknown>(
    InObject: object,
    Callback: (Key: keyof T, Index?: number) => U
): Array<U> =>
{
    const OutArray: Array<U> = [ ];

    Object.keys(InObject).forEach((Key: string, Index: number): void =>
    {
        OutArray.push(Callback(Key as keyof T, Index));
    });

    return OutArray;
};

export const ForAsync = async (
    StartIndex: number,
    EndIndex: number,
    Callback: ((Index: number) => Promise<void>)
) =>
{
    if (!Number.isInteger(StartIndex))
    {
        console.error("ForAsync was given a StartIndex that wasn't an integer.");
        return;
    }

    if (!Number.isInteger(EndIndex))
    {
        console.error("ForAsync was given a EndIndex that wasn't an integer.");
        return;
    }

    if (StartIndex > EndIndex)
    {
        console.error("ForAsync was given a StartIndex that is greater than the given EndIndex.");
        return;
    }

    const Range: Array<number> = [ ...Array(EndIndex - StartIndex + 1).keys() ];

    for await (const Index of Range)
    {
        await Callback(Index);
    }
};

export const PositionToString = (Box: FBox): string =>
{
    return `(${ Box.X }, ${ Box.Y })`;
};

export const SizeToString = (Box: FBox): string =>
{
    return `Width ${ Box.Width }, Height ${ Box.Height }`;
};

export const BoxToString = (Box: FBox): string =>
{
    return `${ PositionToString(Box) } with ${ SizeToString(Box) }`;
};

export const Sleep = (Duration: number): Promise<void> =>
{
    /* eslint-disable-next-line @typescript-eslint/typedef */
    return new Promise<void>((Resolve, _Reject): void =>
    {
        setTimeout((): void =>
        {
            Resolve();
        }, Duration);
    });
};
