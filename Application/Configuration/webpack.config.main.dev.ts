/* File:      webpack.config.main.dev.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 * Comment:   Webpack config for development electron main process.
 */

import * as Path from "path";
import * as Webpack from "webpack";
import { BaseConfiguration } from "./webpack.config.base";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { CheckNodeEnvironment } from "../Script/CheckNodeEnvironment";
import { Paths } from "./Paths";
import { merge } from "webpack-merge";

/* When an ESLint server is running, we can't set the NODE_ENV so we'll check if it's *
 * at the dev webpack config is not accidentally run in a production environment      */
if (process.env.NODE_ENV === "production")
{
    CheckNodeEnvironment("development");
}

const Configuration: Webpack.Configuration =
{
    devtool: "inline-source-map",
    entry:
    {
        main: Path.join(Paths.SourceMain, "Main.ts"),
        preload: Path.join(Paths.SourceMain, "Core", "Preload.ts")
    },
    mode: "development",
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
        filename: "[name].bundle.dev.js",
        library:
        {
            type: "umd"
        },
        path: Paths.Intermediate
    },
    plugins: [
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    /* @ts-ignore */
        new BundleAnalyzerPlugin({
            analyzerMode: process.env.ANALYZE === "true" ? "server" : "disabled",
            analyzerPort: 8888
        }),
        new Webpack.DefinePlugin({
            "process.type": "\"browser\""
        })
    ],
    target: "electron-main"
};

export default merge(BaseConfiguration, Configuration);
