/**
 * @file      Container.Meta.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import type { Higher, HigherIterable } from "./Container.Types.ts";

/**
 * A {@link Higher | higher-kinded} container type of a given {@link ElementType},
 * which also implements the {@link Iterable} interface.
 *
 * @template ElementType - The type of the elements in this type.
 */
export type IterableContainer<ElementType> =
    | HigherIterable<ElementType>
    | Iterable<ElementType>;
