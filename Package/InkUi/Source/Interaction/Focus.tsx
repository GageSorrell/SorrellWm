/**
 * Ink UI component for focus.
 *
 * @module @sorrell/ink-ui/Interaction/Focus
 *
 * @file      Focus.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import {
    Array,
    MutableHashMap,
    MutableHashSet,
    Number,
    Option,
    Struct,
    pipe
} from "effect";
import { CommandScopeContext, FocusScopeContext, TypeId, UseInteraction } from "./Context.js";

/**
 * The argument used to define a focusable region of the application.
 *
 * @category Interaction
 * @since 1.0.0
 */
export interface FocusRegistration
{
    readonly AutoFocus?: boolean;
    readonly CommandScopeId?: string;
    readonly Disabled?: boolean;
    readonly Id: string;
    readonly OnBlur?: (() => void) | undefined;
    readonly OnFocus?: (() => void) | undefined;
    readonly Order?: number;
    readonly ScopeId: string;
}

/**
 * The argument used to define a scope which allows the FocusManager
 * to decide which `FocusRegistration`s to consider when routing input.
 *
 * @category Interaction
 * @since 1.0.0
 */
export interface FocusScopeRegistration
{
    readonly Active?: boolean;
    readonly Id: string;
    readonly ParentId: string;
    readonly Trap?: boolean;
    readonly Wrap?: boolean | undefined;
}

interface RegisteredFocus extends FocusRegistration
{
    readonly Sequence: number;
}

interface RegisteredFocusScope extends FocusScopeRegistration
{
    readonly Sequence: number;
}

/**
 * Stores the focus tree and performs ordered, scope-aware focus traversal.
 *
 * @category Interaction
 * @since 1.0.0
 */
export class FocusRegistry
{
    private readonly Entries: MutableHashMap.MutableHashMap<string, RegisteredFocus> =
        MutableHashMap.empty<string, RegisteredFocus>();

    private readonly Listeners: MutableHashSet.MutableHashSet<() => void> =
        MutableHashSet.empty<() => void>();

    private readonly Scopes: MutableHashMap.MutableHashMap<string, RegisteredFocusScope>;

    private readonly RootScope: RegisteredFocusScope;
    private CurrentId: Option.Option<string> = Option.none();
    private InitialFocus: Option.Option<string>;
    private InitialFocusApplied: boolean = false;
    private Sequence: number = 0;
    private Version: number = 0;

    public constructor(InitialFocus?: string, Wrap: boolean = true)
    {
        this.InitialFocus = Option.fromUndefinedOr(InitialFocus);
        this.Scopes = MutableHashMap.empty<string, RegisteredFocusScope>();
        this.RootScope =
            {
                Active: true,
                Id: TypeId,
                ParentId: TypeId,
                Sequence: this.Sequence++,
                Trap: false,
                Wrap
            };

        MutableHashMap.set(this.Scopes, TypeId, this.RootScope);
    }

    public readonly GetSnapshot = (): number => this.Version;

    public readonly Subscribe = (Listener: () => void): (() => void) =>
    {
        MutableHashSet.add(this.Listeners, Listener);
        return () => MutableHashSet.remove(this.Listeners, Listener);
    };

    public GetFocusedId(): Option.Option<string>
    {
        return this.CurrentId;
    }

    public GetFocusedCommandScopeId(): string
    {
        return pipe(
            Option.flatMap(
                this.CurrentId,
                (CurrentId: string) => MutableHashMap.get(this.Entries, CurrentId)
            ),
            Option.map(Struct.get("CommandScopeId")),
            Option.getOrUndefined,
            (Value: string | undefined) => Value ?? TypeId
        );
        // if (Option.isSome(this.CurrentId))
        // {
        //     return Option.getOrUndefined(
        //     ) ?? TypeId;
        // }

        // return TypeId;
    }

    public SetInitialFocus(Id: string | undefined): void
    {
        if (Id !== this.InitialFocus.valueOrUndefined)
        {
            this.InitialFocusApplied = false;
        }
        this.InitialFocus = Option.fromUndefinedOr(Id);
        this.TryInitialFocus();
    }

