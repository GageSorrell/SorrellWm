/* File:      webpack.config.main.prod.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 * Comment:   Webpack config for production electron main process.
 */

import * as Path from "path";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import CheckNodeEnvironment from "../Script/CheckNodeEnvironment";
import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import { BaseConfiguration } from "./webpack.config.base";
import { merge } from "webpack-merge";
import webpackPaths from "./Paths";
import deleteSourceMaps from "../Script/delete-source-maps";

CheckNodeEnvironment("production");
deleteSourceMaps();

const configuration: webpack.Configuration = {
    devtool: "source-map",
    mode: "production",
    target: "electron-main",
    entry:
    {
        main: Path.join(webpackPaths.srcMainPath, "Main.ts"),
        preload: Path.join(webpackPaths.srcMainPath, "Core", "Preload.ts")
    },
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
    output:
    {
        path: webpackPaths.distMainPath,
        filename: "[name].js",
        library:
        {
            type: "umd"
        }
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
        new webpack.EnvironmentPlugin({
            NODE_ENV: "production",
            DEBUG_PROD: false,
            START_MINIMIZED: false
        }),
        new webpack.DefinePlugin({
            "process.type": "\"browser\""
        })
    ],
};

export default merge(BaseConfiguration, configuration);
