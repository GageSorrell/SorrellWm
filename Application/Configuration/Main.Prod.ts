/* File:      Main.Prod.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 * Comment:   Webpack config for production electron main process.
 */

import * as Path from "path";
import { type Configuration, DefinePlugin, EnvironmentPlugin } from "webpack";
import { BaseConfiguration } from "./Base";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { CheckNodeEnvironment } from "../Script/CheckNodeEnvironment";
import { DeleteSourceMaps } from "../Script/DeleteSourceMaps";
import { Paths } from "./Paths";
import TerserPlugin from "terser-webpack-plugin";
import { merge } from "webpack-merge";

CheckNodeEnvironment("production");
DeleteSourceMaps();

const configuration: Configuration =
{
    devtool: "source-map",
    entry:
    {
        main: Path.join(Paths.SourceMain, "Main.ts"),
        preload: Path.join(Paths.SourceMain, "Core", "Preload.ts")
    },
    mode: "production",
    /**
     * Disables webpack processing of __dirname and __filename.
     * If you run the bundle in node.js it falls back to these values of node.js.
     * https://github.com/webpack/webpack/issues/2010
     */
    node:
    {
        __dirname: false,
        __filename: false
    },
    optimization:
    {
        minimizer:
        [
            new TerserPlugin({
                parallel: true
            })
        ]
    },
    output:
    {
        filename: "[name].js",
        library:
        {
            type: "umd"
        },
        path: Paths.DistributionMain
    },
    plugins:
    [
        new BundleAnalyzerPlugin({
            analyzerMode: process.env.ANALYZE === "true" ? "server" : "disabled",
            analyzerPort: 8888
        }),
        /**
         * Create global constants which can be configured at compile time.
         *
         * Useful for allowing different behaviour between development builds and
         * release builds
         *
         * NODE_ENV should be production so that modules do not perform certain
         * development checks
         */
        /* @ts-expect-error DEBUG_PROD type. */
        new EnvironmentPlugin({
            DEBUG_PROD: false,
            NODE_ENV: "production",
            START_MINIMIZED: false
        }),
        new DefinePlugin({
            "process.type": "\"browser\""
        })
    ],
    target: "electron-main"
};

export default merge(BaseConfiguration, configuration);
