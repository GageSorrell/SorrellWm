/* File:      Command.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import {
    type CSSProperties,
    type EffectCallback,
    type ReactElement,
    useEffect } from "react";
import { type IShortcutProviderRenderProps, useShortcut } from "react-keybind";
import { Title3, tokens } from "@fluentui/react-components";
import { Key, KeyIdsById, type FVirtualKey } from "../Keyboard";
import type { PCommand } from "./Command.Types";
import { IpcRenderer, Log } from "@/Api";
import type { FKeyboardEvent } from "#/Keyboard.Types";

export const Command = ({ Action, Key: InKey, Title }: PCommand): ReactElement =>
{
    const KeyString: string = InKey.toLowerCase();

    const RootStyle: CSSProperties =
    {
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        gap: tokens.spacingHorizontalXL,
        justifyContent: "flex-start",
        width: "100%"
    };

    const { registerShortcut, unregisterShortcut } = useShortcut() as IShortcutProviderRenderProps;
    useEffect((): ReturnType<EffectCallback> =>
    {
        /* @TODO The `=` will need to be changed when the activation hotkey is changed. */
        registerShortcut(Action, [ `=+${ KeyString }` ], "Foo", "Foo");
        return (): void =>
        {
            unregisterShortcut([ `=+${ KeyString }` ]);
        };
    }, [ Action, KeyString, registerShortcut, unregisterShortcut ]);
    // useEffect((): ReturnType<EffectCallback> =>
    // {
    //     const Listener = (...Arguments: Array<unknown>): void =>
    //     {
    //         if (KeyIdsById[(Arguments[0] as FKeyboardEvent).VkCode] === KeyString)
    //         {
    //             Log(`Key ${ KeyString } was pressed for command ${ Title }.`);
    //         }
    //     };

    //     IpcRenderer.On("Keyboard", Listener);
    //     return (): void =>
    //     {
    //         IpcRenderer.RemoveListener("Keyboard", Listener);
    //     };
    // }, [ KeyString, Title ]);

    return (
        <div
            onMouseDown={ Action }
            style={ RootStyle }>
            <Key Value={ InKey.toUpperCase() } />
            <Title3>
                { Title }
            </Title3>
        </div>
    );
};
