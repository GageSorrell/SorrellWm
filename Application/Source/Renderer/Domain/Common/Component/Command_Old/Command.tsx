/* File:      Command.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import {
    type CSSProperties,
    type EffectCallback,
    type ReactElement,
    useEffect } from "react";
import { type FKeyId, Key } from "../Keyboard";
import { type IShortcutProviderRenderProps, UseShortcut } from "@/Keybind";
import { Title3, tokens } from "@fluentui/react-components";
import type { PCommand } from "./Command.Types";

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

    const { RegisterShortcut, UnregisterShortcut } = UseShortcut() as IShortcutProviderRenderProps;
    useEffect((): ReturnType<EffectCallback> =>
    {
        /* @TODO Investigate: the key F24 is registered as "Alt" by Electron and by online test tools. */
        // const ActionFunction: FSimpleCallback = Action ?? (() => { });
        // RegisterShortcut(ActionFunction, [ KeyString ], "Foo", 0);
        // return (): void =>
        // {
        //     UnregisterShortcut([ KeyString ], false);
        // };
    }, [ Action, KeyString, RegisterShortcut, UnregisterShortcut ]);
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
            <Key Value={ (InKey.toUpperCase() as FKeyId) } />
            <Title3>
                { Title }
            </Title3>
        </div>
    );
};
