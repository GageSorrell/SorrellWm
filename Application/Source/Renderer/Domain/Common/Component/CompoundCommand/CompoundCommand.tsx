/* File:      CompoundCommand.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { type CSSProperties, type EffectCallback, type ReactElement, useEffect } from "react";
import type { FSubCommand, PCompoundCommand } from "./CompoundCommand.Types";
import { type IShortcutProviderRenderProps, useShortcut } from "@/Keybinds";
import { Title3, tokens } from "@fluentui/react-components";
import { Key } from "../Keyboard";

export const CompoundCommand = ({ SubCommands, Title }: PCompoundCommand): ReactElement =>
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

    const { registerShortcut, unregisterShortcut } = useShortcut() as IShortcutProviderRenderProps;
    useEffect((): ReturnType<EffectCallback> =>
    {
        SubCommands.forEach(({ Action, Key }: FSubCommand): void =>
        {
            registerShortcut(Action, [ Key.toLowerCase() ], "Foo", "Foo");
        });
        return (): void =>
        {
            SubCommands.forEach(({ Key }: FSubCommand): void =>
            {
                unregisterShortcut([ Key.toLowerCase() ]);
            });
        };
    }, [ SubCommands, registerShortcut, unregisterShortcut ]);

    return (
        <div style={ RootStyle }>
            {
                SubCommands.map(({ Key: InKey }: FSubCommand): ReactElement =>
                {
                    return (
                        <Key Value={ InKey.toUpperCase() } />
                    );
                })
            }
            <Title3>
                { Title }
            </Title3>
        </div>
    );
};
