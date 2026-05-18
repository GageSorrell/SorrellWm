/**
 * @file      remotion.config.js
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable @typescript-eslint/typedef, jsdoc/require-jsdoc */

import { Config } from "@remotion/cli/config";

export const DefaultCodeHikeConfig =
    {
        syntaxHighlighting:
        {
            theme: "github-dark"
        }
    };

export async function EnableMdx(CurrentConfiguration)
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

export function ApplyBaseConfig()
{
    Config.overrideWebpackConfig(EnableMdx);
}

export function ApplyDefaultConfig(EntryPoint = "./Source/index.tsx")
{
    ApplyBaseConfig();
    Config.setVideoImageFormat("jpeg");
    Config.setEntryPoint(EntryPoint);
}
