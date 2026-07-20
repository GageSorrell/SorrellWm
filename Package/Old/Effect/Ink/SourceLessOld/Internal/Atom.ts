/**
 * Internal utilities *et al.* for {@link \@sorrell/effect-ink/Field}, {@link \@sorrell/effect-ink/Prose},
 * and {@link \@sorrell/effect-ink/Task}.
 *
 * @module @sorrell/effect-ink/Internal/Atom
 * @internal
 */

/**
 * @file      Atom.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

// import type * as Prompt from "../Prompt.ts";
import type { ReactNode } from "react";
// import type { State } from "../Field/index.ts";

// /** The internal type of {@link Prompt | Prompts}. */
// export interface Impl<A, ModelType, E, R> extends Prompt.Prompt<A, E, R>
// {
//     readonly State: State<A, ModelType>;
// }

export type WithMessage<OptionsType> =
    OptionsType &
    {
        readonly Message: ReactNode;
    };
