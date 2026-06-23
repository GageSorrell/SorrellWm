/**
 * Validate input from {@link \@sorrell/effect-ink/Field | Fields}.
 *
 * @module @sorrell/effect-ink/Field/Validate
 */

import type { ReactNode } from "react";

/**
 * @file      Validate.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

export interface Keyed<A>
{
    [ Key: string ]: Simple<A>;
}

export interface Simple<A>
{
    readonly IsValid: (Current: A) => boolean;
    readonly GetErrorMessage: (Current: A) => ReactNode;
}

export type Validator<A> =
    | Keyed<A>
    | Simple<A>;

