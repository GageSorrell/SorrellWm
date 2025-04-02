/* File:    util.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

import type { FBox } from "@sorrellwm/windows";
import type { FKeys, HHandle } from "./Utility.Types";
import type { TRef } from "../Core/Core.Types";
import { URL } from "url";
import path from "path";

export const MakeRef = <T>(): TRef<T> =>
{
    return {
        Ref: undefined
    } as TRef<T>;
};

export function ResolveHtmlPath(HtmlFileName: string, Component?: string)
{
    if (process.env.NODE_ENV === "development")
    {
        const Port: string | number = process.env.PORT || 1212;
        const Url: URL = new URL(`http://localhost:${ Port }`);
        Url.pathname = HtmlFileName;
        return Url.href;
    }
    const BasePath: string = `file://${path.resolve(__dirname, "../Renderer/", HtmlFileName)}`;
    if (Component !== undefined)
    {
        const ComponentArgument: string = `?Component=${ Component }`;
        return BasePath + ComponentArgument;
    }
    else
    {
        return BasePath;
    }
}

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
