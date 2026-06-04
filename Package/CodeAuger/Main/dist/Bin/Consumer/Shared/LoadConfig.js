/**
 * @file      LoadConfig.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import { Config } from "../../../Consumer/Config/Config.js";
import { ConfigFile } from "@sorrell/effect/unstable/cli";
import { Effect } from "effect";
import { Path as EffectPath } from "@effect/platform";
import { GetPackageRootDirectory } from "@sorrell/utilities/npm/effect";
import { Config as ProviderConfig } from "../../../Provider/Config/Config.js";
/**
 * Load a given consumer's config file.
 *
 * @param Cwd - The value of the `cwd` option.
 *
 * @returns {Effect.Effect<Config>} The {@link Effect.Effect | effect} that
 * retrieves the consumer's config.
 */
export function Consumer(Cwd) {
    return Effect.gen(function* () {
        const RootPath = yield* GetPackageRootDirectory(Cwd);
        return yield* ConfigFile.load("code-auger.config", RootPath, Config);
    });
}
/* eslint-disable-next-line jsdoc/require-jsdoc */
export function Provider(PackageName, NodeModulesDirectory) {
    return Effect.gen(function* () {
        const Path = yield* EffectPath.Path;
        const ProviderPath = Path.resolve(NodeModulesDirectory, PackageName);
        return yield* ConfigFile.load("code-auger.provider", ProviderPath, ProviderConfig);
    });
}
//# sourceMappingURL=LoadConfig.js.map