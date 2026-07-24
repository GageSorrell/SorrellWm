/**
 *
 *
 * @module @sorrell/ink-ui/Interaction/Context
 *
 * @file      Context.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { CommandRegistry, FocusCommands } from "./Command.js";
import { FocusRegistry } from "./Focus.js";

export/** The identifier for this module. */
const TypeId = "@sorrell/ink-ui/Interaction/Context" as const;

interface InteractionContextValue
{
    readonly Commands: CommandRegistry;
    readonly Focus: FocusRegistry;
}

export/**
       * The context that handles state shared by all Interaction modules.
       *
       * @category Interaction
       * @since 1.0.0
       */
const InteractionContext =
    React.createContext<InteractionContextValue | undefined>(undefined);

export/**
       * The context that handles focus.
       *
       * @category Interaction
       * @since 1.0.0
       */
const FocusScopeContext = React.createContext(TypeId as string);

export/**
       * The context that handles commands.
       *
       * @category Interaction
       * @since 1.0.0
       */
const CommandScopeContext = React.createContext(TypeId as string);

export/**
       * Access the shared interaction context.
       *
       * @internal
       *
       * @category Interaction
       * @since 1.0.0
       */
const UseInteraction = (): InteractionContextValue =>
{
    const Context = React.useContext(InteractionContext);
    if (Context === undefined)
    {
        throw new Error(
            "This interaction hook must be used inside an InteractionProvider."
        );
    }
    return Context;
};

/** {@inheritDoc InteractionProvider} */
export interface InteractionProviderProps extends React.PropsWithChildren
{
    readonly Active?: boolean;
    readonly InitialFocus?: string | undefined;
    readonly Wrap?: boolean;
}

export/**
       * Provides one coordinated input dispatcher for focus, commands, and shortcuts.
       *
       * @category Interaction
       * @since 1.0.0
       */
const InteractionProvider = ({
    Active = true,
    children,
    InitialFocus,
    Wrap = true
}: InteractionProviderProps): React.ReactNode =>
{
    const [ Focus ] = React.useState(
        () => new FocusRegistry(InitialFocus, Wrap)
    );
    const [ Commands ] = React.useState(() => new CommandRegistry());

    React.useLayoutEffect(() =>
    {
        Focus.SetInitialFocus(InitialFocus);
    }, [ Focus, InitialFocus ]);

    React.useLayoutEffect(() =>
    {
        Focus.SetWrap(Wrap);
    }, [ Focus, Wrap ]);

    React.useLayoutEffect(() =>
    {
        const Disposers = [
            Commands.Register({
                Command: FocusCommands.First,
                Handler: () => Focus.FocusFirst(),
                ScopeId: TypeId
            }),
            Commands.Register({
                Command: FocusCommands.Last,
                Handler: () => Focus.FocusLast(),
                ScopeId: TypeId
            }),
            Commands.Register({
                Command: FocusCommands.Next,
                Handler: () => Focus.FocusNext(),
                ScopeId: TypeId
            }),
            Commands.Register({
                Command: FocusCommands.Previous,
                Handler: () => Focus.FocusPrevious(),
                ScopeId: TypeId
            })
        ];
        return () =>
        {
            for (const Dispose of Disposers)
            {
                Dispose();
            }
        };
    }, [ Commands, Focus ]);

    Ink.useInput((Input: string, Key: Ink.Key) =>
    {
        const Handled = Commands.HandleInput(
            Input,
            Key,
            Focus.GetFocusedCommandScopeId()
        );
        if (!Handled && Key.tab)
        {
            if (Key.shift)
            {
                Focus.FocusPrevious();
            }
            else
            {
                Focus.FocusNext();
            }
        }
    }, { isActive: Active });

    const Context = React.useMemo(
        () => ({ Commands, Focus }),
        [ Commands, Focus ]
    );

    return (
        <InteractionContext.Provider value={ Context }>
            <CommandScopeContext.Provider value={ TypeId }>
                <FocusScopeContext.Provider value={ TypeId }>
                    { children }
                </FocusScopeContext.Provider>
            </CommandScopeContext.Provider>
        </InteractionContext.Provider>
    );
};

