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
import type { FSimpleCallback, TSimpleFunction } from "../Shared/Utility";
import { GetPropertyFromPath, Identity, type TMaybeArray } from "../Shared/Utility";
import type { FKeyId } from "../Shared/Keyboard.Types";
import type { FLogger } from "../Shared/Log.Types";
import { GetLogger } from "@/Log";
import type { TRecord } from "@sorrellwm/windows";
import { UseSetting } from "./Settings";
import { UseShortcut } from "./Keybind";
import type { TPath } from "Source/Shared/Utility/Object.Types";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const Log: FLogger = GetLogger("Command");

export type CCommand =
{
    SetCommands: Dispatch<SetStateAction<TArray<FCommand>>>;
};

const EmptyContext: CCommand =
{
    SetCommands: Identity
};

const CommandsContext: Context<CCommand> = createContext<CCommand>(EmptyContext);

export const UseCommands = (InCommands: TMaybeArray<FCommand>): void =>
{
    const Commands: TArray<FCommand> = useMemo((): TArray<FCommand> =>
    {
        return Array.isArray(InCommands)
            ? InCommands
            : [ InCommands ];
    }, [ InCommands ]);

    const { SetCommands } = useContext<CCommand>(CommandsContext);
    const RevokeCommand: TSimpleFunction<FCommand> = useCallback((Command: FCommand): void =>
    {
        SetCommands((OldCommands: TArray<FCommand>): TArray<FCommand> =>
        {
            return OldCommands.filter((In: FCommand): boolean =>
            {
                return AreCommandsEqual(In, Command);
            });
        });
    }, [ SetCommands ]);

    const SubmitCommand: TSimpleFunction<FCommand> = useCallback((Command: FCommand): void =>
    {
        SetCommands((OldCommands: TArray<FCommand>): TArray<FCommand> =>
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

export const GetKeyIdsFromAction = (Action: FAction, Keybinds: FKeybinds): TArray<FKeyId> =>
{
    return Action.flatMap((KeybindKey: FActionKey): TArray<FKeyId> =>
    {
        let ObjectKeyString: string = KeybindKey
            .replaceAll("[", ".")
            .replaceAll("]", ".");

        if (ObjectKeyString.endsWith("."))
        {
            ObjectKeyString = ObjectKeyString.slice(0, -1);
        }

        // const Path: TPath<FKeybinds> = ObjectKeyString as TPath<FKeybinds>;

        // return GetPropertyFromPath(Keybinds, Path);

        const ObjectKeyStrings: TArray<string> = KeybindKey
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

        const ObjectKeys: TArray<string | number> = ObjectKeyStrings.map(GetTypedPropertyKey);

        let Out: unknown = Keybinds;
        ObjectKeys.forEach((Key: string | number): void =>
        {
            Out = (Out as TRecord<typeof Key>)[Key];
        });

        return Array.isArray(Out)
            ? Out
            : [ Out ] as TArray<FKeyId>;
    });
};

export const CommandsProvider = ({ children }: PropsWithChildren): ReactNode =>
{
    const [ Commands, SetCommands ] = useState<TArray<FCommand>>([ ]);

    const { RegisterShortcut, UnregisterShortcut } = UseShortcut();

    const [ Keybinds ] = UseSetting("Keybinds");

    const UnregisterCommandShortcut: TSimpleFunction<FCommand> = useCallback((Command: FCommand): void =>
    {
        const GetKeyIds = (Action: FAction): TArray<FKeyId> =>
        {
            return GetKeyIdsFromAction(Action, Keybinds);
        };

        const OutKeybinds: TArray<TArray<FKeyId>> = SwitchOnCommandType(
            Command,
            ({ Action }: FSimpleCommand): TArray<TArray<FKeyId>> =>
            {
                return [ GetKeyIds(Action) ];
            },
            (CompoundCommand: FCompoundCommand): TArray<TArray<FKeyId>> =>
            {
                return CompoundCommand.SubCommands.map(({ Action }: FSubCommand): TArray<FKeyId> =>
                {
                    return GetKeyIds(Action);
                });
            }
        );

        const UnregisterKeybind = (Keybind: TArray<FKeyId>): void =>
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
                const Out: TArray<FKeyId> = GetKeyIdsFromAction(SimpleCommand.Action, Keybinds);
                // Log("Registering Simple Command", SimpleCommand.Name, Out);
                RegisterShortcut(
                    SimpleCommand.Callback,
                    Out,
                    SimpleCommand.Name
                );
            };

        const RegisterCompoundCommand: TSimpleFunction<FCompoundCommand> =
            (CompoundCommand: FCompoundCommand): void =>
            {
                // Log("Registering Compound Command", CompoundCommand.Name);
                CompoundCommand.SubCommands.forEach((SubCommand: FSubCommand, Index: number): void =>
                {
                    // Log(`Registering the ${ Index }th command.`);
                    RegisterShortcut(
                        SubCommand.Callback,
                        GetKeyIdsFromAction(SubCommand.Action, Keybinds),
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
