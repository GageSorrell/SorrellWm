/**
 *
 *
 * @module @sorrell/ink-ui/Interaction/Command
 *
 * @file      Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Ink from "ink";
import * as React from "react";
import { CommandScopeContext, TypeId, UseInteraction } from "./Context.tsx";
import {
    GetKeyChord,
    type InternalShortcut,
    NormalizeKeyChord,
    type RegisteredInputHandler,
    type RegisteredShortcut,
    type RoutedInputHandler,
    type ShortcutRegistration
} from "./Shortcut.ts";

export/**
       * The identifiers of the focus commands supplied by `InteractionProvider`.
       *
       * @category Interaction
       * @since 1.0.0
       */
const FocusCommands =
    {
        First: "focus.first",
        Last: "focus.last",
        Next: "focus.next",
        Previous: "focus.previous"
    } as const;

/** {@inheritDoc FocusCommands} */
export type FocusCommand =
    typeof FocusCommands[keyof typeof FocusCommands];

/**
 * An instance of a command that is executed.
 *
 * @category Interaction
 * @since 1.0.0
 */
export interface CommandEvent<Data = unknown>
{
    readonly Command: string;
    readonly Data: Data | undefined;
    readonly Input: string | undefined;
    readonly Key: Ink.Key | undefined;
    readonly ScopeId: string;
    readonly TargetScopeId: string;
}

/**
 * A handler of a command.
 *
 * @category Interaction
 * @since 1.0.0
 */
export type CommandHandler<Data = unknown> =
    (Event: CommandEvent<Data>) => boolean | void;

/**
 * A command with registration state.
 *
 * @category Interaction
 * @since 1.0.0
 */
export interface CommandRegistration<Data = unknown>
{
    readonly Command: string;
    readonly Enabled?: boolean;
    readonly Handler: CommandHandler<Data>;
    readonly Priority?: number;
    readonly ScopeId: string;
}

/**
 * A command with internal registration state.
 *
 * @category Interaction
 * @since 1.0.0
 */
export interface RegisteredCommand
{
    readonly Command: string;
    readonly Enabled: boolean;
    readonly Handler: CommandHandler<unknown>;
    readonly Priority: number;
    readonly ScopeId: string;
    readonly Sequence: number;
}

/**
 * The scope in which a command is registered.
 *
 * @category Interaction
 * @since 1.0.0
 */
export interface RegisteredCommandScope
{
    readonly Id: string;
    readonly ParentId: string;
}

/**
 * The options for executing a command.
 *
 * @category Interaction
 * @since 1.0.0
 */
export interface ExecuteCommandOptions<Data = unknown>
{
    readonly Data?: Data;
    readonly Input?: string;
    readonly Key?: Ink.Key;
    readonly StartScopeId?: string;
}

/**
 * Stores hierarchical command handlers, routed input handlers, and key
 * bindings.
 *
 * @category Interaction
 * @since 1.0.0
 */
export class CommandRegistry
{
    private readonly Commands: Map<string, Array<RegisteredCommand>> =
        new Map<string, Array<RegisteredCommand>>();
    private readonly InputHandlers: Array<RegisteredInputHandler> = [ ];
    private readonly Listeners: Set<() => void> = new Set<() => void>();
    private readonly Scopes: Map<string, RegisteredCommandScope> = new Map<string, RegisteredCommandScope>();
    private readonly Shortcuts: Array<InternalShortcut> = [ ];
    private Sequence: number = 0;
    private Version: number = 0;

    public constructor()
    {
        this.Scopes.set(TypeId, {
            Id: TypeId,
            ParentId: TypeId
        });
    }

    public readonly GetSnapshot = (): number => this.Version;

    public readonly Subscribe = (Listener: () => void): (() => void) =>
    {
        this.Listeners.add(Listener);
        return () => this.Listeners.delete(Listener);
    };

    public RegisterScope(Id: string, ParentId: string = TypeId): () => void
    {
        if (this.Scopes.has(Id))
        {
            throw new Error(`A command scope with the id "${ Id }" is already registered.`);
        }
        this.Scopes.set(Id, { Id, ParentId });
        this.Notify();
        return () =>
        {
            this.Scopes.delete(Id);
            this.Notify();
        };
    }