    public SetWrap(Wrap: boolean): void
    {
        MutableHashMap.set(this.Scopes, TypeId, {
            ...this.RootScope,
            Wrap
        });

        this.Notify();
    }

    public RegisterScope(Scope: FocusScopeRegistration): () => void
    {
        if (MutableHashMap.has(this.Scopes, Scope.Id))
        {
            throw new Error(`A focus scope with the id "${ Scope.Id }" is already registered.`);
        }

        MutableHashMap.set(
            this.Scopes,
            Scope.Id,
            {
                ...Scope,
                Active: Scope.Active ?? true,
                Sequence: this.Sequence++,
                Trap: Scope.Trap ?? false
            });

        this.EnsureValidFocus();
        this.Notify();

        return () =>
        {
            MutableHashMap.remove(this.Scopes, Scope.Id);
            this.EnsureValidFocus();
            this.Notify();
        };
    }

    public UpdateScope(
        Id: string,
        Update: Pick<FocusScopeRegistration, "Active" | "Trap" | "Wrap">
    ): void
    {
        const Scope = MutableHashMap.get(this.Scopes, Id);
        if (Option.isNone(Scope))
        {
            return;
        }

        MutableHashMap.set(
            this.Scopes,
            Id,
            {
                ...Scope.value,
                Active: Update.Active ?? true,
                Trap: Update.Trap ?? false,
                Wrap: Update.Wrap
            });
        this.EnsureValidFocus();
        this.Notify();
    }

    public Register(Focus: FocusRegistration): () => void
    {
        if (MutableHashMap.has(this.Entries, Focus.Id))
        {
            throw new Error(`A focusable with the id "${ Focus.Id }" is already registered.`);
        }

        MutableHashMap.set(
            this.Entries,
            Focus.Id,
            {
                ...Focus,
                AutoFocus: Focus.AutoFocus ?? false,
                Disabled: Focus.Disabled ?? false,
                Order: Focus.Order ?? 0,
                Sequence: this.Sequence++
            });

        if (Focus.Id === this.InitialFocus.valueOrUndefined && !this.InitialFocusApplied)
        {
            this.TryInitialFocus();
        }
        else if (
            (Focus.AutoFocus === true && this.CurrentId === undefined)
            || this.CurrentId === undefined
        )
        {
            this.Focus(Focus.Id);
        }
        this.Notify();

        return () =>
        {
            const WasFocused = this.CurrentId.valueOrUndefined === Focus.Id;
            if (WasFocused)
            {
                const LastFocusedElement = MutableHashMap.get(this.Entries, Focus.Id);
                if (Option.isSome(LastFocusedElement))
                {
                    LastFocusedElement.value.OnBlur?.();
                }

                this.CurrentId = Option.none();
            }

            MutableHashMap.remove(this.Entries, Focus.Id);
            this.EnsureValidFocus();
            this.Notify();
        };
    }

    public Update(
        Id: string,
        Update: Pick<FocusRegistration, "Disabled" | "OnBlur" | "OnFocus" | "Order">
    ): void
    {
        const Focus = MutableHashMap.get(this.Entries, Id);
        Option.map(Focus, (TheFocus: RegisteredFocus) =>
        {
            MutableHashMap.set(
                this.Entries,
                Id,
                {
                    ...TheFocus,
                    Disabled: Update.Disabled ?? false,
                    OnBlur: Update.OnBlur,
                    OnFocus: Update.OnFocus,
                    Order: Update.Order ?? 0
                });

            this.EnsureValidFocus();
            this.Notify();
        });
    }

    public CanFocus(Id: string): boolean
    {
        const Focus = MutableHashMap.get(this.Entries, Id);
        return Focus.valueOrUndefined !== undefined
            && Focus.value.Disabled !== true
            && this.IsScopeActive(Focus.value.ScopeId);
    }

