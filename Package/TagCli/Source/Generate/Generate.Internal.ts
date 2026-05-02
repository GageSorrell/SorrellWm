/**
 * @file      Generate.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FGenerateConfig } from "./Generate.Internal.Types.js";
import { MakeConfig } from "../Command/Command.js";
import { Options } from "@effect/cli";
import type { TagDecl } from "ts-tag/internal";
import { pipe } from "effect";

export const GenerateConfig: FGenerateConfig =
    MakeConfig({
        Out: pipe(
            Options.file("out", { exists: "either" }),
            Options.withAlias("o"),
            Options.withDefault(""),
            Options.withDescription("The path to which the generated module will be written.")
        )
    });

export function GetModuleContent(TagDecls: ReadonlyArray<TagDecl>): string
{
    const IndentedLineBreak: string = "\n" + " ".repeat(8);

    const Inner: string = TagDecls.map((Tag: TagDecl): string =>
    {
        const DeclValue: string = JSON.stringify(Tag, null, 4)
            .replaceAll("\n", IndentedLineBreak);

        return `${ Tag.Value }: ${ DeclValue };`;
    }).join(IndentedLineBreak);

    return `/* eslint-disable */

/* AUTO-GENERATED MODULE.  DO NOT MODIFY. */

declare module "ts-tag/registrar"
{
    export interface Registrar
    {
        ${ Inner }
    }
};
`;
}
