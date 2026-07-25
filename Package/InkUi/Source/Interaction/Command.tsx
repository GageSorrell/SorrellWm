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
import {
    Array,
    Function,
    MutableHashMap,
    MutableHashSet,
    Number,
    Option,
    Predicate
} from "effect";
import { CommandScopeContext, TypeId, UseInteraction } from "./Context.tsx";
import {
    GetKeyChord,
    type GroupShortcut,
    type InternalShortcut,
    NormalizeKeyChord,
    type RegisteredInputHandler,
    type RegisteredShortcut,
    type RoutedInputHandler,
    type ShortcutRegistration
} from "./Shortcut.ts";

const GetBuiltInKey = (...Labels: Array.NonEmptyReadonlyArray<string>) =>
    `~sorrell/ink-ui/Interaction/Command!BuiltIn!${ Labels.join("!") }`;

namespace BuiltInCommand
{
    export/**
           * The "focus first" command.
           *
           * @category Interaction
           * @since 1.0.0
           */
    const First: unique symbol = Symbol.for(GetBuiltInKey("Focus", "First"));

    export/**
           * The "focus last" command.
           *
           * @category Interaction
           * @since 1.0.0
           */
    const Last: unique symbol = Symbol.for(GetBuiltInKey("Focus", "Last"));

    export/**
           * The "focus next" command.
           *
           * @category Interaction
           * @since 1.0.0
           */
    const Next: unique symbol = Symbol.for(GetBuiltInKey("Focus", "Next"));

    export/**
           * The "focus previous" command.
           *
           * @category Interaction
           * @since 1.0.0
           */
    const Previous: unique symbol = Symbol.for(GetBuiltInKey("Focus", "Previous"));

    export/**
           * The "move up" command.
           *
           * @category Interaction
           * @since 1.0.0
           */
    const Up: unique symbol = Symbol.for(GetBuiltInKey("Move", "Up"));

    export/**
           * The "move down" command.
           *
           * @category Interaction
           * @since 1.0.0
           */
    const Down: unique symbol = Symbol.for(GetBuiltInKey("Move", "Down"));

    export/**
           * The "move left" command.
           *
           * @category Interaction
           * @since 1.0.0
           */
    const Left: unique symbol = Symbol.for(GetBuiltInKey("Move", "Left"));

    export/**
           * The "move right" command.
           *
           * @category Interaction
           * @since 1.0.0
           */
    const Right: unique symbol = Symbol.for(GetBuiltInKey("Move", "Right"));

    export/**
           * The "page up" command.
           *
           * @category Interaction
           * @since 1.0.0
           */
    const PageUp: unique symbol = Symbol.for(GetBuiltInKey("Move", "PageUp"));

    export/**
           * The "page down" command.
           *
           * @category Interaction
           * @since 1.0.0
           */
    const PageDown: unique symbol = Symbol.for(GetBuiltInKey("Move", "PageDown"));

    export/**
           * The "go home" command.
           *
           * @category Interaction
           * @since 1.0.0
           */
    const Home: unique symbol = Symbol.for(GetBuiltInKey("Move", "Home"));

    export/**
           * The "go to end" command.
           *
           * @category Interaction
           * @since 1.0.0
           */
    const End: unique symbol = Symbol.for(GetBuiltInKey("Move", "End"));

    export/**
           * The command to accept, confirm, or commit something (or *to* something).
           *
           * @category Interaction
           * @since 1.0.0
           */
    const Commit: unique symbol = Symbol.for(GetBuiltInKey("Commit"));
}

export/**
       * The identifiers of the built-in commands supplied by `InteractionProvider`.
       *
       * @category Interaction
       * @since 1.0.0
       */
