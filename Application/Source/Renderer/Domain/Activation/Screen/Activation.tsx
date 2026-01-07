/* File:      Activation.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import {
    Command,
    CommandBottomShelf,
    CommandContainer,
    MainCommands } from "$/Common/Component";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import { type ReactElement, useEffect } from "react";
import { Action } from "@/Action";
import { Log } from "@/Api";
import { UseIpcNavigatorState } from "@/Router";

const ActivationTiled = (): ReactElement =>
{
    const Navigator: NavigateFunction = useNavigate();

    return (
        <CommandContainer>
            <MainCommands>
                <Command
                    Action={ () => Navigator("/Focus") }
                    Key="D"
                    Title="Focus"
                />
                <Command
                    Action={ () => Navigator("/Insert") }
                    Key="H"
                    Title="Insert"
                />
                <Command
                    Action={ () => Navigator("/Move") }
                    Key="T"
                    Title="Move"
                />
                <Command
                    Action={ () => Navigator("/Resize") }
                    Key="N"
                    Title="Resize"
                />
            </MainCommands>
            <CommandBottomShelf>
                <Command
                    Action={ () => Log("Settings was selected.") }
                    Key="Z"
                    Title="Settings"
                />
            </CommandBottomShelf>
        </CommandContainer>
    );
};

const ActivationNotTiled = (): ReactElement =>
{
    const Navigator: NavigateFunction = useNavigate();

    return (
        <Action>
            <CommandContainer>
                <MainCommands>
                    <Command
                        Action={ () => Navigator("/Tile") }
                        Key="H"
                        Title="Tile (Bring into Panel)"
                    />
                    <Command
                        Action={ () => Navigator("/Move") }
                        Key="T"
                        Title="Move"
                    />
                    <Command
                        Action={ () => Navigator("/Resize") }
                        Key="N"
                        Title="Resize"
                    />
                </MainCommands>
                <CommandBottomShelf>
                    <Command
                        Action={ () => Log("Peek was selected.") }
                        Key="Z"
                        Title="Peek"
                    />
                </CommandBottomShelf>
            </CommandContainer>
        </Action>
    );
};

export const Activation = (): ReactElement =>
{
    const [ State ] = UseIpcNavigatorState();
    let IsTiled: boolean = false;

    if (State !== null && State !== undefined && typeof State === "object" && "IsTiled" in State)
    {
        IsTiled = State.IsTiled as boolean;
    }

    useEffect((): void =>
    {
        window.electron.ipcRenderer.On("TearDown", (): void =>
        {
            setTimeout((): void =>
            {
                window.electron.ipcRenderer.Send("TearDown");
            }, 100);
        });
    }, [ ]);

    /** @TODO Use Action component. */
    /** @TODO Hide "SorrellWm" if document.body.height is less than 500. */
    /** @TODO Set color of "SorrellWm" just as other elements, based upon color of underlying window. */
    return (
        <div
            style={ {
                alignItems: "center",
                background: "none",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "flex-start",
                width: "100%"
            } }>
            <div style={ {
                color: "black",
                fontSize: 64,
                marginBottom: 96
            } }>
                SorrellWm
            </div>
            {
                IsTiled
                    ? <ActivationTiled />
                    : <ActivationNotTiled />
            }
        </div>
    );
};
