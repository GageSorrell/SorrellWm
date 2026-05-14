/**
 * @file      remotion.config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

// import { Config } from "@remotion/cli/config";

// /* eslint-disable-next-line @typescript-eslint/typedef */
// const CodeHikeConfiguration =
//     {
//         syntaxHighlighting:
//         {
//             theme: "github-dark-default"
//         }
//     };

// Config.setEntryPoint("./Source/index.tsx");
// Config.setVideoImageFormat("jpeg");
// Config.setOverwriteOutput(true);

// /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
// Config.overrideWebpackConfig(async (CurrentConfiguration: any) =>
// {
//     /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
//     const CodeHikeMdx: any = await import("codehike/mdx");

//     return {
//         ...CurrentConfiguration,
//         module: {
//             ...CurrentConfiguration.module,
//             rules: [
//                 ...(CurrentConfiguration.module?.rules ?? [ ]),
//                 {
//                     test: /\.mdx?$/,
//                     use: [
//                         {
//                             loader: "@mdx-js/loader",
//                             options: {
//                                 recmaPlugins:
//                                 [
//                                     [ CodeHikeMdx.recmaCodeHike, CodeHikeConfiguration ]
//                                 ],
//                                 remarkPlugins:
//                                 [
//                                     [ CodeHikeMdx.remarkCodeHike, CodeHikeConfiguration ]
//                                 ]
//                             }
//                         }
//                     ]
//                 }
//             ]
//         }
//     };
// });

import { Config } from "@remotion/cli/config";

const CodeHikeConfiguration = {
    syntaxHighlighting: {
        theme: "github-dark"
    }
};

Config.setEntryPoint("./Source/index.js");
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

Config.overrideWebpackConfig(async (CurrentConfiguration) =>
{
    const { remarkCodeHike, recmaCodeHike } = await import("codehike/mdx");

    return {
        ...CurrentConfiguration,
        module: {
            ...CurrentConfiguration.module,
            rules: [
                ...(CurrentConfiguration.module?.rules ?? [ ]),
                {
                    test: /\.md?$/,
                    use: [
                        {
                            loader: "@mdx-js/loader",
                            options: {
                                remarkPlugins: [
                                    [remarkCodeHike, CodeHikeConfiguration]
                                ],
                                recmaPlugins: [
                                    [recmaCodeHike, CodeHikeConfiguration]
                                ]
                            }
                        }
                    ]
                }
            ]
        }
    };
});
