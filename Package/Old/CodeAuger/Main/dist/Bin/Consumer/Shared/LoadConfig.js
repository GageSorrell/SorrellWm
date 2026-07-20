/**
 * @file      LoadConfig.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import * as ProviderConfig from "../../../Provider/Config/Config.js";
import { Effect, Path as PathService } from "effect";
import { $SchemaKey } from "../../../Shared/Config/Config.js";
import { Primitive } from "@sorrell/effect/unstable/cli";
import { ProviderConfigFileName } from "../../Provider/Providers.Command.js";
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
export function Provider(PackageName, NodeModulesDirectory) {
    return Effect.gen(function* () {
        const Path = yield* PathService.Path;
        const ProviderPath = Path.resolve(NodeModulesDirectory, PackageName, ProviderConfigFileName);
        const Parser = Primitive.fileSchema(ProviderConfig.Schema).parse;
        const { [$SchemaKey]: _, ...Out } = yield* Parser(ProviderPath);
        return Out;
    });
}
//# sourceMappingURL=LoadConfig.js.map