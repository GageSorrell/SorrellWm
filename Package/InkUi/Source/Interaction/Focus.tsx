/**
 *
 *
 * @module @sorrell/ink-ui/Interaction/Focus
 *
 * @file      Focus.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { CommandScopeContext, FocusScopeContext, TypeId, UseInteraction } from "./Context.tsx";

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
    private readonly Entries = new Map<string, RegisteredFocus>();
    private readonly Listeners = new Set<() => void>();
    private readonly RootScope: RegisteredFocusScope;
    private readonly Scopes = new Map<string, RegisteredFocusScope>();
    private CurrentId: string | undefined;
    private InitialFocus: string | undefined;
    private InitialFocusApplied: boolean = false;
    private Sequence: number = 0;
    private Version: number = 0;

    public constructor(InitialFocus?: string, Wrap = true)
    {
        this.InitialFocus = InitialFocus;
        this.RootScope =
            {
                Active: true,
                Id: TypeId,
                ParentId: TypeId,
                Sequence: this.Sequence++,
                Trap: false,
                Wrap
            };
        this.Scopes.set(TypeId, this.RootScope);
    }

    public readonly GetSnapshot = (): number => this.Version;

    public readonly Subscribe = (Listener: () => void): (() => void) =>
    {
        this.Listeners.add(Listener);
        return () => this.Listeners.delete(Listener);
    };

    public GetFocusedId(): string | undefined
    {
        return this.CurrentId;
    }

    public GetFocusedCommandScopeId(): string
    {
        const Current = this.CurrentId === undefined
            ? undefined
            : this.Entries.get(this.CurrentId);
        return Current?.CommandScopeId ?? TypeId;
    }

    public SetInitialFocus(Id: string | undefined): void
    {
        if (Id !== this.InitialFocus)
        {
            this.InitialFocusApplied = false;
        }
        this.InitialFocus = Id;
        this.TryInitialFocus();
    }

    public SetWrap(Wrap: boolean): void
    {
        this.Scopes.set(TypeId, {
            ...this.RootScope,
            Wrap
        });
        this.Notify();
    }

    public RegisterScope(Scope: FocusScopeRegistration): () => void
    {
        if (this.Scopes.has(Scope.Id))
        {
            throw new Error(`A focus scope with the id "${ Scope.Id }" is already registered.`);
        }

        this.Scopes.set(Scope.Id, {
            ...Scope,
            Active: Scope.Active ?? true,
            Sequence: this.Sequence++,
            Trap: Scope.Trap ?? false
        });
        this.EnsureValidFocus();
        this.Notify();

        return () =>
        {
            this.Scopes.delete(Scope.Id);
            this.EnsureValidFocus();
            this.Notify();
        };
    }

    public UpdateScope(
        Id: string,
        Update: Pick<FocusScopeRegistration, "Active" | "Trap" | "Wrap">
    ): void
    {
        const Scope = this.Scopes.get(Id);
        if (Scope === undefined)
        {
            return;
        }

        this.Scopes.set(Id, {
            ...Scope,
            Active: Update.Active ?? true,
            Trap: Update.Trap ?? false,
            Wrap: Update.Wrap
        });
        this.EnsureValidFocus();
        this.Notify();
    }

    public Register(Focus: FocusRegistration): () => void
    {
        if (this.Entries.has(Focus.Id))
        {
            throw new Error(`A focusable with the id "${ Focus.Id }" is already registered.`);
        }

        this.Entries.set(Focus.Id, {
            ...Focus,
            AutoFocus: Focus.AutoFocus ?? false,
            Disabled: Focus.Disabled ?? false,
            Order: Focus.Order ?? 0,
            Sequence: this.Sequence++
        });

        if (Focus.Id === this.InitialFocus && !this.InitialFocusApplied)
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
            const WasFocused = this.CurrentId === Focus.Id;
            if (WasFocused)
            {
                this.Entries.get(Focus.Id)?.OnBlur?.();
                this.CurrentId = undefined;
            }
            this.Entries.delete(Focus.Id);
            this.EnsureValidFocus();
            this.Notify();
        };
    }

    public Update(
        Id: string,
        Update: Pick<FocusRegistration, "Disabled" | "OnBlur" | "OnFocus" | "Order">
    ): void
    {
        const Focus = this.Entries.get(Id);
        if (Focus === undefined)
        {
            return;
        }

        this.Entries.set(Id, {
            ...Focus,
            Disabled: Update.Disabled ?? false,
            OnBlur: Update.OnBlur,
            OnFocus: Update.OnFocus,
            Order: Update.Order ?? 0
        });
        this.EnsureValidFocus();
        this.Notify();
    }

    public CanFocus(Id: string): boolean
    {
        const Focus = this.Entries.get(Id);
        return Focus !== undefined
            && Focus.Disabled !== true
            && this.IsScopeActive(Focus.ScopeId);
    }

    public Focus(Id: string): boolean
    {
        if (!this.CanFocus(Id))
        {
            return false;
        }
        if (this.CurrentId === Id)
        {
            return true;
        }

        const Previous = this.CurrentId === undefined
            ? undefined
            : this.Entries.get(this.CurrentId);
        const Next = this.Entries.get(Id);
        Previous?.OnBlur?.();
        this.CurrentId = Id;
        if (Id === this.InitialFocus)
        {
            this.InitialFocusApplied = true;
        }
        Next?.OnFocus?.();
        this.Notify();
        return true;
    }

    public Blur(): void
    {
        if (this.CurrentId === undefined)
        {
            return;
        }

        this.Entries.get(this.CurrentId)?.OnBlur?.();
        this.CurrentId = undefined;
        this.Notify();
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

    private Move(Direction: 1 | -1): boolean
    {
        const Current = this.CurrentId === undefined
            ? undefined
            : this.Entries.get(this.CurrentId);
        const Trap = Current === undefined
            ? undefined
            : this.FindNearestTrap(Current.ScopeId);
        const Candidates = this.GetCandidates(Trap?.Id);
        if (Candidates.length === 0)
        {
            return false;
        }

        if (Current === undefined)
        {
            const Initial = Direction === 1
                ? Candidates[0]
                : Candidates[Candidates.length - 1];
            return Initial === undefined ? false : this.Focus(Initial.Id);
        }

        const CurrentIndex = Candidates.findIndex(
            (Candidate: RegisteredFocus) => Candidate.Id === Current.Id
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

        const Wrap = this.GetWrap(Current.ScopeId);
        if (!Wrap)
        {
            return false;
        }
        return this.Focus(Direction === 1
            ? Candidates[0]!.Id
            : Candidates[Candidates.length - 1]!.Id);
    }

    private GetCandidates(ScopeId?: string): Array<RegisteredFocus>
    {
        return [ ...this.Entries.values() ]
            .filter((Focus: RegisteredFocus) =>
                this.CanFocus(Focus.Id)
                && (
                    ScopeId === undefined
                    || this.IsScopeDescendant(Focus.ScopeId, ScopeId)
                ))
            .sort((Left: RegisteredFocus, Right: RegisteredFocus) =>
                (Left.Order ?? 0) - (Right.Order ?? 0)
                || Left.Sequence - Right.Sequence
            );
    }

    private IsScopeActive(ScopeId: string): boolean
    {
        let Current: string | undefined = ScopeId;
        const Visited = new Set<string>();
        while (Current !== undefined && !Visited.has(Current))
        {
            Visited.add(Current);
            const Scope = this.Scopes.get(Current);
            if (Scope === undefined || Scope.Active === false)
            {
                return false;
            }
            if (Scope.Id === TypeId)
            {
                return true;
            }
            Current = Scope.ParentId;
        }
        return false;
    }

    private IsScopeDescendant(ScopeId: string, AncestorId: string): boolean
    {
        let Current: string | undefined = ScopeId;
        const Visited = new Set<string>();
        while (Current !== undefined && !Visited.has(Current))
        {
            if (Current === AncestorId)
            {
                return true;
            }
            Visited.add(Current);
            Current = this.Scopes.get(Current)?.ParentId;
        }
        return false;
    }

    private FindNearestTrap(ScopeId: string): RegisteredFocusScope | undefined
    {
        let Current: string | undefined = ScopeId;
        const Visited = new Set<string>();
        while (Current !== undefined && !Visited.has(Current))
        {
            Visited.add(Current);
            const Scope = this.Scopes.get(Current);
            if (Scope === undefined)
            {
                return undefined;
            }
            if (Scope.Trap === true)
            {
                return Scope;
            }
            if (Scope.Id === TypeId)
            {
                return undefined;
            }
            Current = Scope.ParentId;
        }
        return undefined;
    }

    private GetWrap(ScopeId: string): boolean
    {
        let Current: string | undefined = ScopeId;
        const Visited = new Set<string>();
        while (Current !== undefined && !Visited.has(Current))
        {
            Visited.add(Current);
            const Scope = this.Scopes.get(Current);
            if (Scope === undefined)
            {
                return true;
            }
            if (Scope.Wrap !== undefined)
            {
                return Scope.Wrap;
            }
            Current = Scope.ParentId;
        }
        return true;
    }

    private EnsureValidFocus(): void
    {
        if (this.TryInitialFocus())
        {
            return;
        }
        if (
            this.CurrentId !== undefined
            && this.CanFocus(this.CurrentId)
        )
        {
            return;
        }

        if (this.CurrentId !== undefined)
        {
            this.Entries.get(this.CurrentId)?.OnBlur?.();
            this.CurrentId = undefined;
        }

        this.FocusFirst();
    }

    private TryInitialFocus(): boolean
    {
        if (
            this.InitialFocusApplied
            || this.InitialFocus === undefined
            || !this.CanFocus(this.InitialFocus)
        )
        {
            return false;
        }
        return this.Focus(this.InitialFocus);
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
            if (MountOptions.RestoreFocus && PreviousFocus !== undefined)
            {
                Focus.Focus(PreviousFocus);
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
        Focused: Focus.GetFocusedId() === FocusId,
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
    readonly FocusedId: string | undefined;
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
        FocusedId: Focus.GetFocusedId()
    };
};