const BuiltIn =
    Object.freeze({
        Commit: BuiltInCommand.Commit,
        Focus:
        {
            First: BuiltInCommand.First,
            Last: BuiltInCommand.Last,
            Next: BuiltInCommand.Next,
            Previous: BuiltInCommand.Previous
        },
        Move:
        {
            Down: BuiltInCommand.Down,
            Left: BuiltInCommand.Left,
            Right: BuiltInCommand.Right,
            Up: BuiltInCommand.Up,

            End: BuiltInCommand.End,
            Home: BuiltInCommand.Home,

            PageDown: BuiltInCommand.PageDown,
            PageUp: BuiltInCommand.PageUp
        }
    } as const);

type LeafValues<A> = A extends object
    ? { [ Key in keyof A ]: LeafValues<A[Key]>; }[keyof A]
    : A;

/** {@inheritDoc BuiltIn} */
export type BuiltIn = LeafValues<typeof BuiltIn>;

/**
 * An instance of a command that is executed.
 *
 * @category Interaction
 * @since 1.0.0
 */
export interface CommandEvent<Data = unknown>
{
    readonly Command: CommandId;
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
    readonly Command: CommandId;
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
export interface RegisteredCommand extends Required<CommandRegistration<unknown>>
{
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

export/**
       * Get a `CommandId` as a string, converting `BuiltIn` symbols to their respective keys.
       *
       * @category Interaction
       * @since 1.0.0
       */
const CommandIdToString = (Arg: CommandId) =>
{
    if (Predicate.isString(Arg))
    {
        return Arg;
    }
    else
    {
        return Symbol.keyFor(Arg) ?? "UNKNOWN BUILT-IN COMMAND";
    }
};

/**
 * Stores hierarchical command handlers, routed input handlers, and key
 * bindings.
 *
 * @category Interaction
 * @since 1.0.0
 */
export class CommandRegistry
{
    private readonly Commands: MutableHashMap.MutableHashMap<string, Array<RegisteredCommand>> =
        MutableHashMap.empty<string, Array<RegisteredCommand>>();

    private readonly InputHandlers: Array<RegisteredInputHandler> = [ ];

    private readonly Listeners: MutableHashSet.MutableHashSet<() => void> =
        MutableHashSet.empty<() => void>();

    private readonly Scopes: MutableHashMap.MutableHashMap<string, RegisteredCommandScope> =
        MutableHashMap.empty<string, RegisteredCommandScope>();

    private readonly Shortcuts: Array<InternalShortcut> = [ ];
    private Sequence: number = 0;
    private Version: number = 0;

    private readonly ShortcutGroups: MutableHashSet.MutableHashSet<GroupShortcut> =
        MutableHashSet.empty<GroupShortcut>();

    public constructor()
    {
        MutableHashMap.set(
            this.Scopes,
            TypeId,
            {
                Id: TypeId,
                ParentId: TypeId
            });
    }

    public readonly GetSnapshot = (): number => this.Version;

    public readonly Subscribe = (Listener: () => void): (() => void) =>
    {
        MutableHashSet.add(this.Listeners, Listener);
        return () => MutableHashSet.remove(this.Listeners, Listener);
    };

    public RegisterScope(Id: string, ParentId: string = TypeId): () => void
    {
        if (MutableHashMap.has(this.Scopes, Id))
        {
            throw new Error(`A command scope with the id "${ Id }" is already registered.`);
        }

        MutableHashMap.set(this.Scopes, Id, { Id, ParentId });

        this.Notify();
        return () =>
        {
            MutableHashMap.remove(this.Scopes, Id);
            this.Notify();
        };
    }

