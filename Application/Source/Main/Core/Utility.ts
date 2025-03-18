/* File:    util.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

import type { HHandle } from "./Utility.Types";
import { URL } from "url";
import path from "path";

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

export const AreHandlesEqual = (A: HHandle, B: HHandle): boolean =>
{
    return A.Handle === B.Handle;
};
