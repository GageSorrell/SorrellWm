/* File:    Utility.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

import type { FBox } from "@sorrellwm/windows";
import type { FLogger } from "()/Log.Types";
import { promises as Fs } from "fs";
import { GetLogger } from "#/Development";
import type { HHandle } from "./Utility.Types";
import type { TRef } from "#/Core";

const Log: FLogger = GetLogger("Utility");

export const MakeRef = <Type>(): TRef<Type> =>
{
    return {
        Ref: undefined
    } as TRef<Type>;
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

export const MapKeys = <InType extends object = object, OutType = unknown>(
    InObject: object,
    Callback: (Key: keyof InType, Index?: number) => OutType
): TArray<OutType> =>
{
    const OutArray: TArray<OutType> = [ ];

    Object.keys(InObject).forEach((Key: string, Index: number): void =>
    {
        OutArray.push(Callback(Key as keyof InType, Index));
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
        Log.Error("ForAsync was given a StartIndex that wasn't an integer.");
        return;
    }

    if (!Number.isInteger(EndIndex))
    {
        Log.Error("ForAsync was given a EndIndex that wasn't an integer.");
        return;
    }

    if (StartIndex > EndIndex)
    {
        Log.Error("ForAsync was given a StartIndex that is greater than the given EndIndex.");
        return;
    }

    const Range: TArray<number> = [ ...Array(EndIndex - StartIndex + 1).keys() ];

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

export const GetPngBase64 = async (Path: string): Promise<string> =>
{
    const IconBuffer: Buffer = await Fs.readFile(Path);
    return "data:image/png;base64," + IconBuffer.toString("base64");
};
