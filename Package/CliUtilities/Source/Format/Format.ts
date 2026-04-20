/**
 * @file      Format.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 * Comment:   This module contains functions to output messages
 *            to the user with consistent and aesthetic formatting.
 */

import type { FormatRules, Formatter } from "./Format.Types.js";
import Chalk from "chalk";
import type { FormatRulesParsed } from "./Format.Internal.Types.js";
import { ParseFormatRules } from "./Format.Internal.js";

/**
 * The base function for all functions exported by this module.
 *
 * @param Message - The input of the function in which this is called.
 *
 * @returns The given {@link Message} with base formatting applied.
 */
function FormatBase(Message: string): string
{
    return Chalk.reset(Message);
}

/**
 * Formats a given {@link Message} as code.
 *
 * @param Message - The given message to format.
 *
 * @returns The given {@link Message}, formatted to convey that it is code.
 */
export function Code(Message: string): string
{
    return FormatBase(Chalk.red(Message));
}

/**
 * Formats a given {@link Path} as a path.
 *
 * @note Currently, this is just an alias for {@link Code}.
 *
 * @param Path - The path to format.
 *
 * @returns The given {@link Path}, formatted to convey that it is a path.
 */
export function Path(Path: string): string
{
    return Code(Chalk.red(Path));
}

/**
 * Format a given {@link Message} according to the given {@link Rules}.
 *
 * @param Message - The message to format.
 * @param Rules - The {@link FormatRules} describing the transformations that should be made.
 *
 * @returns The formatted {@link Message}, such that every matched substring in {@link Rules}
 * is formatted by the corresponding {@link Formatter}.
 */
export function Format(
    Message: string,
    Rules: FormatRules
): string
{
    Message = FormatBase(Message);

    const RulesParsed: FormatRulesParsed = ParseFormatRules(Rules);

    for (const [ Match, Formatter ] of RulesParsed)
    {
        Message = Message.replaceAll(Match, Formatter);
    }

    return Message;
}

/**
 * Creates a function that formats a given `string` with the given {@link Rules}.
 *
 * @param Rules - The {@link FormatRules} used to format messages passed to the
 * returned function.  If multiple are given, then the keys will be pooled.  If
 * multiple {@link Rules} share a given key, then the respective formatter functions
 * will be composed in the order of the given {@link Rules} objects.
 *
 * @returns A function that will format the `Message` passed to it according to the
 * {@link Rules} passed to this function.
 */
export function MakeFormatter(...Rules: [ FormatRules ] | Array<FormatRules>): Formatter
{
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    function ComposeRules(): FormatRules
    {
        if (Rules.length === 1)
        {
            return Rules[0];
        }

        return Rules.reduce((PreviousValue: FormatRules, CurrentValue: FormatRules): FormatRules =>
        {
            const NewValue: FormatRules = { ...PreviousValue };

            Object.keys(CurrentValue).forEach((Key: string): void =>
            {
                if (Key in NewValue && PreviousValue[Key] !== undefined && CurrentValue[Key] !== undefined)
                {
                    const OriginalFunction: Formatter = PreviousValue[Key];
                    const CurrentFunction: Formatter = CurrentValue[Key];

                    NewValue[Key] = function(Message: string): string
                    {
                        return CurrentFunction(OriginalFunction(Message));
                    };
                }
            });

            return NewValue;
        }, { });
    }

    const OutRules: FormatRules = ComposeRules();

    return function(Message: string): string
    {
        return Format(Message, OutRules);
    };
}
