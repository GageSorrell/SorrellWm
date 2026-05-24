/**
 * @file      Generate.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Command } from "@effect/cli";
import { Effect } from "effect";

function HandleGenerate()
{
    return Effect.gen(function* ()
    {

    });
}

// type GenerateCommand =
//     Command.Command<
//         "generate",
//     >;

export const GenerateCommand = Command.make("generate", { }, HandleGenerate);
