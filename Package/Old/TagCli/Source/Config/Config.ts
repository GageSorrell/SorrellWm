/**
 * @file      Config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { GetConfig, ParseTagsFile } from "./Config.Internal.js";
import { Code } from "@sorrell/cli-utilities/format";
import { Effect } from "effect";
import type { FCliConfig } from "./Config.Types.js";
import type { FFileText } from "../Command/Command.Types.js";
import { FileSystem } from "@effect/platform";
import type { PlatformError } from "@effect/platform/Error";
import type { TagDecl } from "ts-tag/internal";
import { basename } from "node:path";

export function GetProjectTags(
    Files: FFileText,
    Project: string
): Effect.Effect<ReadonlyArray<TagDecl>, string | PlatformError, FileSystem.FileSystem>
{
    return Effect.gen(function*()
    {
        if (Files === "")
        {
            const Config: FCliConfig = yield* GetConfig(Project);

            if (!("TagFiles" in Config))
            {
                return yield* Effect.die(
                    `No files were provided via the ${ Code("--file") } flag, and the config file ` +
                    `${ Code(basename(Project)) } does not have a ${ Code("\"TagFiles\"") } property!  ` +
                    "Exiting..."
                );
            }
            else if ("TagFiles" in Config && Config.TagFiles.length === 0)
            {
                return yield* Effect.die(
                    `No files were provided via the ${ Code("--file") } flag, and the config file ` +
                    `${ Code(basename(Project)) } has a ${ Code("\"TagFiles\"") } property, but it is ` +
                    "empty!  Exiting..."
                );
            }

            type EToFileTuple = Effect.Effect<[ string, string ], PlatformError, FileSystem.FileSystem>;

            /* eslint-disable-next-line @typescript-eslint/typedef */
            const Fs = yield* FileSystem.FileSystem;

            const TagFileTuples: ReadonlyArray<[ string, string ]> = yield* Effect.forEach(Config.TagFiles,
                (TagFilePath: string): EToFileTuple =>
                {
                    return Effect.gen(function*()
                    {
                        const Content: string = yield* Fs.readFileString(TagFilePath);
                        return [ TagFilePath, Content ];
                    });
                }
            );

            return (yield* Effect.forEach(TagFileTuples, ParseTagsFile)).flat();
        }
        else
        {
            return (yield* Effect.forEach(Files, ParseTagsFile)).flat();
        }
    });
}