    public Focus(Id: string): boolean
    {
        if (!this.CanFocus(Id))
        {
            return false;
        }
        if (this.CurrentId.valueOrUndefined === Id)
        {
            return true;
        }

        // const Previous = this.CurrentId === undefined
        //     ? undefined
        //     : MutableHashMap.get(this.Entries, this.CurrentId.valueOrUndefined).valueOrUndefined;

        const Previous = Option.flatMap(
            this.CurrentId,
            (CurrentId: string) => MutableHashMap.get(this.Entries, CurrentId)
        );

        const Next = MutableHashMap.get(this.Entries, Id);

        Previous.valueOrUndefined?.OnBlur?.();
        this.CurrentId = Option.some(Id);

        if (Id === this.InitialFocus.valueOrUndefined)
        {
            this.InitialFocusApplied = true;
        }

        Next.valueOrUndefined?.OnFocus?.();
        this.Notify();
        return true;
    }

    public Blur(): void
    {
        Option.map(this.CurrentId, (CurrentId: string) =>
        {
            MutableHashMap.get(
                this.Entries,
                CurrentId
            ).valueOrUndefined?.OnBlur?.();
            this.CurrentId = Option.none();
            this.Notify();
        });
    }

    public FocusFirst(ScopeId?: string): boolean
    {
        const First = this.GetCandidates(ScopeId)[0];
        return First === undefined ? false : this.Focus(First.Id);
    }

    public FocusLast(ScopeId?: string): boolean
    {
        const Candidates = this.GetCandidates(ScopeId);
        const Last = Candidates[Candidates.length - 1];
        return Last === undefined ? false : this.Focus(Last.Id);
    }

    public FocusNext(): boolean
    {
        return this.Move(1);
    }

    public FocusPrevious(): boolean
    {
        return this.Move(-1);
    }

    /** Whether the current focus belongs to this scope or one of its descendants. */
    public IsFocusWithin(ScopeId: string): boolean
    {
        const Current = Option.flatMap(
            this.CurrentId,
            (CurrentId: string) => MutableHashMap.get(this.Entries, CurrentId)
        );
        return Option.isSome(Current)
            && this.IsScopeDescendant(Current.value.ScopeId, ScopeId);
    }

    private Move(Direction: 1 | -1): boolean
    {
        const Current = Option.flatMap(
            this.CurrentId,
            (CurrentId: string) => MutableHashMap.get(this.Entries, CurrentId)
        );

        const Trap = Option.flatMap(
            Current,
            (TheCurrent: RegisteredFocus) => this.FindNearestTrap(TheCurrent.ScopeId)
        );
        const Candidates = this.GetCandidates(Trap.valueOrUndefined?.Id);

        if (Candidates.length === 0)
        {
            return false;
        }

        if (Option.isNone(Current))
        {
            const Initial = Direction === 1
                ? Candidates[0]
                : Candidates[Candidates.length - 1];

            return Initial === undefined ? false : this.Focus(Initial.Id);
        }

        const CurrentIndex = pipe(
            Candidates,
            Array.findFirstIndex(
                (Element: RegisteredFocus, _: number) => Element.Id === Current.value.Id
            ),
            Option.getOrElse(() => -1)
        );

        if (CurrentIndex === -1)
        {
            const Initial = Direction === 1
                ? Candidates[0]
                : Candidates[Candidates.length - 1];
            return Initial === undefined ? false : this.Focus(Initial.Id);
        }

        const NextIndex = CurrentIndex + Direction;
        if (NextIndex >= 0 && NextIndex < Candidates.length)
        {
            return this.Focus(Candidates[NextIndex]!.Id);
        }

        if (!this.GetWrap(Current.value.ScopeId))
        {
            return false;
        }
        return this.Focus(Direction === 1
            ? Candidates[0]!.Id
            : Candidates[Candidates.length - 1]!.Id);
    }

    private GetCandidates(ScopeId?: string): Array<RegisteredFocus>
    {
        return pipe(
            [ ...MutableHashMap.values(this.Entries) ],
            Array.filter((Focus: RegisteredFocus) =>
                this.CanFocus(Focus.Id) &&
                (
                    ScopeId === undefined ||
                    this.IsScopeDescendant(Focus.ScopeId, ScopeId)
                )),
            Array.sort((Left: RegisteredFocus, Right: RegisteredFocus) =>
                Number.sign((Left.Order ?? 0) - (Right.Order ?? 0)
                || Left.Sequence - Right.Sequence)
            )
        );
    }

