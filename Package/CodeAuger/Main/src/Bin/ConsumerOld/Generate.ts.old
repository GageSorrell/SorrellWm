/**
 * @file      Generate.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Command } from "@effect/cli";
import type { Handler } from "@sorrell/cli-utilities/cli";
import { Effect } from "effect";
import type { MasterConfig } from "../Shared/Master.Command.Types.js";

function HandleGenerate()
{
    return Effect.flatMap(({ Silent }: Handler.Argument<MasterConfig>)
    {

    });
}

// type GenerateCommand =
//     Command.Command<
//         "generate",
//     >;

export const GenerateCommand = Command.make("generate", { }, HandleGenerate);
