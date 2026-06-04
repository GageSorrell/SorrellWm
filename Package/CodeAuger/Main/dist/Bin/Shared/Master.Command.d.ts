/**
 * @file      Master.Config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Command } from "@sorrell/effect/unstable/cli";
export declare const ConfigMaster: {
    Cwd: Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any> | readonly (Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any>)[];
    Silent: Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any> | readonly (Command.Command.Config | import("effect/unstable/cli/Param").Param<import("effect/unstable/cli/Param").ParamKind, any>)[];
};
export declare const RootCommand: Command.Command<"code-auger", {
    readonly Cwd: any;
    readonly Silent: any;
}, {}, never, never>;
//# sourceMappingURL=Master.Command.d.ts.map