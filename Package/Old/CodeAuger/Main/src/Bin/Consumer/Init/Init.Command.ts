/**
 * @file      Init.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Command } from "@sorrell/effect/unstable/cli";
import { Effect } from "effect";
import type { Handler } from "@sorrell/cli-utilities/cli";

const InitConfig = { };

function HandleInit(_Options: Handler.Argument<typeof InitConfig>)
{
    return Effect.gen(function* ()
    {

    });
}

export const InitCommand = Command.make("init", InitConfig, HandleInit);
