/**
 * @file      Base.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 * Comment:   Base webpack config used across other specific configs.
 */

import { type Configuration, EnvironmentPlugin } from "webpack";
import { Paths } from "../Script/Path";
import TsconfigPathsPlugins from "tsconfig-paths-webpack-plugin";
import { readFileSync } from "fs";

const Externals: Record<string, string> =
    JSON.parse(readFileSync("./Release/Application/package.json", { encoding: "utf-8" })).dependencies;

export const BaseConfiguration: Configuration =
    {
        externals: [ ...Object.keys(Externals || { }) ],
        module:
        {
            rules:
            [
                {
                    exclude: /node_modules/,
                    test: /\.[jt]sx?$/,
                    use:
                    {
                        loader: "ts-loader",
                        options:
                        {
                            compilerOptions:
                            {
                                allowImportingTsExtensions: true,
                                module: "node16"
                            },
                            transpileOnly: false
                        }
                    }
                }
            ]
        },
        output:
        {
            /* https://github.com/webpack/webpack/issues/1114 */
            library:
            {
                type: "commonjs2"
            },
            path: Paths.Source
        },
        plugins:
        [
            new EnvironmentPlugin({
                NODE_ENV: "production"
            })
        ],
        /** Determine the array of extensions that should be used to resolve modules. */
        resolve:
        {
            extensions: [ ".js", ".jsx", ".json", ".ts", ".tsx" ],
            modules: [ Paths.Source, "node_modules" ],
            /* There is no need to add aliases here, the paths in tsconfig get mirrored. */
            plugins: [ new TsconfigPathsPlugins() ]
        },
        stats: "errors-only"
    };
