/**
 * @file      Init.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Args, Options } from "@effect/cli";
import type { FInitConfig } from "./Init.Internal.Types.js";
import { MakeConfig } from "../Command/Command.js";
import { pipe } from "effect";

export const InitConfig: FInitConfig =
    MakeConfig({
        ConfigPath: pipe(
            Args.file({ exists: "no", name: "config-path" }),
            Args.withDefault("./ts-tag.config.json"),
            Args.withDescription("The path to the settings file that this command will create.")
        ),
        Out: pipe(
            Options.file("out", { exists: "either" }),
            Options.withAlias("o"),
            Options.withDefault(""),
            Options.withDescription("The path to which the generated module will be written.")
        )
    });
