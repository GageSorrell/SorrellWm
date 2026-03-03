/* File:      CommandContainer.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { type CSSProperties, type ReactNode } from "react";
import type { FAction, FActionKey } from "../../../../../Shared/Settings";
import type { FCommand, FCompoundCommand, FSimpleCommand } from "./Command.Types";
import { type FKeyId, Key } from "../Keyboard";
import { GetKeybindIdFromKeybind, UseCommands } from "@/Command";
import { Title3, tokens } from "@fluentui/react-components";
import { ExtractFromRecordArray } from "../../../../../Shared/Utility";
import type { FLogger } from "../../../../../Shared/Log.Types";
import { GetFlexStyle } from "@/Utility";
import { GetLogger } from "@/Log";
import type { PCommandContainer } from "./CommandContainer.Types";
import { SwitchOnCommandType } from "./Command";
import { UseSetting } from "@/Settings";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log: FLogger = GetLogger("CommandContainer");

export const CommandContainer = ({ Commands }: PCommandContainer): ReactNode =>
{
    UseCommands(Commands);

    const RootStyle: CSSProperties =
    {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: "100%"
    };

    const RowHeight: string = tokens.spacingVerticalL;

    const [ Keybinds ] = UseSetting("Keybinds");

    const CommandKeybinds = (): ReactNode =>
    {
        const GetKeybindMatrix = (): Array<Array<FKeyId>> =>
        {
            const GetKeyIdArrayFromCommand = (Command: FCommand): Array<FKeyId> =>
            {
                return SwitchOnCommandType(
                    Command,
                    ({ Action: Keybind }: FSimpleCommand): Array<FKeyId> =>
                    {
                        const Out: Array<FKeyId> = GetKeybindIdFromKeybind(Keybind, Keybinds);
                        return Out;
                    },
                    (CompoundCommand: FCompoundCommand): Array<FKeyId> =>
                    {
                        const { SubCommands } = CompoundCommand;
                        const GetKeyIds = (In: Array<FActionKey>): Array<FKeyId> =>
                        {
                            return GetKeybindIdFromKeybind(In as FAction, Keybinds);
                        };

                        const Out: Array<FKeyId> = GetKeyIds(
                            ExtractFromRecordArray(
                                "Keybind",
                                /* @TODO This is probably the cause of a yet-to-be-discovered bug. */
                                SubCommands as unknown as Array<Record<"Keybind", unknown>>
                            ).flat() as Array<FActionKey>
                        );

                        return Out;
                    }
                );
            };

            return Commands.map(GetKeyIdArrayFromCommand);
        };

        const Rows = (): Array<ReactNode> =>
        {
            const RowStyleBase: CSSProperties =
            {
                ...GetFlexStyle("row", "flex-end", "center"),
                minHeight: RowHeight
            };

            const GetRow = (KeyIds: Array<FKeyId>): ReactNode =>
            {
                const RowStyle: CSSProperties =
                {
                    ...RowStyleBase,
                    gap: tokens.spacingHorizontalM
                };

                const Keys = (): ReactNode =>
                {
                    return KeyIds.map((Value: FKeyId): ReactNode =>
                    {
                        return <Key
                            key={ Value }
                            { ...{ Value } }
                        />;
                    });
                };

                return (
                    <div
                        key={ KeyIds.join() }
                        style={ RowStyle }>
                        <Keys />
                    </div>
                );
            };

            return GetKeybindMatrix().map(GetRow);
        };

        const KeybindContainerStyle: CSSProperties =
        {
            alignItems: "flex-end",
            display: "flex",
            flexDirection: "column",
            gap: tokens.spacingVerticalL,
            justifyContent: "flex-start",

            minHeight: RowHeight,
            position: "relative",
            right: tokens.spacingHorizontalL,
            top: 0
        };

        return (
            <div style={ KeybindContainerStyle }>
                <Rows />
            </div>
        );
    };

    const CommandTitles = (): ReactNode =>
    {
        const TitleContainerStyle: CSSProperties =
        {
            ...GetFlexStyle("column", "flex-start", "center"),
            gap: tokens.spacingVerticalL,
            left: 0,
            position: "relative",
            top: 0
        };
        const GetCommandTitles = (): Array<ReactNode> =>
        {

            const CommandTitle = ({ Name }: FCommand): ReactNode =>
            {
                const CommandTitleStyle: CSSProperties =
                {
                    alignItems: "baseline",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    minHeight: RowHeight,
                    width: "100%"
                };

                return (
                    <div
                        key={ `CommandTitle_${ Name }` }
                        style={ CommandTitleStyle }>
                        <Title3>
                            { Name }
                        </Title3>
                    </div>
                );
            };

            return Commands.map(CommandTitle);
        };

        return (
            <div style={ TitleContainerStyle }>
                { GetCommandTitles() }
            </div>
        );
    };

    return (
        <div style={ RootStyle }>
            <CommandKeybinds />
            <CommandTitles />
        </div>
    );
};
