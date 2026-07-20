/**
 *
 *
 * @module @sorrell/effect-ink/Component/Primitive/Column
 *
 * @file      Column.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Color from "../../../Color.ts";
import * as Ink from "ink";
import type * as React from "react";
import type { GridProps } from "./Grid.tsx";

export type ColumnProps = GridProps;

export const Column = (Props: ColumnProps): React.ReactNode =>
{
    const { children, ...Tail } = Props;

    if (Tail.backgroundColor === Color.Undefined)
    {
        delete Tail.backgroundColor;
    }
    else if (Tail.backgroundColor !== undefined)
    {
        Tail.backgroundColor = Color.Ink(Tail.backgroundColor);
    }

    return <Ink.Box
        flexDirection="column"
        { ...(Tail as Omit<Ink.BoxProps, "children">) }>
        { children }
    </Ink.Box>;
};
