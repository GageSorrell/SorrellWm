/**
 * @file      CommandContainer.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type CSSProperties, type ReactNode } from "react";
import type { FAction, FActionKey } from "../../../../../Shared/Settings";
import type { FCommand, FCompoundCommand, FSimpleCommand } from "./Command.Types";
import { GetKeyIdsFromAction, UseCommands } from "@/Command";
import { Title3, tokens } from "@fluentui/react-components";
import { ExtractFromRecordArray } from "../../../../../Shared/Utility";
import type { FKeyId } from "../../../../../Shared/Keyboard.Types";
import type { FLogger } from "../../../../../Shared";
import { GetFlexStyle } from "@/Utility";
import { GetLogger } from "@/Log";
import { Key } from "../Keyboard";
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
        const GetKeybindMatrix = (): TArray<TArray<FKeyId>> =>
        {
            const GetKeyIdArrayFromCommand = (Command: FCommand): TArray<FKeyId> =>
            {
                const Out: TArray<FKeyId> = SwitchOnCommandType(
                    Command,
                    ({ Action }: FSimpleCommand): TArray<FKeyId> =>
                    {
                        const Out: TArray<FKeyId> = GetKeyIdsFromAction(Action, Keybinds);
                        return Out;
                    },
                    (CompoundCommand: FCompoundCommand): TArray<FKeyId> =>
                    {
                        const { SubCommands } = CompoundCommand;
                        const GetKeyIds = (In: TArray<FActionKey>): TArray<FKeyId> =>
                        {
                            return GetKeyIdsFromAction(In as FAction, Keybinds);
                        };

                        const Out: TArray<FKeyId> = GetKeyIds(SubCommands.flatMap(C => C.Action));
                        // const Out: TArray<FKeyId> = GetKeyIds(
                        //     ExtractFromRecordArray(
                        //         "Action",
                        //         SubCommands
                        //     ).flat()
                        // );

                        return Out;
                    }
                );

                Log("GetKeyIdArrayFromCommand: ", Out, "Commands: ", Commands);

                return Out;
            };

            const Out: TArray<TArray<FKeyId>> = Commands.map(GetKeyIdArrayFromCommand);
            Log("GetKeybindMatrix: ", Out);

            // return Commands.map(GetKeyIdArrayFromCommand);
            return Out;
        };

        const Rows = (): TArray<ReactNode> =>
        {
            const RowStyleBase: CSSProperties =
            {
                ...GetFlexStyle("row", "flex-end", "center"),
                minHeight: RowHeight
            };

            const GetRow = ({ KeyIds }: { KeyIds: TArray<FKeyId>; }): ReactNode =>
            {
                const RowStyle: CSSProperties =
                {
                    ...RowStyleBase,
                    gap: tokens.spacingHorizontalM
                };

                const Keys = (): ReactNode =>
                {
                    Log("Key: KeyIds == ", KeyIds);
                    return KeyIds.map((Value: FKeyId): ReactNode =>
                    {
                        Log("KeyIds.map: Value == ", Value);
                        return <Key
                            key={ Value }
                            { ...{ KeyId: Value } }
                        />;
                    });
                };

                Log("GetRow: KeyIds.join == ", KeyIds.join());

                return (
                    <div
                        key={ KeyIds.join() }
                        style={ RowStyle }>
                        <Keys />
                    </div>
                );
            };

            return GetKeybindMatrix().map((KeyIds: TArray<FKeyId>, Index: number): ReactNode =>
            {
                return (
                    <GetRow
                        key={ `${ KeyIds.toString() }-${ Index }` }
                        { ...{ KeyIds } }
                    />
                );
            });
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
        const GetCommandTitles = (): TArray<ReactNode> =>
        {

            const CommandTitle = ({ Name }: Pick<FCommand, "Name">): ReactNode =>
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

            return Commands.map(({ Name }: FCommand, Index: number): ReactNode =>
            {
                return (
                    <CommandTitle
                        key={ `${ Name }-${ Index }` }
                        { ...{ Name } }
                    />
                );
            });
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
