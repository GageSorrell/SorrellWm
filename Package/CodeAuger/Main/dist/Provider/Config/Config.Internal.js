/**
 * @file      Config.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { IsValidDependencyImportSpecifier } from "@sorrell/utilities/npm";
import { IsValidTypeName } from "@sorrell/utilities/type";
/**
 * Determine whether a given {@link Argument} is an {@link ExportedType}.
 *
 * @param Argument - The object to test.
 *
 * @returns {In is ExportedType} Whether the given {@link Argument | argument} is an {@link ExportedType}.
 */
export function IsExportedType(Argument) {
    return (typeof Argument === "object" &&
        Argument !== null &&
        "Name" in Argument &&
        "Path" in Argument &&
        typeof Argument.Name === "string" &&
        typeof Argument.Path === "string" &&
        IsValidTypeName(Argument.Name) &&
        IsValidDependencyImportSpecifier(Argument.Path));
}
//# sourceMappingURL=Config.Internal.js.map