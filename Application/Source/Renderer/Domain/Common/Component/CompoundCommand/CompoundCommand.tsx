/* File:      CompoundCommand.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import {
    type CSSProperties,
    type EffectCallback,
    type ReactElement,
    type ReactNode,
    useEffect } from "react";
import { type FKeyId, Key } from "../Keyboard";
import { type IShortcutProviderRenderProps, UseShortcut } from "@/Keybind";
import { Title3, tokens } from "@fluentui/react-components";
import type { FLogger } from "../../../../../Shared/Log.Types";
import type { FSubCommand } from "../Command";
import { GetKeybindIdFromKeybind } from "@/Command";
import { GetLogger } from "@/Log";
import type { PCompoundCommand } from "./CompoundCommand.Types";
import { UseSetting } from "@/Settings";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log: FLogger = GetLogger("CompoundCommand");

export const CompoundCommand = ({ SubCommands, Name }: PCompoundCommand): ReactElement =>
{
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
        SubCommands.forEach(({ Callback, Keybind }: FSubCommand, Index: number): void =>
        {
            RegisterShortcut(Callback, Keybind, `${ Name }_${ Index }`, 0);
        });
        return (): void =>
        {
            SubCommands.forEach(({ Keybind }: FSubCommand): void =>
            {
                UnregisterShortcut(Keybind, false);
            });
        };
    }, [ SubCommands, RegisterShortcut, UnregisterShortcut, Name ]);

    const [ Keybinds ] = UseSetting("Keybinds");

    return (
        <div style={ RootStyle }>
            {
                SubCommands.flatMap(({ Keybind }: FSubCommand): Array<ReactNode> =>
                {
                    return GetKeybindIdFromKeybind(Keybind, Keybinds).map((Value: FKeyId): ReactNode =>
                    {
                        return (
                            <Key
                                key={ Value }
                                { ...{ Value } }
                            />
                        );
                    });
                })
            }
            <Title3>
                { Name }
            </Title3>
        </div>
    );
};
