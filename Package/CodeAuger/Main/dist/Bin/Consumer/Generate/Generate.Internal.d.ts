/**
 * @file      Generate.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Effect } from "effect";
import type { ExportedType } from "../../../Provider/Config/index.js";
/**
 * For a given consumer (identified by its {@link TsConfigPath}), and a the {@link GenericType}
 * exported by a given provider of the consumer, get the locally exported
 * {@link ExportedType | ExportedTypes}, to augment the provider's registry interface with.
 *
 * @param TsConfigPath - The path to the `tsconfig.json` file for the consumer.
 *
 * @param GenericType - The generic {@link ExportedType} provided by a given provider
 * of the consumer.
 *
 * @returns {Effect.Effect<ReadonlyArray<ExportedType>, never, never>} The names and absolute
 * paths to the descendant types exported locally by the consumer, with which the provider's
 * export registry interface will be augmented.
 */
export declare function GetDescendantTypes(TsConfigPath: string, GenericType: ExportedType): Effect.Effect<ReadonlyArray<ExportedType>, never, never>;
/**
 * For a given module at path {@link OutPath}, and for each absolute module path in {@link Modules},
 * get the import path that can be used in the module at path {@link OutPath} to import from the respective
 * module.
 *
 * @param TypeScriptConfigFilePath - The path to the project's TypeScript config file.
 *
 * @param OutPath - The path to the module that will `import` contents that are exported by
 * the given {@link Modules}.
 *
 * @param Modules - The absolute paths to the consumer modules that export types that the
 * module at {@link OutPath} will `import`.
 *
 * @returns {ReadonlyArray<string>} The mapped paths, which can be used in `import` statements in the module
 * at {@link OutPath}.
 */
export declare function GetImportSpecifiersForModules(TypeScriptConfigFilePath: string, OutPath: string, Modules: ReadonlyArray<string>): ReadonlyArray<string>;
export declare const MapRecordEntriesEffect: <const InputRecord extends Readonly<Record<string, InputValue>>, InputValue, OutputKey extends PropertyKey, OutputValue, ErrorValue, Requirements>(RecordValue: InputRecord, Function: (Value: InputRecord[keyof InputRecord], Key: keyof InputRecord & string) => Effect.Effect<readonly [OutputKey, OutputValue], ErrorValue, Requirements>) => Effect.Effect<Readonly<Record<OutputKey, OutputValue>>, ErrorValue, Requirements>;
//# sourceMappingURL=Generate.Internal.d.ts.map