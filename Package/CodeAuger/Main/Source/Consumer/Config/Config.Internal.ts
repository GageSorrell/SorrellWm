/**
 * @file      Config.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { CodeFormatter, Config, Provider } from "./Config.Types.js";
import { CodeFormatters } from "./Config.js";

export function IsProvider(Argument: unknown): Argument is Provider
{
    return (
        typeof Argument === "object" &&
        Argument !== null &&
        (
            !("Disabled" in Argument) ||
            (
                "Disabled" in Argument &&
                typeof Argument.Disabled === "boolean"
            )
        ) &&
        "Path" in Argument &&
        typeof Argument.Path === "string"
    );
}

export function IsConfigValid(Argument: unknown): Argument is Config
{
    return (
        typeof Argument === "object" &&
        Argument !== null &&
        "BasePath" in Argument &&
        typeof Argument.BasePath === "string" &&
        (
            !("DisabledFormatters" in Argument) ||
            (
                "DisabledFormatters" in Argument &&
                Array.isArray(Argument.DisabledFormatters) &&
                Argument.DisabledFormatters.every(CodeFormatters.includes)
            )
        ) &&
        (
            !("PrependedLines" in Argument) ||
            (
                "PrependedLines" in Argument &&
                Array.isArray(Argument.PrependedLines) &&
                Argument.PrependedLines.every((Element: unknown) => typeof Element === "string")
            )
        ) &&
        "Providers" in Argument &&
        typeof Argument.Providers === "object" &&
        Argument.Providers !== null &&
        Object.values(Argument.Providers).every(IsProvider)
    );
}
