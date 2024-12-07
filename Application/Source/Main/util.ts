/* File:    util.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

import { URL } from "url";
import path from "path";

export function resolveHtmlPath(htmlFileName: string, Component?: string)
{
    if (process.env.NODE_ENV === "development")
    {
        const Port: string | number = process.env.PORT || 1212;
        const Url: URL = new URL(`http://localhost:${ Port }`);
        Url.pathname = htmlFileName;
        return Url.href;
    }
    const BasePath: string = `file://${path.resolve(__dirname, "../Renderer/", htmlFileName)}`;
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
