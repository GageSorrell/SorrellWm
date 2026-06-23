/**
 * @file      Validation.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Brand, flow } from "effect";
import type { ReactElement, ReactNode } from "react";
import type { Untagged } from "../Utility.ts";

export const TypeId: unique symbol = Symbol.for("@sorrell/effect-ink/Prompt/Validation");

export type Validator<A> =
    {
        (Value: A): boolean;
    };

export type ErrorMessage = Brand.Branded<
    Extract<ReactNode, string | undefined | ReactElement>,
    "ValidationErrorMessage"
>;

export const ErrorMessage: Brand.Constructor<ErrorMessage> = Brand.nominal<ErrorMessage>();

// export interface Annotated<A>
// {
//     GetErrorMessage:
//         | ((FailedPredicates: ReadonlyArray<string>) => string)
//         | ((FailedPredicates: ReadonlyArray<string>, FailedValue: A) => string);

//     Predicates: Record<string, (Value: A) => boolean>;
// }

/**
 * The props passed to a {@link State!MessageComponent}.
 *
 * @property {A} CurrentValue - The current value whose validation state is represented
 * to `react` by these props.
 *
 * @property {ReadonlyArray<string>} FailedKeys - If the {@link State | validation state} has
 * keyed validator functions, then this is the array of keys whose validators returned `false`.
 *
 * @property {boolean} IsValid - Whether any validator function of this state returned `false`
 * for the {@link CurrentValue}.
 */
export interface Props<A> extends Pick<State<unknown>, "FailedKeys">
{
    CurrentValue: A;
    IsValid: boolean;
}

export interface State<A>
{
    FailedKeys?: ReadonlyArray<string>;
    Validators?:
        | Validator<A>
        | Record<string, Validator<A>>;
    MessageComponent?:
        | undefined
        | ((Props: Props<A>) => ErrorMessage);
}
