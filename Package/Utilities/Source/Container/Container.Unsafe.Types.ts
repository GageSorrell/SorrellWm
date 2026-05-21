/**
 * @file      Container.Unsafe.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Any as AnySafe } from "./Container.Types.ts";
import type { IterableContainer } from "./Container.Meta.Types.ts";

/* eslint-disable @typescript-eslint/no-explicit-any */

export namespace Unsafe
{
    /** Any {@link AnySafe | container} of *any* element type. */
    export type Any = AnySafe<any>;

    /** Any {@link IterableContainer | iterable container} of *any* element type. */
    export type Iterable = IterableContainer<any>;
}

