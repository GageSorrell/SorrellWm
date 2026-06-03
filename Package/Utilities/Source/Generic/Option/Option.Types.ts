/**
 * @file      Option.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { NoOptionsValue } from "./Options.Internal.ts";

/** The type used in `OptionsType`s when no options are specified. */
export type NoOptions = typeof NoOptionsValue;

/**
 * Define options for a given type as a union of `unique symbol` types.
 * All options must be *optional* by the type that uses these options.
 * The type that uses these options should have a type parameter `OptionsType`
 * defined with `OptionsType extends TOptions = NoOptions`.  You will have to import
 * {@link Value}, but this should be done anyway, since making all options types
 * optional should be optional.  For this reason {@link Value} is exported from the
 * same module as this type.
 *
 * @template OptionsType - The `unique symbol` types that act as options.
 *
 * @example * See the {@link Array.Options:type} type as an example.
 */
export type TOptions<OptionsType extends symbol = NoOptions> =
    | OptionsType
    | NoOptions;

