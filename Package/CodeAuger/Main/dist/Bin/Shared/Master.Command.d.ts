/**
 * @file      Master.Config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Command, Flag } from "@sorrell/effect/unstable/cli";
export declare const SharedFlags: {
    Config: Flag.Flag<{
        readonly $Schema: "code-auger/schema";
        readonly BasePath: string;
        readonly Providers: {
            readonly [x: string]: boolean | {
                readonly Enabled: boolean;
                readonly Watch?: boolean;
            };
        };
        readonly TsConfigPath: string;
        readonly DisabledFormatters?: readonly import("../../Consumer/Config/Config.Types.ts").CodeFormatter[];
        readonly PrependedLines?: readonly string[];
        readonly PrependedLinesOrder?: "before" | "after";
    } | "code-auger.config">;
    Cwd: Flag.Flag<string>;
    Silent: Flag.Flag<boolean>;
};
export declare const RootCommand: Command.Command<"code-auger", {
    readonly Config: {
        readonly $Schema: "code-auger/schema";
        readonly BasePath: string;
        readonly Providers: {
            readonly [x: string]: boolean | {
                readonly Enabled: boolean;
                readonly Watch?: boolean;
            };
        };
        readonly TsConfigPath: string;
        readonly DisabledFormatters?: readonly import("../../Consumer/Config/Config.Types.ts").CodeFormatter[];
        readonly PrependedLines?: readonly string[];
        readonly PrependedLinesOrder?: "before" | "after";
    } | "code-auger.config";
    readonly Cwd: string;
    readonly Silent: boolean;
}, {
    readonly Config: {
        readonly $Schema: "code-auger/schema";
        readonly BasePath: string;
        readonly Providers: {
            readonly [x: string]: boolean | {
                readonly Enabled: boolean;
                readonly Watch?: boolean;
            };
        };
        readonly TsConfigPath: string;
        readonly DisabledFormatters?: readonly import("../../Consumer/Config/Config.Types.ts").CodeFormatter[];
        readonly PrependedLines?: readonly string[];
        readonly PrependedLinesOrder?: "before" | "after";
    } | "code-auger.config";
    readonly Cwd: string;
    readonly Silent: boolean;
}, never, never>;
//# sourceMappingURL=Master.Command.d.ts.map