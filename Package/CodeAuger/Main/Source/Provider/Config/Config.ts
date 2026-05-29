/**
 * @file      Config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Config } from "./Config.Types.js";
import { IsValidTypeName } from "@sorrell/utilities/type";

/**
 * Determine whether a given {@link CodeAugerProperty} of a provider's `package.json` is valid.
 *
 * @param CodeAugerProperty - The `"code-auger"` property of a provider's `package.json`.
 *
 * @returns {In is ExportedType} Whether the given {@link CodeAugerProperty} of a provider is valid.
 */
export function IsValid(CodeAugerProperty: unknown): CodeAugerProperty is Config
{
    return (
        typeof CodeAugerProperty === "object" &&
        CodeAugerProperty !== null &&
        "Interface" in CodeAugerProperty &&
        "GenericProperty" in CodeAugerProperty &&
        typeof CodeAugerProperty.Interface === "string" &&
        typeof CodeAugerProperty.GenericProperty === "string" &&
        IsValidTypeName(CodeAugerProperty.Interface) &&
        IsValidTypeName(CodeAugerProperty.GenericProperty)
    );
}
