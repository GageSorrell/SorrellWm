/* File:      Main.Prod.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 * Comment:   Webpack config for production electron main process.
 */

/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import * as Path from "path";
import { type Configuration, DefinePlugin, EnvironmentPlugin } from "webpack";
import { BaseConfiguration } from "./Base";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { CheckNodeEnvironment } from "../../Script/CheckNodeEnvironment";
import { DeleteSourceMaps } from "../../Script/DeleteSourceMaps";
import { Paths } from "../Script/Path";
import TerserPlugin from "terser-webpack-plugin";
import { merge } from "webpack-merge";

CheckNodeEnvironment("production");
DeleteSourceMaps();

const configuration: Configuration =
{
    devtool: "source-map",
    entry:
    {
        main: Paths.EntryPoint,
        preload: Path.join(Paths.Preload)
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
         * Useful for allowing different behavior between development builds and
         * release builds.
         *
         * `NODE_ENV` should be `"production"` so that modules do not perform certain
         * development checks.
         */
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
