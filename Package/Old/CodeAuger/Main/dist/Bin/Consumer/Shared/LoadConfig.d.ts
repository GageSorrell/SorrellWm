/**
 * @file      LoadConfig.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import * as ProviderConfig from "../../../Provider/Config/Config.js";
import { Effect, type FileSystem, Path as PathService } from "effect";
/**
 * For a given consumer, load an installed provider's config file, given its {@link PackageName | name}
 * and the path to the consumer's {@link NodeModulesDirectory | node_modules directory}.
 *
 * @param PackageName - The name of the provider.  This must be its `"name"` in the provider's `package.json`.
 * @param NodeModulesDirectory - The path to the `node_modules` directory for the given consumer.
 *
 * @returns {Effect.Effect<ProviderConfig.Config, string, PathService.Path | FileSystem.FileSystem>} The
 * {@link ProviderConfig.Config | config} of {@link PackageName | the given provider}.
 */
export declare function Provider(PackageName: string, NodeModulesDirectory: string): Effect.Effect<ProviderConfig.Config, string, PathService.Path | FileSystem.FileSystem>;
//# sourceMappingURL=LoadConfig.d.ts.map