    private IsScopeActive(ScopeId: string): boolean
    {
        let Current: Option.Option<string> = Option.some(ScopeId);
        const Visited = MutableHashSet.empty<string>();
        while (Option.isSome(Current) && !MutableHashSet.has(Visited, Current.valueOrUndefined))
        {
            MutableHashSet.add(Visited, Current.value);
            const Scope = MutableHashMap.get(this.Scopes, Current.value);
            if (Option.isNone(Scope) || Scope.value.Active === false)
            {
                return false;
            }
            if (Scope.value.Id === TypeId)
            {
                return true;
            }
            Current = Option.some(Scope.value.ParentId);
        }
        return false;
    }

    private IsScopeDescendant(ScopeId: string, AncestorId: string): boolean
    {
        let Current: Option.Option<string> = Option.some(ScopeId);
        const Visited = MutableHashSet.empty<string>();
        while (Option.isSome(Current) && !MutableHashSet.has(Visited, Current.valueOrUndefined))
        {
            if (Current.value === AncestorId)
            {
                return true;
            }
            MutableHashSet.add(Visited, Current.value);
            Current = pipe(
                Option.flatMap(
                    Current,
                    (CurrentVal: string) => MutableHashMap.get(this.Scopes, CurrentVal)
                ),
                Option.map(Struct.get("ParentId"))
            );
        }
        return false;
    }

    private FindNearestTrap(ScopeId: string): Option.Option<RegisteredFocusScope>
    {
        let Current: Option.Option<string> = Option.some(ScopeId);
        const Visited = MutableHashSet.empty<string>();
        while (Option.isSome(Current) && !MutableHashSet.has(Visited, Current.valueOrUndefined))
        {
            MutableHashSet.add(Visited, Current.value);
            const Scope = MutableHashMap.get(this.Scopes, Current.value);

            if (Option.isNone(Scope))
            {
                return Option.none();
            }
            if (Scope.value.Trap === true)
            {
                return Scope;
            }
            if (Scope.value.Id === TypeId)
            {
                return Option.none();
            }

            Current = Option.some(Scope.value.ParentId);
        }

        return Option.none();
    }

    private GetWrap(ScopeId: string): boolean
    {
        let Current: Option.Option<string> = Option.some(ScopeId);
        const Visited = MutableHashSet.empty<string>();
        while (Option.isSome(Current) && !MutableHashSet.has(Visited, Current.valueOrUndefined))
        {
            MutableHashSet.add(Visited, Current.value);
            const Scope = MutableHashMap.get(this.Scopes, Current.value);
            if (Option.isNone(Scope))
            {
                return true;
            }
            if (Scope.value.Wrap !== undefined)
            {
                return Scope.value.Wrap;
            }
            Current = Option.some(Scope.value.ParentId);
        }
        return true;
    }

    private EnsureValidFocus(): void
    {
        if (this.TryInitialFocus())
        {
            return;
        }
        if (Option.isSome(this.CurrentId) && this.CanFocus(this.CurrentId.value))
        {
            return;
        }

        if (Option.isSome(this.CurrentId))
        {
            MutableHashMap.get(this.Entries, this.CurrentId.value).valueOrUndefined?.OnBlur?.();
            this.CurrentId = Option.none();
        }

        this.FocusFirst();
    }