    public Register<Data = unknown>(
        Registration: CommandRegistration<Data>
    ): () => void
    {
        const Registered: RegisteredCommand = {
            Command: Registration.Command,
            Enabled: Registration.Enabled ?? true,
            Handler: (Event: CommandEvent<unknown>) =>
                Registration.Handler(Event as CommandEvent<Data>),
            Priority: Registration.Priority ?? 0,
            ScopeId: Registration.ScopeId,
            Sequence: this.Sequence++
        };
        const Existing = this.Commands.get(Registration.Command) ?? [];
        Existing.push(Registered);
        this.Commands.set(Registration.Command, Existing);
        this.Notify();

        return () =>
        {
            const Commands = this.Commands.get(Registration.Command);
            if (Commands === undefined)
            {
                return;
            }
            const Index = Commands.indexOf(Registered);
            if (Index !== -1)
            {
                Commands.splice(Index, 1);
                if (Commands.length === 0)
                {
                    this.Commands.delete(Registration.Command);
                }
                this.Notify();
            }
        };
    }

    public RegisterShortcut(Registration: ShortcutRegistration): () => void
    {
        const Keys = (
            typeof Registration.Keys === "string"
                ? [ Registration.Keys ]
                : Registration.Keys
        ).map(NormalizeKeyChord);
        const Registered: InternalShortcut = {
            Command: Registration.Command,
            Description: Registration.Description,
            Enabled: Registration.Enabled ?? true,
            Hidden: Registration.Hidden ?? false,
            Id: Registration.Id
                ?? `shortcut-${ this.Sequence }`,
            Keys,
            Label: Registration.Label,
            Priority: Registration.Priority ?? 0,
            ScopeId: Registration.ScopeId,
            Sequence: this.Sequence++
        };
        this.Shortcuts.push(Registered);
        this.Notify();

        return () =>
        {
            const Index = this.Shortcuts.indexOf(Registered);
            if (Index !== -1)
            {
                this.Shortcuts.splice(Index, 1);
                this.Notify();
            }
        };
    }

    public RegisterInputHandler(
        ScopeId: string,
        Handler: RoutedInputHandler,
        Enabled: boolean = true,
        Priority: number = 0
    ): () => void
    {
        const Registered: RegisteredInputHandler = {
            Enabled,
            Handler,
            Priority,
            ScopeId,
            Sequence: this.Sequence++
        };
        this.InputHandlers.push(Registered);
        return () =>
        {
            const Index = this.InputHandlers.indexOf(Registered);
            if (Index !== -1)
            {
                this.InputHandlers.splice(Index, 1);
            }
        };
    }

    public Execute<Data = unknown>(
        Command: string,
        Options: ExecuteCommandOptions<Data> = { }
    ): boolean
    {
        const StartScopeId = Options.StartScopeId ?? TypeId;
        for (const ScopeId of this.GetScopePath(StartScopeId))
        {
            const Registrations = (this.Commands.get(Command) ?? [ ])
                .filter((Registration: RegisteredCommand) =>
                    Registration.ScopeId === ScopeId
                    && Registration.Enabled !== false
                )
                .sort((Left: RegisteredCommand, Right: RegisteredCommand) =>
                    (Right.Priority ?? 0) - (Left.Priority ?? 0)
                    || Right.Sequence - Left.Sequence
                );

            for (const Registration of Registrations)
            {
                const Handled = Registration.Handler({
                    Command,
                    Data: Options.Data,
                    Input: Options.Input,
                    Key: Options.Key,
                    ScopeId,
                    TargetScopeId: StartScopeId
                });
                if (Handled !== false)
                {
                    return true;
                }
            }
        }
        return false;
    }

