/* File:      Renderer.Prod.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 * Comment:   Build config for electron renderer process.
 */

import * as Path from "path";
import { type Configuration, DefinePlugin, EnvironmentPlugin } from "webpack";
import { BaseConfiguration } from "./Base";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { CheckNodeEnvironment } from "../Script/CheckNodeEnvironment";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import { DeleteSourceMaps } from "../Script/DeleteSourceMaps";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { Paths } from "./Paths";
import TerserPlugin from "terser-webpack-plugin";
import { merge } from "webpack-merge";

CheckNodeEnvironment("production");
DeleteSourceMaps();

const Configuration: Configuration =
{
    devtool: "source-map",
    entry: [ Path.join(Paths.SourceRenderer, "index.tsx") ],
    mode: "production",
    module: {
        rules: [
            {
                include: /\.module\.s?(c|a)ss$/,
                test: /\.s?(a|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: true,
                            sourceMap: true
                        }
                    },
                    "sass-loader"
                ]
            },
            {
                exclude: /\.module\.s?(c|a)ss$/,
                test: /\.s?(a|c)ss$/,
                use: [ MiniCssExtractPlugin.loader, "css-loader", "sass-loader" ]
            },
            // Fonts
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource"
            },
            // Images
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: "asset/resource"
            },
            // SVG
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: "@svgr/webpack",
                        options: {
                            prettier: false,
                            ref: true,
                            svgo: false,
                            svgoConfig: {
                                plugins: [ { removeViewBox: false } ]
                            },
                            titleProp: true
                        }
                    },
                    "file-loader"
                ]
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [ new TerserPlugin(), new CssMinimizerPlugin() ]
    },
    output:
    {
        filename: "renderer.js",
        library:
        {
            type: "umd"
        },
        path: Paths.DistributionRenderer,
        publicPath: "./"
    },
    plugins:
    [
        /**
         * Create global constants which can be configured at compile time.
         *
         * Useful for allowing different behaviour between development builds and
         * release builds
         *
         * NODE_ENV should be production so that modules do not perform certain
         * development checks
         */
        /* @ts-expect-error Something with Webpack. */
        new EnvironmentPlugin({
            DEBUG_PROD: false,
            NODE_ENV: "production"
        }),
        new MiniCssExtractPlugin({
            filename: "style.css"
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: process.env.ANALYZE === "true" ? "server" : "disabled",
            analyzerPort: 8889
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            isBrowser: false,
            isDevelopment: false,
            minify:
            {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            },
            template: Path.join(Paths.SourceRenderer, "index.ejs")
        }),
        new DefinePlugin({
            "process.type": "\"renderer\""
        })
    ],
    target: [ "web", "electron-renderer" ]
};

export default merge(BaseConfiguration, Configuration);
