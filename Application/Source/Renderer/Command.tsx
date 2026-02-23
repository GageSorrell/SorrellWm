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
    SwitchCommandType } from "./Domain/Common/Component/Command";
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
import type { FKeybind, TKeybindSet } from "!/Settings";
import type { FSimpleCallback, TSimpleFunction } from "!/Utility/Functional.Types";
import { Identity } from "./Utility";
import type { TMaybeArray } from "!/Utility";
import { UseShortcut } from "./Keybind";

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
            OldCommands.filter((In: FCommand): boolean =>
            {
                return AreCommandsEqual(In, Command);
            });

            return [ ...OldCommands ];
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

export const CommandsProvider = ({ children }: PropsWithChildren): ReactNode =>
{
    const [ Commands, SetCommands ] = useState<Array<FCommand>>([ ]);

    const { RegisterShortcut, UnregisterShortcut } = UseShortcut();

    const UnregisterCommandShortcut: TSimpleFunction<FCommand> = useCallback((Command: FCommand): void =>
    {
        const Keybinds: Array<TKeybindSet> = SwitchCommandType(
            Command,
            (SimpleCommand: FSimpleCommand): Array<TKeybindSet> =>
            {
                return [ SimpleCommand.Keybinds ];
            },
            (CompoundCommand: FCompoundCommand): Array<TKeybindSet> =>
            {
                return CompoundCommand.SubCommands.map((SubCommand: FSubCommand): TKeybindSet =>
                {
                    return SubCommand.Keybinds;
                });
            }
        );

        const UnregisterKeybindSet = (KeybindSet: TKeybindSet): void =>
        {
            KeybindSet.forEach((Keybind: FKeybind): void =>
            {
                /** @TODO If keybinds act up, then the second parameter might need to be `true`. */
                UnregisterShortcut(Keybind, false);
            });
        };

        Keybinds.forEach(UnregisterKeybindSet);
    }, [ UnregisterShortcut ]);

    const RegisterCommandShortcut: TSimpleFunction<FCommand> = useCallback((Command: FCommand): void =>
    {
        const RegisterSimpleCommand: TSimpleFunction<FSimpleCommand> =
            (SimpleCommand: FSimpleCommand): void =>
            {
                SimpleCommand.Keybinds.forEach((Keybind: FKeybind): void =>
                {
                    RegisterShortcut(SimpleCommand.Callback, Keybind, SimpleCommand.Name);
                });
            };

        const RegisterCompoundCommand: TSimpleFunction<FCompoundCommand> =
            (CompoundCommand: FCompoundCommand): void =>
            {
                CompoundCommand.SubCommands.forEach((SubCommand: FSubCommand): void =>
                {
                    SubCommand.Keybinds.forEach((Keybind: FKeybind): void =>
                    {
                        RegisterShortcut(SubCommand.Callback, Keybind, SubCommand.Name);
                    });
                });
            };

        SwitchCommandType(
            Command,
            RegisterSimpleCommand,
            RegisterCompoundCommand
        );

    }, [ RegisterShortcut ]);

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
