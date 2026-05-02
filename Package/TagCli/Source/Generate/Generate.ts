/**
 * @file      Generate.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import { Console, Effect } from "effect";
import { GenerateConfig, GetModuleContent } from "./Generate.Internal.js";
import { Code } from "@sorrell/cli-utilities/format";
import { Command } from "@effect/cli";
import type { FCliConfig } from "../Config/Config.Types.js";
import type { FGenerateOptions } from "./Generate.Internal.Types.js";
import { FileSystem } from "@effect/platform";
import { GetConfig } from "../Config/Config.Internal.js";
import { GetProjectTags } from "../Config/Config.js";
import type { PlatformError } from "@effect/platform/Error";
import type { TagDecl } from "ts-tag/internal";
import { resolve } from "path";

function GenerateHandler({
    Files,
    Out,
    Project
}: FGenerateOptions): Effect.Effect<void, string | PlatformError, FileSystem.FileSystem>
{
    return Effect.gen(function*()
    {
        const Tags: ReadonlyArray<TagDecl> = yield* GetProjectTags(Files, Project);

        const Config: FCliConfig = yield* GetConfig(Project);

        const GeneratedModule: string = GetModuleContent(Tags);

        /* eslint-disable-next-line @typescript-eslint/typedef */
        const Fs = yield* FileSystem.FileSystem;

        const OutPath: string = Out === ""
            ? resolve(Config.Out || "")
            : resolve(Out);

        yield* Fs.writeFileString(OutPath, GeneratedModule, { flag: "w" });

        yield* Console.log(`✓ Wrote tag module to ${ Code(OutPath) }!`);
    });
}

/* eslint-disable-next-line @typescript-eslint/typedef */
export const GenerateCommand = Command.make("generate", GenerateConfig, GenerateHandler);
