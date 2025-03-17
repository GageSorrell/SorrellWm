/* File:      Tile.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import { Action } from "@/Action";
import { Log } from "@/Api";
import { Title1 } from "@fluentui/react-components";
import { useEffect, useState, type ReactElement } from "react";

export const Tile = (): ReactElement =>
{
    const [ Foo, SetFoo ] = useState<string>("");
    useEffect((): void =>
    {
        window.electron.ipcRenderer.sendMessage("GetScreenshot");
        window.electron.ipcRenderer.on("GetScreenshot", (...Arguments: Array<unknown>): void =>
        {
            // Log("GetScreenshot was received on the frontend: ", ...Arguments);
            SetFoo((_Old: string): string =>
            {
                return (Arguments[0] as string);
                // return "file:///" + (Arguments[0] as string).replaceAll("\\", "/");
                // return "file:///" + (Arguments[0] as string);
            });
        });
    }, [ SetFoo ]);

    // useEffect((): void =>
    // {
    //     Log(`Foo: ${ Foo }.`);
    // }, [ Foo ]);

    return (
        <Action>
            <div>
                <img src={ Foo } width={200} height={200} style={{ maxWidth: 200 }}/>
                <Title1>
                    Foo length is { Foo.length }
                </Title1>
            </div>
        </Action>
    );
};
