/**
 * @file      Config.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as CSV from "csv-parse/sync";
import * as YAML from "yaml";
import { basename, resolve } from "path";
import { Code } from "@sorrell/cli-utilities/format";
import type { ETryParse } from "./Config.Internal.Types.js";
import { Effect } from "effect";
import type { FCliConfig } from "./Config.Types.js";
import { FileSystem } from "@effect/platform";
import type { PlatformError } from "@effect/platform/Error";
import type { TagDecl } from "ts-tag/internal";

function TryParseJson(
    [ Path, Content ]: [ string, string ]
): ETryParse
{
    return Effect.gen(function*()
    {
        try
        {
            const ParsedContent: unknown = JSON.parse(Content);
            if (typeof ParsedContent === "object" && ParsedContent !== null && "Tags" in ParsedContent)
            {
                if (Array.isArray(ParsedContent.Tags))
                {
                    return ParsedContent.Tags;
                }
                else
                {
                    return yield* Effect.die(
                        `The JSON file ${ Code(basename(Path)) } has property ${ Code("\"Tags\"") }, ` +
                        `but it is not an ${ Code("Array") }.  Exiting...`
                    );
                }
            }
            else
            {
                return yield* Effect.die(
                    `The JSON file ${ Code(basename(Path)) } does not have a ${ Code("\"Tags\"") } ` +
                    `property of type ${ Code("Array<TagDecl>") }.  Exiting...`
                );
            }
        }
        catch
        {
            return undefined;
        }
    });
}

function TryParseJsonl(
    [ Path, Content ]: [ string, string ]
): Effect.Effect<ReadonlyArray<TagDecl> | undefined, string>
{
    return Effect.gen(function*()
    {
        try
        {
            const Tags: ReadonlyArray<unknown> = Content
                .split(/\r?\n/)
                .filter((Line: string) => Line.trim().length > 0)
                .map((Line: string) => JSON.parse(Line)) as ReadonlyArray<TagDecl>;

            if (Tags.every((Tag: unknown) => typeof Tag === "object"))
            {
                return Tags as ReadonlyArray<TagDecl>;
            }
            else
            {
                return yield* Effect.die(
                    `The JSONL file ${ Code(basename(Path)) } has lines that are not valid JSON objects.  ` +
                    "Exiting..."
                );
            }
        }
        catch
        {
            return undefined;
        }
    });
}

function TryParseYaml(
    [ Path, Content ]: [ string, string ]
): Effect.Effect<ReadonlyArray<TagDecl> | undefined, string>
{
    return Effect.gen(function*()
    {
        try
        {
            const ParsedContent: unknown = YAML.parse(Content);
            if (Array.isArray(ParsedContent))
            {
                return ParsedContent as ReadonlyArray<TagDecl>;
            }
            else
            {
                return yield* Effect.die(
                    `The YAML file ${ Code(basename(Path)) } is not an ${ Code("Array") }.  Exiting...`
                );
            }
        }
        catch
        {
            return undefined;
        }
    });
}

function TryParseCsv(
    [ Path, Content ]: [ string, string ]
): ETryParse
{
    return Effect.gen(function*()
    {
        try
        {
            const ParsedContent: unknown = CSV.parse(Content, { columns: true, skip_empty_lines: true });
            if (Array.isArray(ParsedContent))
            {
                return ParsedContent as ReadonlyArray<TagDecl>;
            }
            else
            {
                return yield* Effect.die(
                    `The CSV file ${ Code(basename(Path)) } did not parse into an ${ Code("Array") } of ` +
                    "items.  Exiting..."
                );
            }
        }
        catch
        {
            return undefined;
        }
    });
}

export function ParseTagsFile(
    [ Path, Content ]: readonly [ string, string ]
): Effect.Effect<ReadonlyArray<TagDecl>, string>
{
    const Parsers: ReadonlyArray<typeof TryParseJson> =
        [
            TryParseJson,
            TryParseJsonl,
            TryParseYaml,
            TryParseCsv
        ] as const;

    return Effect.gen(function*()
    {
        let ParsedContent: ReadonlyArray<TagDecl> | undefined = undefined;

        for (const Parser of Parsers)
        {
            ParsedContent = yield* Parser([ Path, Content ]);
            if (ParsedContent !== undefined)
            {
                break;
            }
        }

        if (ParsedContent === undefined)
        {
            return yield* Effect.die(
                `The file ${ Code(basename(Path)) } could not be parsed as any of ` +
                "the supported file formats.  Exiting..."
            );
        }

        return ParsedContent;
    });
}

export function GetConfig(
    Project: string
): Effect.Effect<FCliConfig, string | PlatformError, FileSystem.FileSystem>
{
    return Effect.gen(function*()
    {
        /* eslint-disable-next-line @typescript-eslint/typedef */
        const Fs = yield* FileSystem.FileSystem;

        const ConfigFileExists: boolean = yield* Fs.exists(resolve(Project));
        if (!ConfigFileExists)
        {
            return yield* Effect.die(
                `The config file ${ Code(basename(Project)) } does not exist!  Exiting...`
            );
        }

        const ConfigString: string = yield* Fs.readFileString(resolve(Project));
        let Out: FCliConfig | undefined = undefined;

        try
        {
            Out = JSON.parse(ConfigString) as FCliConfig;
        }
        catch
        {
            return yield* Effect.die(
                `The config file ${ Code(basename(Project)) } exists, but could not be parsed!  Exiting...`
            );
        }

        return Out as FCliConfig;
    });
}
