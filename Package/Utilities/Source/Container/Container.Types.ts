/**
 * @file      Container.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { HigherKind } from "../HigherKind/index.ts";
import type { IterableContainer } from "./Container.Meta.Types.ts";
import type { Unsafe } from "./Container.Unsafe.Types.ts";

/**
 * Get the element type of a given {@link Any | container type}.
 *
 * @template ContainerType - The {@link Any | container type} whose element type
 * is to what this evaluates.
 */
export type Element<ContainerType extends Unsafe.Any> =
    ContainerType extends Array<infer ElementType>
        ? ElementType
        : ContainerType extends Set<infer ElementType>
            ? ElementType
            : ContainerType extends IterableContainer<infer ElementType>
                ? ElementType
                : ContainerType extends HigherKind<infer ArgumentVectorType>
                    ?  ArgumentVectorType extends readonly [ infer ElementType ]
                        ? ElementType
                        : never
                    : never;

/**
 * A {@link HigherKind | higher-kinded} container type of a given {@link ElementType}.
 *
 * @template ElementType - The type of the elements in this type.
 */
export type Higher<ElementType = unknown> = HigherKind<readonly [ ElementType ]>;

/**
 * Any container of a given {@link ElementType}.
 *
 * @template ElementType - The type of the elements in this type.
 */
export type Any<ElementType = unknown> =
    | Array<ElementType>
    | ReadonlyArray<ElementType>
    | Set<ElementType>
    | ReadonlySet<ElementType>
    | IterableContainer<ElementType>
    | HigherKind<readonly [ ElementType ]>
    | HigherIterable<ElementType>;

/**
 * A {@link Higher | higher-kinded} container type of a given {@link ElementType},
 * which also implements the {@link Iterable} interface.
 *
 * @template ElementType - The type of the elements in this type.
 */
export type HigherIterable<ElementType> =
    Higher<ElementType> &
    Iterable<ElementType>;

/**
 * The result of an operation in the {@link Container} module.
 *
 * If both operands are {@link Array | Arrays}, then the result will also
 * be an {@link Array}.  Otherwise, this will be a {@link Set}.
 *
 * @template LeftType - The left {@link Unsafe!Iterable | Iterable} operand
 * of the given operation.
 * @template RightType - The right {@link Unsafe!Iterable | Iterable} operand
 * of the given operation.
 */
export type Result<
    LeftType extends IterableContainer<LeftElementType>,
    RightType extends IterableContainer<RightElementType>,
    LeftElementType = unknown,
    RightElementType = unknown
> =
    LeftType extends ReadonlyArray<unknown>
        ? RightType extends ReadonlyArray<unknown>
            ? Array<Element<LeftType> | Element<RightType>>
            : Set<Element<LeftType> | Element<RightType>>
        : Set<Element<LeftType> | Element<RightType>>;