    public HandleInput(
        Input: string,
        Key: Ink.Key,
        StartScopeId: string = TypeId
    ): boolean
    {
        const Chord = GetKeyChord(Input, Key);
        for (const ScopeId of this.GetScopePath(StartScopeId))
        {
            if (Chord !== undefined)
            {
                const Shortcuts = this.Shortcuts
                    .filter((Shortcut: InternalShortcut) =>
                        Shortcut.ScopeId === ScopeId
                        && Shortcut.Enabled
                        && Shortcut.Keys.includes(Chord)
                    )
                    .sort((Left: InternalShortcut, Right: InternalShortcut) =>
                        Right.Priority - Left.Priority
                        || Right.Sequence - Left.Sequence
                    );
                for (const Shortcut of Shortcuts)
                {
                    if (this.Execute(Shortcut.Command, {
                        Input,
                        Key,
                        StartScopeId
                    }))
                    {
                        return true;
                    }
                }
            }

            const InputHandlers = this.InputHandlers
                .filter((Registration: RegisteredInputHandler) =>
                    Registration.ScopeId === ScopeId
                    && Registration.Enabled
                )
                .sort((
                    Left: RegisteredInputHandler,
                    Right: RegisteredInputHandler
                ) =>
                    Right.Priority - Left.Priority
                    || Right.Sequence - Left.Sequence
                );
            for (const Registration of InputHandlers)
            {
                if (Registration.Handler(Input, Key) === true)
                {
                    return true;
                }
            }
        }
        return false;
    }

    public GetAllShortcuts(): ReadonlyArray<InternalShortcut>
    {
        return structuredClone(this.Shortcuts);
    }

    public GetActiveShortcuts(): ReadonlyArray<InternalShortcut>
    {
        const RegisteredShortcuts: ReadonlyArray<RegisteredShortcut> = this.GetShortcuts();
        return RegisteredShortcuts.map((Registered: RegisteredShortcut) =>
        {
            return this.Shortcuts.find((Internal: InternalShortcut) =>
            {
                return Registered.Id === Internal.Id;
            })!;
        });
    }

    public GetShortcuts(StartScopeId: string = TypeId): ReadonlyArray<RegisteredShortcut>
    {
        const Result: Array<RegisteredShortcut> = [ ];
        const SeenKeys = new Set<string>();
        for (const ScopeId of this.GetScopePath(StartScopeId))
        {
            const Shortcuts = this.Shortcuts
                .filter((Shortcut: InternalShortcut) =>
                    Shortcut.ScopeId === ScopeId
                    && Shortcut.Enabled
                    && !Shortcut.Hidden
                )
                .sort((Left: InternalShortcut, Right: InternalShortcut) =>
                    Right.Priority - Left.Priority
                    || Left.Sequence - Right.Sequence
                );
            for (const Shortcut of Shortcuts)
            {
                const AvailableKeys = Shortcut.Keys.filter(
                    (Key: string) => !SeenKeys.has(Key)
                );
                if (AvailableKeys.length === 0)
                {
                    continue;
                }
                for (const Key of AvailableKeys)
                {
                    SeenKeys.add(Key);
                }
                Result.push({
                    Command: Shortcut.Command,
                    Description: Shortcut.Description,
                    Id: Shortcut.Id,
                    Keys: AvailableKeys,
                    Label: Shortcut.Label,
                    ScopeId: Shortcut.ScopeId
                });
            }
        }
        return Result;
    }

    private GetScopePath(StartScopeId: string): ReadonlyArray<string>
    {
        const Result: Array<string> = [ ];
        const Visited = new Set<string>();
        let Current: string | undefined = StartScopeId;
        while (Current !== undefined && !Visited.has(Current))
        {
            Result.push(Current);
            if (Current === TypeId)
            {
                break;
            }
            Visited.add(Current);
            Current = this.Scopes.get(Current)?.ParentId ?? TypeId;
        }
        if (!Result.includes(TypeId))
        {
            Result.push(TypeId);
        }
        return Result;
    }

    private Notify(): void
    {
        this.Version++;
        for (const Listener of this.Listeners)
        {
            Listener();
        }
    }
}

/** {@inheritDoc CommandScope} */
export interface CommandScopeProps extends React.PropsWithChildren
{
    readonly Id?: string;
}

