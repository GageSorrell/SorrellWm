/**
 * @file      List.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Flag } from "@sorrell/effect/unstable/cli";
import type { Subcommand } from "../../Shared/SubCommand.Types.ts";
declare const ListConfig: {
    Rich: Flag.Flag<boolean>;
};
export declare const ListCommand: Subcommand<"ls", typeof ListConfig>;
export {};
//# sourceMappingURL=List.Command.d.ts.map