/**
 * @file      Choice.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Shared from "../Choice/index.js";
import { Internal } from "../Internal/index.js";
import { Options } from "@sorrell/effect/unstable/cli";
import type { TMapper } from "@sorrell/utilities/functional";
import { pipe } from "effect";

/* eslint-disable jsdoc/require-example */

/**
 * For some given {@link Choices} to define an argument via {@link Options.choice}, get the
 * corresponding {@link Tuple | Tuples} needed for using {@link Options.choice}.
 *
 * @param Name - The name of choice option.
 *
 * @param Choices - The choices to map to their corresponding {@link Tuple}.
 *
 * @param Description - If specified, then the returned choice option is equipped
 * with a description that explains the choice option *and* each choice value in
 * the given {@link ChoiceType}.
 *
 * @returns {Options.Options<ChoiceType>} A {@link Options.choice | choice option} of
 * the given {@link ChoiceType}, equipped with a per-choice description iff the {@link Config}
 * parameter contains the `Description` property.
 */
export function Choice<const ChoiceType extends string>(
    Name: string,
    Choices: ReadonlyArray<ChoiceType>,
    Description?: Shared.Description<ChoiceType>
): Options.Options<ChoiceType>
{
    const BaseArgument: Options.Options<ChoiceType> =
        Options.choice<ChoiceType, ReadonlyArray<ChoiceType>>(Name, Choices);

    if (Description !== undefined)
    {
        return pipe(
            BaseArgument,
            WithDescription(Description.Base, Description.Choices)
        );
    }
    else
    {
        return BaseArgument;
    }
}

/**
 * Equip a given {@link Options.choice | choice option} with a description created from a general
 * description, which is followed by a formatted {@link Record} of
 * {@link ChoiceDescriptions | descriptions} for each respective {@link ChoiceType}.
 *
 * @template ChoiceType - The type of the choice values in the given {@link Options.choice | choice option}.
 *
 * @param BaseDescription - The "base" description of the given {@link Options.choice | choice option}.
 * This is displayed before the {@link ChoiceDescriptions}.
 *
 * @param ChoiceDescriptions - The descriptions of the {@link ChoiceType | choices}.
 *
 * @returns {Options.Options<ChoiceType>} The given {@link Options.choice | choice option}, equipped with
 * the description created from the remaining arguments.
 */
export function WithDescription<const ChoiceType extends string>(
    BaseDescription: string,
    ChoiceDescriptions: Shared.DescriptionRecord<ChoiceType>
): TMapper<Options.Options<ChoiceType>>
{
    const Description: string = Internal.Choice.GetDescription(BaseDescription, ChoiceDescriptions);

    return function(Self: Options.Options<ChoiceType>): typeof Self
    {
        return pipe(
            Self,
            Options.withDescription(Description)
        );
    };
}
