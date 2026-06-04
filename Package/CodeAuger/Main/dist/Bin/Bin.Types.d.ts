/**
 * @file      Bin.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import type { Command } from "@sorrell/effect/unstable/cli";
import type { Effect } from "effect";
import type { Handler } from "@sorrell/cli-utilities/cli";
import type { MasterConfig } from "./Shared/Master.Command.Types.js";
import type { Option } from "effect/Option";
import type { TaskError } from "./Shared/Error.js";
export type EApplication = Effect.Effect<Handler.Argument<MasterConfig> & Readonly<{
    subcommand: Option<any>;
}>, TaskError, Command.Command.Context<"code-auger">>;
//# sourceMappingURL=Bin.Types.d.ts.map