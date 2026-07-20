/**
 * @file      Format.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FormatRules, Formatter } from "./Format.Types.js";
import type { FormatRulesParsed } from "./Format.Internal.Types.js";

/**
 * @param Value - The given string to parse.
 * @returns The parsed string or regular expression.
 */
function ParseStringOrRegularExpression(Value: string): string | RegExp
{
    if (Value.length < 2)
    {
        return Value;
    }

    if (Value[0] !== "/")
    {
        return Value;
    }

    const ClosingSlashIndex: number = GetClosingSlashIndex(Value);

    if (ClosingSlashIndex <= 0)
    {
        return Value;
    }

    const Pattern: string = Value.slice(1, ClosingSlashIndex);
    const Flags: string = Value.slice(ClosingSlashIndex + 1);

    try
    {
        return new RegExp(Pattern, Flags);
    }
    catch
    {
        return Value;
    }
}

/**
 * @param Value - The given `string` whose index of a closing slash is returned.
 * @returns The index of the closing slash in the given `string`, or `-1` if there is no closing slash.
 */
function GetClosingSlashIndex(Value: string): number
{
    for (let Index: number = Value.length - 1; Index >= 1; Index--)
    {
        if (Value[Index] !== "/")
        {
            continue;
        }

        if (!IsCharacterEscaped(Value, Index))
        {
            return Index;
        }
    }

    return -1;
}

/**
 * @param Value - The given `string` in which to check whether the character at the given `index` is escaped.
 * @param Index - The index of the character to check.
 * @returns Whether the given {@link Value} is escaped at the given {@link Index}.
 */
function IsCharacterEscaped(Value: string, Index: number): boolean
{
    let BackslashCount: number = 0;

    for (let CurrentIndex: number = Index - 1; CurrentIndex >= 0; CurrentIndex--)
    {
        if (Value[CurrentIndex] !== "\\")
        {
            break;
        }

        BackslashCount++;
    }

    return (BackslashCount % 2) === 1;
}

/**
 * Parse a given {@link FormatRules} object into a `Map`, such that
 * the keys of the given {@link Rules} that describe regular expressions
 * are replaced by the `RegExp` objects that they describe.  Keys that
 * correspond to substrings are left as-is.
 *
 * @param Rules - The given {@link FormatRules} to parse.
 *
 * @returns The parsed {@link FormatRules}, as a {@link FormatRulesParsed} `Map`.
 */
export function ParseFormatRules(Rules: FormatRules): FormatRulesParsed
{
    const Out: Map<string | RegExp, Formatter> = new Map<string | RegExp, Formatter>();

    type Entry = [ string, Formatter ];

    Object.entries(Rules).forEach(([ Key, Formatter ]: Entry): void =>
    {
        const ParsedKey: string | RegExp = ParseStringOrRegularExpression(Key);
        Out.set(ParsedKey, Formatter);
    });

    return Out;
}
