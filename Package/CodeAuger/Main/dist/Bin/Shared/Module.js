/**
 * @file      Module.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
var __rewriteRelativeImportExtension = (this && this.__rewriteRelativeImportExtension) || function (path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
        return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
            return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
        });
    }
    return path;
};
import { Code } from "@sorrell/cli-utilities/format";
import { Effect } from "effect";
export function GetModuleGenerator(Name, Path) {
    return Effect.tryPromise(async () => {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const GeneratorModule = await import(__rewriteRelativeImportExtension(Path));
        if (!(Name in GeneratorModule)) {
            throw new Error("");
        }
        if (typeof GeneratorModule[Name] !== "function") {
            throw new Error(""
            // `Module at ${ Path } exports a value named ${ Name }, ` +
            // `but it is ${ Chalk.italic("not") } a ${ Code("function") }.`
            );
        }
        const NumArgumentsNecessary = 3;
        if (GeneratorModule[Name].length !== NumArgumentsNecessary) {
            throw new Error(`Function ${Code(`"${Name}"`)} has incorrect argument vector ` +
                `(${GeneratorModule[Name].length} arguments, instead of ${NumArgumentsNecessary}).`);
        }
        return GeneratorModule[Name];
    });
}
//# sourceMappingURL=Module.js.map