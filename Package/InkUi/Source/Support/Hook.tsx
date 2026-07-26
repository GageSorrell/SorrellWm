/**
 *
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

/** Detect terminal features once for the current Ink input/output streams. */
export function useTerminalSupport(): TerminalSupport | undefined
{
    const { stdin, setRawMode } = Ink.useStdin();
    const { stdout } = Ink.useStdout();
    const [ Support, SetSupport ] = React.useState<TerminalSupport>();

    React.useEffect(() =>
    {
        let Cancelled: boolean = false;
        void QueryTerminalSupport({ SetRawMode: setRawMode, Stdin: stdin, Stdout: stdout })
            .then((Value: TerminalSupport) =>
            {
                if (!Cancelled) {SetSupport(Value);}
            });
        return () => { Cancelled = true; };
    }, [ setRawMode, stdin, stdout ]);

    return Support;
}

/** Query the active terminal's primary font and retain its discovery source. */
export function useTerminalFont(): TerminalFont | undefined
{
    const { stdin, setRawMode } = Ink.useStdin();
    const { stdout } = Ink.useStdout();
    const Support: TerminalSupport | undefined = useTerminalSupport();
    const [ Font, SetFont ] = React.useState<TerminalFont>();

    React.useEffect(() =>
    {
        if (Support === undefined) {return;}
        let Cancelled: boolean = false;
        void QueryTerminalFont({
            SetRawMode: setRawMode,
            Stdin: stdin,
            Stdout: stdout,
            Terminal: Support.Terminal
        }).then((Value: TerminalFont | undefined) =>
        {
            if (!Cancelled) {SetFont(Value);}
        });
        return () => { Cancelled = true; };
    }, [ setRawMode, stdin, stdout, Support ]);

    return Font;
}

/** Query only the active terminal's primary font family. */
export function useTerminalFontFamily(): string | undefined
{
    return useTerminalFont()?.Family;
}