export/**
       * Creates a command-bubbling boundary without changing focus traversal.
       *
       * @category Interaction
       * @since 1.0.0
       */
const CommandScope = ({
    children,
    Id
}: CommandScopeProps): React.ReactNode =>
{
    const { Commands } = UseInteraction();
    const ParentId = React.useContext(CommandScopeContext);
    const GeneratedId = React.useId();
    const ScopeId = Id ?? `command-scope-${ GeneratedId }`;

    React.useLayoutEffect(
        () => Commands.RegisterScope(ScopeId, ParentId),
        [ Commands, ParentId, ScopeId ]
    );

    return (
        <CommandScopeContext.Provider value={ ScopeId }>
            { children }
        </CommandScopeContext.Provider>
    );
};

/** {@inheritDoc useCommand} */
export interface UseCommandOptions
{
    readonly Enabled?: boolean;
    readonly Priority?: number;
}

export/**
       * Registers a handler for a command in the nearest command scope.
       *
       * @category Interaction
       * @since 1.0.0
       */
const useCommand = <Data = unknown>(
    Command: string,
    Handler: CommandHandler<Data>,
    Options: UseCommandOptions = { }
): void =>
{
    const { Commands } = UseInteraction();
    const ScopeId = React.useContext(CommandScopeContext);
    const HandlerReference = React.useRef(Handler);
    HandlerReference.current = Handler;

    React.useLayoutEffect(() => Commands.Register<Data>({
        Command,
        Enabled: Options.Enabled ?? true,
        Handler: (Event: CommandEvent<Data>) =>
            HandlerReference.current(Event),
        Priority: Options.Priority ?? 0,
        ScopeId
    }), [
        Command,
        Commands,
        Options.Enabled,
        Options.Priority,
        ScopeId
    ]);
};

/** {@inheritDoc Command} */
export interface CommandProps<Data = unknown> extends UseCommandOptions
{
    readonly children?: React.ReactNode;
    readonly Handler: CommandHandler<Data>;
    readonly Id: string;
}

export/**
       * Declaratively registers a command handler in the nearest command scope.
       *
       * @category Interaction
       * @since 1.0.0
       */
const Command = <Data = unknown,>({
    children,
    Enabled,
    Handler,
    Id,
    Priority
}: CommandProps<Data>): React.ReactNode =>
{
    useCommand(Id, Handler, {
        ...(Enabled === undefined ? {} : { Enabled }),
        ...(Priority === undefined ? {} : { Priority })
    });
    return children ?? null;
};

/** {@inheritDoc useCommandManager} */
export interface CommandManager
{
    readonly Execute: <Data = unknown>(
        Command: string,
        Data?: Data
    ) => boolean;
    readonly ExecuteLocal: <Data = unknown>(
        Command: string,
        Data?: Data
    ) => boolean;
    readonly Shortcuts: ReadonlyArray<RegisteredShortcut>;
}

export/**
       * Returns command execution methods and context-sensitive shortcuts.
       *
       * @category Interaction
       * @since 1.0.0
       */
const useCommandManager = (): CommandManager =>
{
    const { Commands, Focus } = UseInteraction();
    const LocalScopeId = React.useContext(CommandScopeContext);
    React.useSyncExternalStore(
        Commands.Subscribe,
        Commands.GetSnapshot,
        Commands.GetSnapshot
    );
    React.useSyncExternalStore(
        Focus.Subscribe,
        Focus.GetSnapshot,
        Focus.GetSnapshot
    );
    const FocusedScopeId = Focus.GetFocusedCommandScopeId();

    return {
        Execute: <Data,>(CommandId: string, Data?: Data) =>
            Commands.Execute(CommandId, {
                Data,
                StartScopeId: Focus.GetFocusedCommandScopeId()
            }),
        ExecuteLocal: <Data,>(CommandId: string, Data?: Data) =>
            Commands.Execute(CommandId, {
                Data,
                StartScopeId: LocalScopeId
            }),
        Shortcuts: Commands.GetShortcuts(FocusedScopeId)
    };
};
