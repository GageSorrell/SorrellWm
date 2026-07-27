/**
 * Highlights resolved and unresolved dollar-prefixed variables.
 *
 * @module @sorrell/ink-ui/VarText
 *
 * @file      VarText.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { useTheme } from "./Theme.js";

/** {@inheritDoc VarText} */
export interface VarTextProps
{
    readonly Text: string;
    readonly Values: Readonly<Record<string, string | undefined>>;
}

const VariablePattern = /\$[A-Za-z_][A-Za-z0-9_]*/gu;

export/**
       * Highlights resolved and unresolved dollar-prefixed variables.
       *
       * @category Input
       * @since 1.0.0
       */
const VarText = ({ Text: Value, Values }: VarTextProps): React.ReactNode =>
{
    const Theme = useTheme();
    const Nodes = new Array<React.ReactNode>();
    let Offset = 0;

    for (const Match of Value.matchAll(VariablePattern))
    {
        const Index = Match.index;
        const Token = Match[0];
        Nodes.push(Value.slice(Offset, Index));
        Nodes.push(
            <Ink.Text
                color={ Values[Token.slice(1)] === undefined
                    ? Theme.Error
                    : Theme.Primary }
                key={ `${ Index }-${ Token }` }>
                { Token }
            </Ink.Text>
        );
        Offset = Index + Token.length;
    }

    Nodes.push(Value.slice(Offset));
    return <Ink.Text color={ Theme.Text }>{ Nodes }</Ink.Text>;
};
