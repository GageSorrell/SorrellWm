/**
 * @file      Generate.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Command } from "@sorrell/effect/unstable/cli";
import type { GenerateCommandType } from "./Generate.Command.Types.js";
export declare const GenerateConfig: {
    Watch: Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any> | readonly (Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any>)[];
} & {
    Cwd: Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any> | readonly (Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any>)[];
    Silent: Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any> | readonly (Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any>)[];
};
export declare const GenerateCommand: GenerateCommandType;
//# sourceMappingURL=Generate.Command.d.ts.map