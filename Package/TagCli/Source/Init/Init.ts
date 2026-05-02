/**
 * @file      Init.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Console, Effect } from "effect";
import { Code } from "@sorrell/cli-utilities/format";
import { Command } from "@effect/cli";
import type { FCliConfigSchema } from "../Config/Config.Internal.Types.js";
import type { FInitOptions } from "./Init.Internal.Types.js";
import { FileSystem } from "@effect/platform";
import { InitConfig } from "./Init.Internal.js";
import type { PlatformError } from "@effect/platform/Error";
import { resolve } from "path";

function InitHandler({
    ConfigPath,
    Files,
    Out
}: FInitOptions): Effect.Effect<void, string | PlatformError, FileSystem.FileSystem>
{
    return Effect.gen(function*()
    {
        /* eslint-disable-next-line @typescript-eslint/typedef */
        const Fs = yield* FileSystem.FileSystem;

        if (Fs.exists(resolve(ConfigPath)))
        {
            return yield* Effect.die(
                `There already exists a file with path ${ Code(ConfigPath) }!  Exiting...`
            );
        }

        const Config: FCliConfigSchema =
            {
                $schema: "node_modules/ts-tag-cli/Resource/ts-tag.schema.json"
            };

        if (Out !== "")
        {
            Config.Out = Out;
        }

        if (Files !== "" && Files.length > 0)
        {
            Config.TagFiles = Files.map((([ Path ]: readonly [ string, string ]) => Path));
        }

        yield* Fs.writeFileString(resolve(ConfigPath), JSON.stringify(Config, null, 4));

        yield* Console.log(`✓ Wrote config file to ${ Code(ConfigPath) }!`);
    });
}

/* eslint-disable-next-line @typescript-eslint/typedef */
export const InitCommand = Command.make("init", InitConfig, InitHandler);
