/**
 * @file      Remotion.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/typedef, jsdoc/require-jsdoc */

import { Config, type WebpackConfiguration } from "@remotion/cli/config";
import type { CodeHikeConfig } from "codehike/mdx";

export const DefaultCodeHikeConfig: CodeHikeConfig =
    {
        syntaxHighlighting:
        {
            theme: "github-dark"
        }
    };

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
async function EnableMdx(CurrentConfiguration: any): Promise<WebpackConfiguration>
{
    const { remarkCodeHike, recmaCodeHike } = await import("codehike/mdx");

    return {
        ...CurrentConfiguration,
        module:
        {
            ...CurrentConfiguration.module,
            rules:
            [
                ...(CurrentConfiguration.module?.rules
                    ? CurrentConfiguration.module.rules
                    : [ ]
                ),
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
            ]
        }
    };
};

Config.overrideWebpackConfig(EnableMdx);
Config.setVideoImageFormat("jpeg");
Config.setEntryPoint("./Source/index.ts");