    public Register<Data = unknown>(
        Registration: CommandRegistration<Data>
    ): () => void
    {
        const Registered: RegisteredCommand =
            {
                Command: Registration.Command,
                Enabled: Registration.Enabled ?? true,
                Handler: (Event: CommandEvent<unknown>) =>
                    Registration.Handler(Event as CommandEvent<Data>),
                Priority: Registration.Priority ?? 0,
                ScopeId: Registration.ScopeId,
                Sequence: this.Sequence++
            };
        const Existing = MutableHashMap.get(this.Commands, Registration.Command).valueOrUndefined ?? [ ];
        Existing.push(Registered);
        MutableHashMap.set(this.Commands, Registration.Command, Existing);
        this.Notify();

        return () =>
        {
            Option.map(
                MutableHashMap.get(this.Commands, Registration.Command),
                (Commands: Array<RegisteredCommand>) =>
                {
                    const Index = Commands.indexOf(Registered);
                    if (Index !== -1)
                    {
                        Commands.splice(Index, 1);
                        if (Commands.length === 0)
                        {
                            MutableHashMap.remove(this.Commands, Registration.Command);
                        }

                        this.Notify();
                    }
                }
            );
        };
    }

    public RegisterShortcut(Registration: ShortcutRegistration): () => void
    {
        // eslint-disable-next-line no-console
        console.log(`Registering shortcut with ID ${ CommandIdToString(Registration.Command) }.`);
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

    public RegisterShortcutGroup(GroupRegistration: GroupShortcut): () => void
    {
        MutableHashSet.add(this.ShortcutGroups, GroupRegistration);
        this.Notify();

        return () =>
        {
            MutableHashSet.remove(this.ShortcutGroups, GroupRegistration);
            this.Notify();
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
        Command: CommandId,
        Options: ExecuteCommandOptions<Data> = { }
    ): boolean
    {
        const StartScopeId = Options.StartScopeId ?? TypeId;
        for (const ScopeId of this.GetScopePath(StartScopeId))
        {
            const RegistrationsOpt = Option.map(
                MutableHashMap.get(this.Commands, Command),
                Function.flow(
                    Array.filter((Registration: RegisteredCommand) =>
                        Registration.ScopeId === ScopeId
                        && Registration.Enabled !== false
                    ),
                    Array.sort((Left: RegisteredCommand, Right: RegisteredCommand) =>
                        Number.sign((Right.Priority ?? 0) - (Left.Priority ?? 0)
                        || Right.Sequence - Left.Sequence)
                    )
                )
            );

            if (Option.isSome(RegistrationsOpt))
            {
                for (const Registration of RegistrationsOpt.value)
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
            if (Option.isSome(Chord))
            {
                const Shortcuts = this.Shortcuts
                    .filter((Shortcut: InternalShortcut) =>
                        Shortcut.ScopeId === ScopeId
                        && Shortcut.Enabled
                        && Shortcut.Keys.includes(Chord.value)
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
        return [ ...this.Shortcuts ];
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

    public static IsShortcutInGroup(ScopeId: string, Id: CommandId): (Shortcut: RegisteredShortcut) => boolean
    {
        return (Shortcut: RegisteredShortcut) => Shortcut.Command === Id && Shortcut.ScopeId === ScopeId;
    }

    public GetShortcutGroups(StartScopeId: string = TypeId): ReadonlyArray<GroupShortcut>
    {
        const Shortcuts = this.GetShortcuts(StartScopeId);

        return Array.filter(
            this.ShortcutGroups,
            (Group: GroupShortcut) =>
                Array.some(
                    Group.Commands,
                    (Id: CommandId) =>
                        Array.some(
                            Shortcuts,
                            CommandRegistry.IsShortcutInGroup(Group.ScopeId, Id)))
        );
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
            Current =
                MutableHashMap.get(this.Scopes, Current).valueOrUndefined?.ParentId ?? TypeId;
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
    Id,
    children
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

/**
 * An identifier of a command.  Built-in commands are specified as `unique symbol`s.
 *
 * @category Interaction
 * @since 1.0.0
 */
export type CommandId = BuiltIn | string;

export/**
       * Registers a handler for a command in the nearest command scope.
       *
       * @category Interaction
       * @since 1.0.0
       */
const useCommand = <Data = unknown>(
    Command: CommandId,
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
