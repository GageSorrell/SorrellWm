/**
 * @file      Init.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Command } from "@sorrell/effect/unstable/cli";
import { Effect } from "effect";
const InitConfig = {};
function HandleInit(_Options) {
    return Effect.gen(function* () {
    });
}
export const InitCommand = Command.make("init", InitConfig, HandleInit);
//# sourceMappingURL=Init.Command.js.map