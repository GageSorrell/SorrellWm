/**
 * Base types for the algebraic structures provided by this package.
 *
 * @module @sorrell/effect-number/Algebra
 */

import type { CommutativeRing } from "./CommutativeRing.ts";
import type { Field } from "./Field.ts";
import type { Group } from "./Group.ts";
import type { Option } from "effect";

/* eslint-disable @typescript-eslint/no-explicit-any */

export type ElementFrom<StructureType> =
    StructureType extends Field<infer ElementType, any>
        ? ElementType
        : StructureType extends CommutativeRing<infer ElementType, any>
            ? ElementType
            : StructureType extends Group<infer ElementType>
                ? ElementType
                : never;

/* eslint-enable @typescript-eslint/no-explicit-any */

export namespace Operation
{
    export type Binary<ElementType> = (Self: ElementType, That: ElementType) => ElementType;

    export type BinaryNonzero<ElementType, NonzeroGroupType extends Group<ElementType> = never> =
        (Self: ElementType, That: NonzeroGroupType) => ElementType;

    export type Unary<ElementType> = (Self: ElementType) => ElementType;

    /* eslint-disable @typescript-eslint/no-explicit-any */

    export type Safe<OperationType extends (...Args: any) => any> =
        (...Args: Parameters<OperationType>) => Option.Option<ReturnType<OperationType>>;

    /* eslint-enable @typescript-eslint/no-explicit-any */
}
