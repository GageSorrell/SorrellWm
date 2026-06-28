/**
 *
 *
 * @module @sorrell/effect-ink/Component/Primitive/Grid
 * @internal
 *
 * @file      Grid.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Branded from "../Branded.tsx";
import type * as Ink from "ink";
import type * as React from "react";

export type GridProps =
    Omit<
        Branded.Make<
            React.PropsWithChildren<Ink.BoxProps> &
            React.RefAttributes<Ink.DOMElement>
        >,
        "flexDirection"
    >;
