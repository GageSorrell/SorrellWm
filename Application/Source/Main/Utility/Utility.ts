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
