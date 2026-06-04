/**
 * @file      Init.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Command } from "@sorrell/effect/unstable/cli";
import { MakeConfig } from "../../Shared/SubCommand.js";
import type { Handler } from "@sorrell/cli-utilities/cli";
import { Effect } from "effect";

const InitConfig = MakeConfig({

});

function HandleInit(Options: Handler.Argument<typeof InitConfig>)
{
    return Effect.gen(function* ()
    {

    });
}

export const InitCommand = Command.make("init", InitConfig, HandleInit);
