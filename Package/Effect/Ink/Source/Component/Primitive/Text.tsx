/**
 *
 *
 * @module @sorrell/effect-ink/Component/Primitive/Text
 *
 * @file      Text.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Branded from "./Branded.tsx";
import * as Color from "../../Color.ts";
import * as Ink from "ink";
import type * as React from "react";

export type TextProps = Branded.Make<Ink.TextProps>;

export const Text = (Props: TextProps): React.ReactNode =>
{
    const { ...Out } = Props;

    if (Out.backgroundColor === Color.Undefined)
    {
        delete Out.backgroundColor;
    }
    else if (Out.backgroundColor !== undefined)
    {
        Out.backgroundColor = Color.Ink(Out.backgroundColor);
    }

    if (Out.color === Color.Undefined)
    {
        delete Out.color;
    }
    else if (Out.color !== undefined)
    {
        Out.color = Color.Ink(Out.color);
    }

    return <Ink.Text { ...(Out as Ink.TextProps) }></Ink.Text>;
};
