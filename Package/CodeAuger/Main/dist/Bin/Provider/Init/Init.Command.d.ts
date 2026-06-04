/**
 * @file      Init.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import type { InitCommandType } from "./Init.Command.Types.js";
import { Command } from "@sorrell/effect/unstable/cli";
export declare const InitConfig: {
    Cwd: Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any> | readonly (Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any>)[];
    Silent: Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any> | readonly (Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any>)[];
};
export declare const InitCommand: InitCommandType;
//# sourceMappingURL=Init.Command.d.ts.map