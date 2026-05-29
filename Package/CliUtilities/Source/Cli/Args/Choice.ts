/**
 * @file      Choice.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Config, Tuple } from "./Choice.Types.js";
import { Args } from "@effect/cli";
import { Internal } from "../Internal/index.js";
import type { Choice as Shared } from "../Choice/index.js";
import type { TMapper } from "@sorrell/utilities/functional";
import { pipe } from "effect";

/* eslint-disable jsdoc/require-example */

/**
 * For some given {@link Choices} to define an argument via {@link Args.choice}, get the
 * corresponding {@link Tuple | Tuples} needed for using {@link Args.choice}.
 *
 * @param Choices - The choices to map to their corresponding {@link Tuple}.
 *
 * @param Config - The optional configuration object for the {@link Args.choice | choice argument}
 * return by this.  If a {@link Config:type!Description} is specified, then {@link WithDescription}
 * will be used on the returned {@link Args.choice | choice argument}.
 *
 * @returns {Args.Args<ChoiceType>} A {@link Args.choice | choice argument} of
 * the given {@link ChoiceType}, equipped with a per-choice description iff the {@link Config}
 * parameter contains the `Description` property.
 */
export function Choice<const ChoiceType extends string>(
    Choices: ReadonlyArray<ChoiceType>,
    Config?: Config<ChoiceType>
): Args.Args<ChoiceType>
{
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    function ToTuple(Choice: ChoiceType): Tuple<ChoiceType>
    {
        return [ Choice, Choice ];
    }

    const { Description: ConfigDescription = undefined, ...BaseConfig } = Config || { };

    const BaseArgument: Args.Args<ChoiceType> = Args.choice(Choices.map(ToTuple), BaseConfig);

    if (ConfigDescription !== undefined)
    {
        return pipe(
            BaseArgument,
            WithDescription(ConfigDescription.Base, ConfigDescription.Choices)
        );
    }
    else
    {
        return BaseArgument;
    }
}

/**
 * Equip a given {@link Args.choice | choice argument} with a description created from a general
 * description, which is followed by a formatted {@link Record} of
 * {@link ChoiceDescriptions | descriptions} for each respective {@link ChoiceType}.
 *
 * @template ChoiceType - The type of the choice values in the given {@link Args.choice | choice argument}.
 *
 * @param BaseDescription - The "base" description of the given {@link Args.choice | choice argument}.
 * This is displayed before the {@link ChoiceDescriptions}.
 *
 * @param ChoiceDescriptions - The descriptions of the {@link ChoiceType | choices}.
 *
 * @returns {Args.Args<ChoiceType>} The given {@link Args.choice | choice argument}, equipped with
 * the description created from the remaining arguments.
 */
export function WithDescription<const ChoiceType extends string>(
    BaseDescription: string,
    ChoiceDescriptions: Shared.DescriptionRecord<ChoiceType>
): TMapper<Args.Args<ChoiceType>>
{
    const Description: string = Internal.Choice.GetDescription(BaseDescription, ChoiceDescriptions);

    return function(Self: Args.Args<ChoiceType>): typeof Self
    {
        return pipe(
            Self,
            Args.withDescription(Description)
        );
    };
}
