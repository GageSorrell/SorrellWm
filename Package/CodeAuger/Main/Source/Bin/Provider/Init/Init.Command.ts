/**
 * @file      Init.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Path as EffectPath, FileSystem } from "@effect/platform";
import type { InitCommandEffect, InitCommandType } from "./Init.Command.Types.js";
import { Command } from "@effect/cli";
import { Effect } from "effect";
import { GetPackageRootDirectory } from "@sorrell/utilities/npm/effect";
import type { Handler } from "@sorrell/cli-utilities/cli";
import { MakeConfig } from "../../Shared/SubCommand.js";

/* eslint-disable-next-line @typescript-eslint/typedef, jsdoc/require-jsdoc */
export const InitConfig = MakeConfig({ });

/* eslint-disable-next-line jsdoc/require-jsdoc */
function HandleInit(
    Options: Handler.Argument<typeof InitConfig>
): InitCommandEffect
{
    return Effect.gen(function* ()
    {
        const { Cwd } = Options;
        const RootDirectory: string = yield* GetPackageRootDirectory(Cwd);

        const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;
        const Path: EffectPath.Path = yield* EffectPath.Path;

        const EmptyConfig: string = `import { DefineConfig } from "code-auger/provider";

export default DefineConfig({
    // The interface that acts as a "type registry" for your consumers
    // to register types with your package.
    // Interface: {
    //     // The name of the interface.
    //     Name: "",
    //     // The path that consumers can use to import this interface.
    //     Path: ""
    // },

    // The generic type that consumers will use to create their own types, which
    // \`code-auger\` will "register" with your package by generating a module in
    // the consumer's code base that augments the interface described in the above
    // property.
    // GenericProperty: {
    //     // The name of the generic type.
    //     Name: "",
    //     // The path that consumers can use to import this generic type.
    //     Path: ""
    // }
});\n`;

        yield* Fs.writeFileString(
            Path.join(RootDirectory, "code-auger.provider.ts"),
            EmptyConfig
        );
    });
}

export/** The `init` command, which creates a config file for the provider to fill out. */
const InitCommand: InitCommandType = Command.make("init", InitConfig, HandleInit);
