/**
 * @file      Module.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import Chalk from "chalk";
import { Code } from "@sorrell/cli-utilities/format";
import { Effect } from "effect";
import type { ModuleGenerator } from "./Module.Types.js";
import type { UnknownException } from "effect/Cause";

export function GetModuleGenerator(
    Name: string,
    Path: string
): Effect.Effect<ModuleGenerator, UnknownException, never>
{
    return Effect.tryPromise(async () =>
    {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const GeneratorModule: any = await import(Path);
        if (!(Name in GeneratorModule))
        {
            throw new Error("");
        }

        if (typeof GeneratorModule[Name] !== "function")
        {
            throw new Error(
                `Module at ${ Path } exports a value named ${ Name }, ` +
                `but it is ${ Chalk.italic("not") } a ${ Code("function") }.`
            );
        }

        const NumArgumentsNecessary: number = 3;
        if (GeneratorModule[Name].length !== NumArgumentsNecessary)
        {
            throw new Error(
                `Function ${ Code(`"${ Name }"`) } has incorrect argument vector ` +
                    `(${ GeneratorModule[Name].length } arguments, instead of ${ NumArgumentsNecessary }).`
            );
        }

        return GeneratorModule[Name] as ModuleGenerator;
    }
    );
}
