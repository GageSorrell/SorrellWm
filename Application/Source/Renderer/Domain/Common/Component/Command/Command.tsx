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
import { Key } from "../Keyboard";
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
