/**
 * @file      Config.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { CodeFormatters } from "./Config.js";
export function IsProvider(Argument) {
    return (typeof Argument === "object" &&
        Argument !== null &&
        (!("Disabled" in Argument) ||
            ("Disabled" in Argument &&
                typeof Argument.Disabled === "boolean")) &&
        (!("NoWatch" in Argument) ||
            ("NoWatch" in Argument &&
                typeof Argument.NoWatch === "boolean")));
}
export function IsConfigValid(Argument) {
    return (typeof Argument === "object" &&
        Argument !== null &&
        "BasePath" in Argument &&
        typeof Argument.BasePath === "string" &&
        (!("TsConfigPath" in Argument) ||
            ("TsConfigPath" in Argument &&
                typeof Argument.TsConfigPath === "string")) &&
        (!("DisabledFormatters" in Argument) ||
            ("DisabledFormatters" in Argument &&
                Array.isArray(Argument.DisabledFormatters) &&
                Argument.DisabledFormatters.every(CodeFormatters.includes))) &&
        (!("PrependedLines" in Argument) ||
            ("PrependedLines" in Argument &&
                Array.isArray(Argument.PrependedLines) &&
                Argument.PrependedLines.every((Element) => typeof Element === "string"))) &&
        "Providers" in Argument &&
        typeof Argument.Providers === "object" &&
        Argument.Providers !== null &&
        Object.values(Argument.Providers).every(IsProvider));
}
//# sourceMappingURL=Config.Internal.js.map