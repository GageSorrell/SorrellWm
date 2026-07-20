/**
 * @file      Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Args, type Command, Options } from "@sorrell/effect/unstable/cli";
import type { TConfig } from "./Command.Types.js";
import { pipe } from "effect";

export const BaseConfig: Command.Command.Config =
    {
        Files: pipe(
            Args.fileText({ name: "file" }),
            Args.atLeast(0),
            Args.withDefault(""),
            Args.withDescription(
                "The file(s) in your project that contain tags.  " +
                "These can be any mix of JSON, JSONL, YAML, or CSV."
            )
        ),
        Project: pipe(
            Options.fileText("project"),
            Options.withAlias("p"),
            Options.withDefault("./ts-tag.config.json"),
            Options.withDescription("The path to the configuration file for ts-tag.")
        )
    };

export function MakeConfig<const InnerConfigType extends Command.Command.Config>(
    InnerConfig: InnerConfigType
): TConfig<InnerConfigType>
{
    return {
        ...BaseConfig,
        ...InnerConfig
    } as TConfig<InnerConfigType>;
}
