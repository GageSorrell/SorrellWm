/**
 * @file      Choice.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-example */

import { Record } from "effect";
import type { Choice as Shared } from "../../Choice/index.js";

/**
 * Get a formatted description of a choice argument whose choices are of a given {@link ChoiceType},
 * such that each possible choice value has its own description.
 *
 * @template ChoiceType - The type of the choice values in the given {@link Self | choice argument}.
 *
 * @param BaseDescription - The "base" description of the given {@link Self | choice argument}.
 * This is displayed before the {@link ChoiceDescriptions}.
 *
 * @param ChoiceDescriptions - The descriptions of the {@link ChoiceType | choices}.
 *
 * @returns {string} A description of a choice argument of the given {@link ChoiceType}, such that
 * there is a general description of the argument, which is followed by a formatted list of possible
 * choices and their respective descriptions.
 */
export function GetDescription<const ChoiceType extends string>(
    BaseDescription: string,
    ChoiceDescriptions: Shared.DescriptionRecord<ChoiceType>
): string
{
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    function GetDescriptionPart(Choice: ChoiceType, Description: string): string
    {
        return `${ Choice }: ${ Description }`;
    }

    return [
        BaseDescription,
        "\n",
        ...Record.collect(ChoiceDescriptions, GetDescriptionPart)
    ].join("\n");
}
