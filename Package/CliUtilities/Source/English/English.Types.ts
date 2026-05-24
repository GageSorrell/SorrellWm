/**
 * @file      English.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Inflectors } from "en-inflectors";
import type { Values } from "@sorrell/utilities/record";

type InflectorFunctions =
    {
        [ Key in keyof Inflectors as Inflectors[Key] extends Function ? Key : never ]:
        Key;
    };

type InflectorFunctionsWithArgument =
    {
        [ Key in keyof Inflectors as Inflectors[Key] extends (Argument: string) => string ? Key : never ]:
        Key;
    };

type InflectorFunctionsNoArgument =
    {
        [ Key in keyof Inflectors as Inflectors[Key] extends () => string ? Key : never ]:
        Key;
    };

export type InflectorFunction = Values<InflectorFunctions>;

export namespace InflectorFunction
{
    export type WithArgument = Values<InflectorFunctionsWithArgument>;
    export type NoArgument = Values<InflectorFunctionsNoArgument>;
}
