/**
 * @file      Init.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Command } from "@sorrell/effect/unstable/cli";
import { MakeConfig } from "../../Shared/SubCommand.js";
import { Effect } from "effect";
const InitConfig = MakeConfig({});
function HandleInit(Options) {
    return Effect.gen(function* () {
    });
}
export const InitCommand = Command.make("init", InitConfig, HandleInit);
//# sourceMappingURL=Init.Command.js.map