/**
 * @file      remotion.config.exported.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/typedef, jsdoc/require-jsdoc */

import * as Fs from "fs";
import * as Path from "path";
import { Config, type WebpackConfiguration } from "@remotion/cli/config";
import type { CodeHikeConfig } from "@sorrell/codehike/mdx";
import type { RuleSetRule } from "webpack";

export const DefaultCodeHikeConfig: CodeHikeConfig =
    {
        syntaxHighlighting:
        {
            theme: "github-dark"
        }
    };

const TsConfigPath: string = Path.resolve(process.cwd(), "tsconfig.json");
const TsConfigRaw: unknown = JSON.parse(Fs.readFileSync(TsConfigPath, "utf-8"));

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export async function EnableMdx(CurrentConfiguration: WebpackConfiguration): Promise<WebpackConfiguration>
{
    const { remarkCodeHike, recmaCodeHike } = await import("@sorrell/codehike/mdx");

    type FRule =
        | false
        | ""
        | 0
        | RuleSetRule
        | null
        | undefined;

    function HandleTsConfig(Rule: FRule): RuleSetRule | undefined
    {
        if (typeof Rule !== "object" || Rule === null || !("use" in Rule))
        {
            return undefined;
        }

        const UseValue = Rule.use;

        if (!Array.isArray(UseValue))
        {
            return Rule;
        }

        return {
            ...Rule,
            use: UseValue.map((LoaderEntry) =>
            {
                if (
                    typeof LoaderEntry === "object" &&
                    LoaderEntry !== null &&
                    "loader" in LoaderEntry &&
                    typeof LoaderEntry.loader === "string" &&
                    LoaderEntry.loader.includes("esbuild-loader")
                )
                {
                    return {
                        ...LoaderEntry,
                        options: {
                            ...((LoaderEntry.options as object) ?? { }),
                            tsconfigRaw: TsConfigRaw
                        }
                    };
                }

                return LoaderEntry;
            })
        };
    }

    const InitialRules: ReadonlyArray<FRule> =
        [
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            ...((CurrentConfiguration.module || { rules: [ ] }).rules || [ ] as Array<any>),
            {
                test: /\.mdx?$/,
                use:
                [
                    {
                        loader: "@mdx-js/loader",
                        options:
                        {
                            recmaPlugins: [ [ recmaCodeHike, DefaultCodeHikeConfig ] ],
                            remarkPlugins: [ [ remarkCodeHike, DefaultCodeHikeConfig ] ]
                        }
                    }
                ]
            }
        ];

    const rules: NonNullable<WebpackConfiguration["module"]>["rules"] =
        InitialRules.map(HandleTsConfig).filter((Rule: FRule | undefined): boolean =>
        {
            return Rule !== undefined;
        }) as NonNullable<WebpackConfiguration["module"]>["rules"];

    return {
        ...CurrentConfiguration,
        module:
        {
            ...CurrentConfiguration.module,
            rules
        }
    };
};

export function ApplyBaseConfig(): void
{
    Config.overrideWebpackConfig(EnableMdx);
}

export function ApplyDefaultConfig(EntryPoint: string = "./Source/index.tsx"): void
{
    ApplyBaseConfig();
    Config.setVideoImageFormat("jpeg");
    Config.setEntryPoint(EntryPoint);
}
