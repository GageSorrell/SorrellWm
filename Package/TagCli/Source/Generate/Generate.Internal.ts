/**
 * @file      Generate.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect, pipe } from "effect";
import { Code } from "@sorrell/cli-utilities/format";
import type { FGenerateConfig } from "./Generate.Internal.Types.js";
import { GetPackageJson } from "@sorrell/utilities/npm/effect";
import type { IPackageJson } from "package-json-type";
import { MakeConfig } from "../Command/Command.js";
import { Options } from "@sorrell/effect/unstable/cli";
import type { TagDecl } from "ts-tag/internal";

export const GenerateConfig: FGenerateConfig =
    MakeConfig({
        Out: pipe(
            Options.file("out", { exists: "either" }),
            Options.withAlias("o"),
            Options.withDefault(""),
            Options.withDescription("The path to which the generated module will be written.")
        )
    });

export function GetModuleContent(TagDecls: ReadonlyArray<TagDecl>): Effect.Effect<string, string>
{
    return Effect.gen(function*()
    {
        const IndentedLineBreak: string = "\n" + " ".repeat(8);

        const DependentPackageJson: IPackageJson = yield* pipe(
            GetPackageJson(),
            Effect.catchAll((_Error: unknown) =>
            {
                return Effect.die(
                    `Could not read your package's ${ Code("package.json") }!  Exiting...`
                );
            })
        );

        if (!("name" in DependentPackageJson) || DependentPackageJson.name === undefined)
        {
            return yield* Effect.die(`Could not read your package's ${ Code("package.json") }!  Exiting...`);
        }

        const DependentName: string = DependentPackageJson.name;

        const Inner: string = TagDecls.map((Tag: TagDecl): string =>
        {
            const DeclValue: string = JSON.stringify(Tag, null, 4)
                .replaceAll("\n", IndentedLineBreak);

            return `${ Tag.Value }: ${ DeclValue };`;
        }).join(IndentedLineBreak);

        const Tags: ReadonlyArray<string> = TagDecls.map(({ Value }: TagDecl): string =>
        {
            return Value;
        });

        return `/* eslint-disable */

/* AUTO-GENERATED MODULE.  DO NOT MODIFY. */

import { RegisterTagsRuntime } from "ts-tag/registrar";

declare module "ts-tag/registrar"
{
    export interface Registrar
    {
        ${ Inner }
    }
};

RegisterTagsRuntime(
    ${ DependentName },
    ${ Tags.join("\n" + " ".repeat(4)) }
): void

`;
    });
}
