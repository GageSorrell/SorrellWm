/**
 * @file      Validate.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Command } from "@sorrell/effect/unstable/cli";
import type { ValidateCommandType } from "./Validate.Command.Types.js";
export declare const FixCategories: readonly ["all", "error", "recommended", "config-not-missing-providers", "has-config", "has-providers", "no-collisions", "no-ignored-providers"];
export declare const ValidateConfig: {
    Fix: Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any> | readonly (Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any>)[];
    Validators: Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any> | readonly (Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any>)[];
} & {
    Cwd: Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any> | readonly (Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any>)[];
    Silent: Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any> | readonly (Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any>)[];
};
export declare const ValidateCommand: ValidateCommandType;
//# sourceMappingURL=Validate.Command.d.ts.map