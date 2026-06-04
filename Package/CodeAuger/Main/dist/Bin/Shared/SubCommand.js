/**
 * @file      SubCommand.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { ConfigMaster } from "./Master.Command.js";
export function MakeConfig(In) {
    return {
        ...In,
        ...ConfigMaster
    };
}
//# sourceMappingURL=SubCommand.js.map