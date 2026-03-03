/* File:      Command.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import {
    AreCommandsEqual,
    type FCommand,
    type FCompoundCommand,
    type FSimpleCommand,
    type FSubCommand,
    SwitchOnCommandType } from "./Domain/Common/Component/Command";
import {
    type Context,
    type Dispatch,
    type PropsWithChildren,
    type ReactNode,
    type SetStateAction,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState } from "react";
import type { FAction, FActionKey, FKeybinds } from "../Shared/Settings";
import type { FSimpleCallback, TRecord, TSimpleFunction } from "../Shared/Utility";
import type { FKeyId } from "!/Keyboard.Types";
import type { FLogger } from "../Shared/Log.Types";
import { GetLogger } from "@/Log";
import { Identity } from "./Utility";
import type { TMaybeArray } from "../Shared/Utility";
import { UseSetting } from "./Settings";
import { UseShortcut } from "./Keybind";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log: FLogger = GetLogger("Command");

export type CCommand =
{
    SetCommands: Dispatch<SetStateAction<Array<FCommand>>>;
};

const EmptyContext: CCommand =
{
    SetCommands: Identity
};

const CommandsContext: Context<CCommand> = createContext<CCommand>(EmptyContext);

export const UseCommands = (InCommands: TMaybeArray<FCommand>): void =>
{
    const Commands: Array<FCommand> = useMemo((): Array<FCommand> =>
    {
        return Array.isArray(InCommands)
            ? InCommands
            : [ InCommands ];
    }, [ InCommands ]);

    const { SetCommands } = useContext<CCommand>(CommandsContext);
    const RevokeCommand: TSimpleFunction<FCommand> = useCallback((Command: FCommand): void =>
    {
        SetCommands((OldCommands: Array<FCommand>): Array<FCommand> =>
        {
            return OldCommands.filter((In: FCommand): boolean =>
            {
                return AreCommandsEqual(In, Command);
            });
        });
    }, [ SetCommands ]);

    const SubmitCommand: TSimpleFunction<FCommand> = useCallback((Command: FCommand): void =>
    {
        SetCommands((OldCommands: Array<FCommand>): Array<FCommand> =>
        {
            return [ ...OldCommands, Command ];
        });
    }, [ SetCommands ]);

    useEffect((): FSimpleCallback =>
    {
        Commands.forEach(SubmitCommand);

        return (): void =>
        {
            Commands.forEach(RevokeCommand);
        };
    }, [ Commands, RevokeCommand, SubmitCommand ]);
};

export const GetKeybindIdFromKeybind = (Keybind: FAction, Keybinds: FKeybinds): Array<FKeyId> =>
{
    return Keybind.flatMap((KeybindKey: FActionKey): Array<FKeyId> =>
    {
        const ObjectKeyStrings: Array<string> = KeybindKey
            .replaceAll("[", ".")
            .replaceAll("]", ".")
            .split(".")
            .filter((KeyString: string): boolean => KeyString !== "");

        const GetTypedPropertyKey = (KeyString: string): string | number =>
        {
            const IsIndex = (Key: string): boolean =>
            {
                return /^-?(0|[1-9]\d*)$/.test(Key);
            };

            return IsIndex(KeyString)
                ? Number(KeyString)
                : KeyString;
        };

        const ObjectKeys: Array<string | number> = ObjectKeyStrings.map(GetTypedPropertyKey);

        let Out: unknown = Keybinds;
        ObjectKeys.forEach((Key: string | number): void =>
        {

            Out = (Out as TRecord<typeof Key>)[Key];
        });

        return Out as Array<FKeyId>;
    });
};

export const CommandsProvider = ({ children }: PropsWithChildren): ReactNode =>
{
    const [ Commands, SetCommands ] = useState<Array<FCommand>>([ ]);

    const { RegisterShortcut, UnregisterShortcut } = UseShortcut();

    const [ Keybinds ] = UseSetting("Keybinds");

    const UnregisterCommandShortcut: TSimpleFunction<FCommand> = useCallback((Command: FCommand): void =>
    {
        const GetKeyIds = (Keybind: FAction): Array<FKeyId> =>
        {
            return GetKeybindIdFromKeybind(Keybind, Keybinds);
        };

        const OutKeybinds: Array<Array<FKeyId>> = SwitchOnCommandType(
            Command,
            ({ Action: Keybind }: FSimpleCommand): Array<Array<FKeyId>> =>
            {
                return [ GetKeyIds(Keybind) ];
            },
            (CompoundCommand: FCompoundCommand): Array<Array<FKeyId>> =>
            {
                return CompoundCommand.SubCommands.map(({ Action: Keybind }: FSubCommand): Array<FKeyId> =>
                {
                    return GetKeyIds(Keybind);
                });
            }
        );

        const UnregisterKeybind = (Keybind: Array<FKeyId>): void =>
        {
            /** @TODO If keybinds act up, then the second parameter might need to be `true`. */
            UnregisterShortcut(Keybind, false);
        };

        OutKeybinds.forEach(UnregisterKeybind);
    }, [ Keybinds, UnregisterShortcut ]);

    const RegisterCommandShortcut: TSimpleFunction<FCommand> = useCallback((Command: FCommand): void =>
    {
        const RegisterSimpleCommand: TSimpleFunction<FSimpleCommand> =
            (SimpleCommand: FSimpleCommand): void =>
            {
                const Out: Array<FKeyId> = GetKeybindIdFromKeybind(SimpleCommand.Action, Keybinds);
                RegisterShortcut(
                    SimpleCommand.Callback,
                    Out,
                    SimpleCommand.Name
                );
            };

        const RegisterCompoundCommand: TSimpleFunction<FCompoundCommand> =
            (CompoundCommand: FCompoundCommand): void =>
            {
                CompoundCommand.SubCommands.forEach((SubCommand: FSubCommand, Index: number): void =>
                {
                    RegisterShortcut(
                        SubCommand.Callback,
                        GetKeybindIdFromKeybind(SubCommand.Action, Keybinds),
                        `${ CompoundCommand.Name }_${ Index }`
                    );
                });
            };

        SwitchOnCommandType(
            Command,
            RegisterSimpleCommand,
            RegisterCompoundCommand
        );

    }, [ Keybinds, RegisterShortcut ]);

    useEffect((): FSimpleCallback =>
    {
        Commands.forEach(RegisterCommandShortcut);

        return (): void =>
        {
            Commands.forEach(UnregisterCommandShortcut);
        };
    }, [ Commands, RegisterCommandShortcut, UnregisterCommandShortcut ]);

    const value: CCommand =
    {
        SetCommands
    };

    return (
        <CommandsContext.Provider { ...{ value } }>
            { children }
        </CommandsContext.Provider>
    );
};
