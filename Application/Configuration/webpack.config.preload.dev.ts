/* File:      webpack.config.preload.dev.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import * as Path from "path";
import { type Configuration, EnvironmentPlugin, LoaderOptionsPlugin } from "webpack";
import { BaseConfiguration } from "./webpack.config.base";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { CheckNodeEnvironment } from "../Script/CheckNodeEnvironment";
import { Paths } from "./Paths";
import { merge } from "webpack-merge";

/* When an ESLint server is running, we can't set the NODE_ENV so we'll check if it's *
 * at the dev webpack config is not accidentally run in a production environment.     */
if (process.env.NODE_ENV === "production")
{
    CheckNodeEnvironment("development");
}

const Configuration: Configuration =
{
    devtool: "inline-source-map",
    entry: Path.join(Paths.SourceMain, "Core", "Preload.ts"),
    mode: "development",
    node:
    {
        __dirname: false,
        __filename: false
    },
    output: {
        filename: "preload.js",
        library:
        {
            type: "umd"
        },
        path: Paths.Intermediate
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: process.env.ANALYZE === "true" ? "server" : "disabled"
        }),
        /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     *
     * By default, use 'development' as NODE_ENV. This can be overriden with
     * 'staging', for example, by changing the ENV variables in the npm scripts
     */
        new EnvironmentPlugin({
            NODE_ENV: "development"
        }),
        new LoaderOptionsPlugin({
            debug: true
        })
    ],
    /**
     * Disables webpack processing of __dirname and __filename.
     * If you run the bundle in node.js it falls back to these values of node.js.
     * https://github.com/webpack/webpack/issues/2010
     */
    target: "electron-preload",
    watch: true
};

export default merge(BaseConfiguration, Configuration);
