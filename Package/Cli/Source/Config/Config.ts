/**
 * @file      Config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Config, type ConfigProvider as EffectConfigProvider, Option } from "effect";
import type { FCliConfigSchema, FGlobalConfig, TConfig, TConfigBase } from "./Config.Types.js";
import { ConfigSchema } from "./Config.Internal.js";
import type { FConfigBase } from "./Config.Internal.Types.js";
import type { Mutable } from "@sorrell/utilities/record";
import { PackageConfig } from "@sorrell/cli-utilities";
import { silent } from "../Options/Options.js";

export const GlobalConfig: FGlobalConfig = { silent };

export function MakeConfig<
    ConfigBaseType extends TConfigBase<InnerType>,
    InnerType extends FConfigBase
>(
    Config: ConfigBaseType
): TConfig<ConfigBaseType>
{
    return {
        ...Config,
        ...GlobalConfig
    };
}

export const ConfigProvider: EffectConfigProvider.ConfigProvider =
    PackageConfig.ConfigProvider(
        "@sorrell/cli",
        ConfigSchema,
        "Sorrell.Cli.Config.json"
    );

const ExtensionConfig: Config.Config<"js" | "ts" | "None" | undefined> = Config.literal(
    "js",
    "ts",
    "None"
)("Extension").pipe(
    Config.option,
    Config.map(Option.getOrUndefined)
);

const HeaderConfig: Config.Config<string | ReadonlyArray<string> | undefined> = Config.orElse(
    Config.array(Config.string(), "Header"),
    () => Config.string("Header")
).pipe(
    Config.option,
    Config.map(Option.getOrUndefined)
);

const IndexConfig: Config.Config<FCliConfigSchema["Index"]> =
    Config
        .all({
            Extension: ExtensionConfig,
            Header: HeaderConfig
        })
        .pipe(Config.map((Index: FCliConfigSchema["Index"]) =>
        {
            const Result: Mutable<FCliConfigSchema["Index"], false> = { };

            if (Index.Extension !== undefined)
            {
                Result.Extension = Index.Extension;
            }

            if (Index.Header !== undefined)
            {
                Result.Header = Index.Header;
            }

            return Result;
        }));

export const CliConfig: Config.Config<FCliConfigSchema> =
    Config
        .all({ Index: IndexConfig })
        .pipe(Config.nested("Index"));
