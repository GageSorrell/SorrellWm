/* File:      webpack.config.base.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 * Comment:   Base webpack config used across other specific configs.
 */

import { type Configuration, EnvironmentPlugin } from "webpack";
import { dependencies as Externals } from "../Release/Application/package.json";
import { Paths } from "./Paths";
import TsconfigPathsPlugins from "tsconfig-paths-webpack-plugin";

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
                            module: "esnext"
                        },
                        /* Remove this line to enable type checking in webpack builds. */
                        transpileOnly: true
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
    /**
      * Determine the array of extensions that should be used to resolve modules.
      */
    resolve:
    {
        extensions: [ ".js", ".jsx", ".json", ".ts", ".tsx" ],
        modules: [ Paths.Source, "node_modules" ],
        /* There is no need to add aliases here, the paths in tsconfig get mirrored. */
        plugins: [ new TsconfigPathsPlugins() ]
    },
    stats: "errors-only"
};
