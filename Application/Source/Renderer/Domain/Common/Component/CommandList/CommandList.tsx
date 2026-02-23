/* File:      CommandList.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { CSSProperties, ReactNode } from "react";
import { Command, type FCommand } from "../Command";
import type { PCommandList } from "./CommandList.Types";
import { UseCommands } from "@/Command";

export const CommandList = ({ Commands }: PCommandList): ReactNode =>
{
    const RootStyle: CSSProperties =
    {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start"
    };

    // const ItemHeight: number = 96; // @TODO

    const KeybindColumnStyle: CSSProperties =
    {
    };

    const NameColumnStyle: CSSProperties =
    {
    };

    UseCommands(Commands);

    return (
        <div style={ RootStyle }>
            <div style={ KeybindColumnStyle }>
                {
                    Commands.map((InCommand: FCommand): ReactNode => (
                        /* @TODO Replace this with keybind component. */
                        <Command
                            key={ InCommand.Name }
                            { ...InCommand }
                        />
                    ))
                }
            </div>
            <div style={ NameColumnStyle }>
                {
                    Commands.map((InCommand: FCommand): ReactNode => (
                        <Command
                            key={ InCommand.Name }
                            { ...InCommand }
                        />
                    ))
                }
            </div>
        </div>
    );
};
