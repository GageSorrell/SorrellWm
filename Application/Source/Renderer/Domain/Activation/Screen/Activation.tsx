/* File:      Activation.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
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
                    Action={ () => Navigator("/New") }
                    Key="H"
                    Title="New"
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
        window.electron.ipcRenderer.on("TearDown", (): void =>
        {
            setTimeout((): void =>
            {
                window.electron.ipcRenderer.sendMessage("TearDown");
            }, 100);
        });
    }, [ ]);

    /** @TODO Use Action component. */
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
