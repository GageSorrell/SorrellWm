/**
 * @file      Validate.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Command } from "@sorrell/effect/unstable/cli";
import type { Subcommand } from "../../Shared/SubCommand.Types.js";
import type { Validator } from "./Validate.Command.Types.js";
export declare const Validators: readonly ["config-loads", "exports", "has-config", "has-peer-dependency"];
export declare const ValidateConfig: {
    Fix: Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any> | readonly (Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any>)[];
    Validators: Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any> | readonly (Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any>)[];
} & {
    Cwd: Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any> | readonly (Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any>)[];
    Silent: Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any> | readonly (Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any>)[];
};
declare const ValidateError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "ValidateError";
} & Readonly<A>;
export declare class ValidateError extends ValidateError_base<{
    readonly Kind: Validator.ErrorKind;
}> {
}
export declare const ValidateCommand: Subcommand<"validate", typeof ValidateConfig>;
export {};
//# sourceMappingURL=Validate.Command.d.ts.map