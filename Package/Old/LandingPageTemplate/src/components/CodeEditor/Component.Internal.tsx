/**
 * @file      Component.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { FCodeToken, PCodeLine, PToken } from "./Component.Internal.Types";
import type { ReactNode } from "react";
import { Tokens } from "./Tokens";

function Token({ TokenValue }: PToken): ReactNode
{
    return (
        <span
            style={ {
                color: TokenValue.Color ?? Tokens.CodeDefaultTextColor
            } }>
            { TokenValue.Text }
        </span>
    );
}

export function CodeLine({ Index, Line }: PCodeLine): ReactNode
{
    function TransformLineToken(TokenValue: FCodeToken, TokenIndex: number): ReactNode
    {
        return (
            <Token
                TokenValue={ TokenValue }
                key={ `${ Line.Key }-${ TokenIndex }` }
            />
        );
    }

    return (
        <div
            style={ {
                height: Tokens.CodeLineHeight,
                left: 0,
                position: "absolute",
                top: Index * Tokens.CodeLineHeight,
                whiteSpace: "pre"
            } }>
            { Line.Tokens.map(TransformLineToken) }
        </div>
    );
}
