/**
 * @file      Choice.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Args } from "@effect/cli";
import type { Choice as Shared } from "../Choice/index.js";

/**
 * A tuple constructed from a given {@link ChoiceType}, used by some functions
 * in the {@link Args | Args module}.
 *
 * @template ChoiceType - The possible choices for a given argument.
 */
export type Tuple<ChoiceType extends string = string> = [ string, ChoiceType ];

/**
 * The config object for a {@link Args.choice | choice argument} whose choices
 * are of a given {@link ChoiceType}.
 *
 * @template ChoiceType - The possible values of the choice argument constructed with this config.
 */
export type Config<ChoiceType extends string> =
    Args.Args.BaseArgsConfig &
    Readonly<Partial<{
        Description: Shared.Description<ChoiceType>;
    }>>;
