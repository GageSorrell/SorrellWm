/* File:      Renderer.Dev.Dll.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 * Comment:   Builds the DLL for development electron renderer process.
 */

import * as Path from "path";
import { type Configuration, DllPlugin, EnvironmentPlugin, LoaderOptionsPlugin } from "webpack";
import { BaseConfiguration } from "./Base";
import { CheckNodeEnvironment } from "../Script/CheckNodeEnvironment";
import { Paths } from "./Paths";
import { dependencies } from "../package.json";
import { merge } from "webpack-merge";

CheckNodeEnvironment("development");

const configuration: Configuration =
{
    context: Paths.Root,
    devtool: "eval",
    entry:
    {
        renderer: Object.keys(dependencies || {})
    },
    externals: [ "fsevents", "crypto-browserify" ],
    mode: "development",
    /**
     * Use `module` from `webpack.config.renderer.dev.js`
     */
    /* eslint-disable-next-line @typescript-eslint/no-require-imports */
    module: require("./webpack.config.renderer.dev").default.module,
    output:
    {
        filename: "[name].dev.dll.js",
        library:
        {
            name: "renderer",
            type: "var"
        },
        path: Paths.Distribution
    },
    plugins:
    [
        new DllPlugin({
            name: "[name]",
            path: Path.join(Paths.Intermediate, "[name].json")
        }),
        /**
         * Create global constants which can be configured at compile time.
         *
         * Useful for allowing different behavior between development builds and
         * release builds
         *
         * NODE_ENV should be production so that modules do not perform certain
         * development checks
         */
        new EnvironmentPlugin({
            NODE_ENV: "development"
        }),
        new LoaderOptionsPlugin({
            debug: true,
            options:
            {
                context: Paths.Source,
                output:
                {
                    path: Paths.Intermediate
                }
            }
        })
    ],
    target: "electron-renderer"
};

export default merge(BaseConfiguration, configuration);
