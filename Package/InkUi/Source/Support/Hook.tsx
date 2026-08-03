/**
 * Ink UI component for hook.
 *
 * @module @sorrell/ink-ui/Support/Hook
 *
 * @file      Hook.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/** React hooks for terminal support. */

import * as Ink from "ink";
import * as React from "react";
import type { TerminalFont, TerminalSupport } from "./Types.js";
import { QueryTerminalFont } from "./Font.js";
import { QueryTerminalSupport } from "./Query.js";

type Listener = () => void;

interface StreamStore<A>
{
    readonly Listeners: Set<Listener>;
    Query: Promise<A | undefined> | undefined;
    Settled: boolean;
    Value: A | undefined;
}

const SupportStores = new WeakMap<NodeJS.WriteStream, StreamStore<TerminalSupport>>();
const FontStores = new WeakMap<NodeJS.WriteStream, StreamStore<TerminalFont>>();

const GetStore = <A,>(
    Stores: WeakMap<NodeJS.WriteStream, StreamStore<A>>,
    Stdout: NodeJS.WriteStream
): StreamStore<A> =>
{
    const Existing: StreamStore<A> | undefined = Stores.get(Stdout);
    if (Existing !== undefined)
    {
        return Existing;
    }

    const Store: StreamStore<A> = {
        Listeners: new Set(),
        Query: undefined,
        Settled: false,
        Value: undefined
    };
    Stores.set(Stdout, Store);
    return Store;
};

const Publish = <A,>(Store: StreamStore<A>, Value: A | undefined): void =>
{
    Store.Settled = true;
    Store.Value = Value;
    for (const Notify of Store.Listeners)
    {
        Notify();
    }
};

const useStore = <A,>(Store: StreamStore<A>): A | undefined =>
{
    const Subscribe = React.useCallback((Notify: Listener): (() => void) =>
    {
        Store.Listeners.add(Notify);
        return () => Store.Listeners.delete(Notify);
    }, [ Store ]);
    const GetSnapshot = React.useCallback((): A | undefined => Store.Value, [ Store ]);

    return React.useSyncExternalStore(Subscribe, GetSnapshot, GetSnapshot);
};

/** Detect terminal features once for the current Ink input/output streams. */
export function useTerminalSupport(): TerminalSupport | undefined
{
    const { stdin, setRawMode } = Ink.useStdin();
    const { stdout } = Ink.useStdout();
    const Store: StreamStore<TerminalSupport> = GetStore(SupportStores, stdout);
    const Support: TerminalSupport | undefined = useStore(Store);

    React.useEffect(() =>
    {
        if (Store.Query === undefined && !Store.Settled)
        {
            Store.Query = QueryTerminalSupport({
                SetRawMode: setRawMode,
                Stdin: stdin,
                Stdout: stdout
            });
            void Store.Query.then((Value: TerminalSupport | undefined) =>
                Publish(Store, Value));
        }
    }, [ setRawMode, stdin, stdout, Store ]);

    return Support;
}

/** Query the active terminal's primary font and retain its discovery source. */
export function useTerminalFont(): TerminalFont | undefined
{
    const { stdin, setRawMode } = Ink.useStdin();
    const { stdout } = Ink.useStdout();
    const Support: TerminalSupport | undefined = useTerminalSupport();
    const Store: StreamStore<TerminalFont> = GetStore(FontStores, stdout);
    const Font: TerminalFont | undefined = useStore(Store);

    React.useEffect(() =>
    {
        if (Support === undefined || Store.Query !== undefined || Store.Settled)
        {
            return;
        }

        Store.Query = QueryTerminalFont({
            SetRawMode: setRawMode,
            Stdin: stdin,
            Stdout: stdout,
            Terminal: Support.Terminal
        });
        void Store.Query.then((Value: TerminalFont | undefined) =>
            Publish(Store, Value));
    }, [ setRawMode, stdin, stdout, Store, Support ]);

    return Font;
}

/** Query only the active terminal's primary font family. */
export function useTerminalFontFamily(): string | undefined
{
    return useTerminalFont()?.Family;
}