    private TryInitialFocus(): boolean
    {
        if (
            this.InitialFocusApplied
            || this.InitialFocus === undefined
            || Option.isNone(this.InitialFocus)
            || !this.CanFocus(this.InitialFocus.value)
        )
        {
            return false;
        }

        return this.Focus(this.InitialFocus.value);
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

/** {@inheritDoc FocusScope} */
export interface FocusScopeProps extends React.PropsWithChildren
{
    readonly Active?: boolean;
    readonly AutoFocus?: boolean;
    readonly Id?: string;
    readonly RestoreFocus?: boolean;
    readonly Trap?: boolean;
    readonly Wrap?: boolean | undefined;
}

export/**
       * Groups focusable descendants and optionally traps, restores, or wraps focus.
       *
       * @category Interaction
       * @since 1.0.0
       */
const FocusScope = ({
    Active = true,
    AutoFocus = false,
    children,
    Id,
    RestoreFocus = true,
    Trap = false,
    Wrap
}: FocusScopeProps): React.ReactNode =>
{
    const { Commands, Focus } = UseInteraction();
    const ParentFocusScopeId = React.useContext(FocusScopeContext);
    const ParentCommandScopeId = React.useContext(CommandScopeContext);
    const GeneratedId = React.useId();
    const ScopeId = Id ?? `focus-scope-${ GeneratedId }`;
    const CommandScopeId = `command-${ ScopeId }`;
    const MountOptions = React.useRef({
        Active,
        AutoFocus,
        RestoreFocus,
        Trap,
        Wrap
    }).current;

    React.useLayoutEffect(() =>
    {
        const PreviousFocus = Focus.GetFocusedId();
        const DisposeCommandScope = Commands.RegisterScope(
            CommandScopeId,
            ParentCommandScopeId
        );
        const DisposeFocusScope = Focus.RegisterScope({
            Active: MountOptions.Active,
            Id: ScopeId,
            ParentId: ParentFocusScopeId,
            Trap: MountOptions.Trap,
            Wrap: MountOptions.Wrap
        });
        if (MountOptions.AutoFocus)
        {
            Focus.FocusFirst(ScopeId);
        }

        return () =>
        {
            DisposeFocusScope();
            DisposeCommandScope();
            if (MountOptions.RestoreFocus && Option.isSome(PreviousFocus))
            {
                Focus.Focus(PreviousFocus.value);
            }
        };
    }, [
        CommandScopeId,
        Commands,
        Focus,
        MountOptions,
        ParentCommandScopeId,
        ParentFocusScopeId,
        ScopeId
    ]);

    React.useLayoutEffect(() =>
    {
        Focus.UpdateScope(ScopeId, { Active, Trap, Wrap });
    }, [ Active, Focus, ScopeId, Trap, Wrap ]);

    return (
        <CommandScopeContext.Provider value={ CommandScopeId }>
            <FocusScopeContext.Provider value={ ScopeId }>
                { children }
            </FocusScopeContext.Provider>
        </CommandScopeContext.Provider>
    );
};

/** {@inheritDoc useFocusable} */
export interface UseFocusableOptions
{
    readonly AutoFocus?: boolean;
    readonly CommandScopeId?: string;
    readonly Disabled?: boolean;
    readonly Id?: string;
    readonly OnBlur?: (() => void) | undefined;
    readonly OnFocus?: (() => void) | undefined;
    readonly Order?: number;
}

/**
 * Imperative handle given by {@link useFocusable}.
 *
 * @category Interaction
 * @since 1.0.0
 */
export interface FocusableState
{
    readonly Blur: () => void;
    readonly Focus: () => boolean;
    readonly Focused: boolean;
    readonly Id: string;
}

const UseFocusableRegistration = ({
    AutoFocus = false,
    CommandScopeId,
    Disabled = false,
    Id,
    OnBlur,
    OnFocus,
    Order = 0
}: UseFocusableOptions): FocusableState =>
{
    const { Focus } = UseInteraction();
    const ScopeId = React.useContext(FocusScopeContext);
    const CurrentCommandScopeId = React.useContext(CommandScopeContext);
    const GeneratedId = React.useId();
    const FocusId = Id ?? `focusable-${ GeneratedId }`;
    const MountOptions = React.useRef({
        AutoFocus,
        CommandScopeId,
        CurrentCommandScopeId,
        Disabled,
        OnBlur,
        OnFocus,
        Order,
        ScopeId
    }).current;

    React.useLayoutEffect(() => Focus.Register({
        AutoFocus: MountOptions.AutoFocus,
        CommandScopeId: MountOptions.CommandScopeId
            ?? MountOptions.CurrentCommandScopeId,
        Disabled: MountOptions.Disabled,
        Id: FocusId,
        OnBlur: MountOptions.OnBlur,
        OnFocus: MountOptions.OnFocus,
        Order: MountOptions.Order,
        ScopeId: MountOptions.ScopeId
    }), [
        Focus,
        FocusId,
        MountOptions
    ]);

    React.useLayoutEffect(() =>
    {
        Focus.Update(FocusId, {
            Disabled,
            OnBlur,
            OnFocus,
            Order
        });
    }, [ Disabled, Focus, FocusId, OnBlur, OnFocus, Order ]);

    React.useSyncExternalStore(
        Focus.Subscribe,
        Focus.GetSnapshot,
        Focus.GetSnapshot
    );

    return {
        Blur: () => Focus.Blur(),
        Focus: () => Focus.Focus(FocusId),
        Focused: Focus.GetFocusedId().valueOrUndefined === FocusId,
        Id: FocusId
    };
};

export/**
       * Registers a custom component with the nearest focus scope.
       *
       * @category Interaction
       * @since 1.0.0
       */
const useFocusable = (
    Options: UseFocusableOptions = { }
): FocusableState => UseFocusableRegistration(Options);

/** {@inheritDoc Focusable} */
export interface FocusableProps extends UseFocusableOptions
{
    readonly children?:
        | React.ReactNode
        | ((State: FocusableState) => React.ReactNode);
}

export/**
       * Registers its render-prop child as a focus target and command target.
       *
       * @category Interaction
       * @since 1.0.0
       */
const Focusable = ({
    children,
    Id,
    ...Options
}: FocusableProps): React.ReactNode =>
{
    const { Commands } = UseInteraction();
    const ParentCommandScopeId = React.useContext(CommandScopeContext);
    const GeneratedId = React.useId();
    const FocusId = Id ?? `focusable-${ GeneratedId }`;
    const CommandScopeId = `command-focusable-${ FocusId }`;

    React.useLayoutEffect(
        () => Commands.RegisterScope(CommandScopeId, ParentCommandScopeId),
        [ CommandScopeId, Commands, ParentCommandScopeId ]
    );

    const State = UseFocusableRegistration({
        ...Options,
        CommandScopeId,
        Id: FocusId
    });
    const Content = typeof children === "function"
        ? children(State)
        : children;

    return (
        <CommandScopeContext.Provider value={ CommandScopeId }>
            { Content }
        </CommandScopeContext.Provider>
    );
};

/** {@inheritDoc useFocusManager} */
export interface FocusManager
{
    readonly Blur: () => void;
    readonly Focus: (Id: string) => boolean;
    readonly FocusFirst: (ScopeId?: string) => boolean;
    readonly FocusLast: (ScopeId?: string) => boolean;
    readonly FocusNext: () => boolean;
    readonly FocusPrevious: () => boolean;
    readonly FocusedId: Option.Option<string>;
    readonly IsFocusWithin: (ScopeId: string) => boolean;
}

export/**
       * Returns programmatic focus controls and the currently focused identifier.
       *
       * @category Interaction
       * @since 1.0.0
       */
const useFocusManager = (): FocusManager =>
{
    const { Focus } = UseInteraction();
    React.useSyncExternalStore(
        Focus.Subscribe,
        Focus.GetSnapshot,
        Focus.GetSnapshot
    );
    return {
        Blur: () => Focus.Blur(),
        Focus: (Id: string) => Focus.Focus(Id),
        FocusFirst: (ScopeId?: string) => Focus.FocusFirst(ScopeId),
        FocusLast: (ScopeId?: string) => Focus.FocusLast(ScopeId),
        FocusNext: () => Focus.FocusNext(),
        FocusPrevious: () => Focus.FocusPrevious(),
        FocusedId: Focus.GetFocusedId(),
        IsFocusWithin: (ScopeId: string) => Focus.IsFocusWithin(ScopeId)
    };
};
