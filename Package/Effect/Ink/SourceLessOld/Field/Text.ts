/**
 * The {@link \@sorrell/effect-ink/Field | Field} that accepts a `string` of
 * text from the user.
 *
 * @module @sorrell/effect-ink/Field/Text
 */

/**
 * @file      Text.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Field from "./Field.ts";
import * as Impl from "../Internal/Field.ts";
import type { Prompt } from "../index.ts";
import * as Internal from "../Internal/Prompt.ts";

export interface Options extends Field.Options<string>
{

}

export const Text = (Message: string, Options: Options): Prompt.Prompt<string> =>
{
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const Out: any = Impl.Loop(Options);
    return Out;
};
