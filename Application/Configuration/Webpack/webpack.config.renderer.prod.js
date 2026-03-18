"use strict";
/* File:      webpack.config.renderer.prod.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 * Comment:   Build config for electron renderer process.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Path = __importStar(require("path"));
const webpack_1 = require("webpack");
const webpack_config_base_1 = require("./webpack.config.base");
const webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
const CheckNodeEnvironment_1 = require("../../Script/CheckNodeEnvironment");
const css_minimizer_webpack_plugin_1 = __importDefault(require("css-minimizer-webpack-plugin"));
const DeleteSourceMaps_1 = require("../../Script/DeleteSourceMaps");
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const Paths_1 = require("../Script/Path");
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const webpack_merge_1 = require("webpack-merge");
(0, CheckNodeEnvironment_1.CheckNodeEnvironment)("production");
(0, DeleteSourceMaps_1.DeleteSourceMaps)();
const Configuration = {
    devtool: "source-map",
    entry: [Path.join(Paths_1.Paths.SourceRenderer, "index.tsx")],
    mode: "production",
    module: {
        rules: [
            {
                include: /\.module\.s?(c|a)ss$/,
                test: /\.s?(a|c)ss$/,
                use: [
                    mini_css_extract_plugin_1.default.loader,
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
                use: [mini_css_extract_plugin_1.default.loader, "css-loader", "sass-loader"]
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
                                plugins: [{ removeViewBox: false }]
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
        minimizer: [new terser_webpack_plugin_1.default(), new css_minimizer_webpack_plugin_1.default()]
    },
    output: {
        filename: "renderer.js",
        library: {
            type: "umd"
        },
        path: Paths_1.Paths.DistributionRenderer,
        publicPath: "./"
    },
    plugins: [
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
        new webpack_1.EnvironmentPlugin({
            DEBUG_PROD: false,
            NODE_ENV: "production"
        }),
        new mini_css_extract_plugin_1.default({
            filename: "style.css"
        }),
        new webpack_bundle_analyzer_1.BundleAnalyzerPlugin({
            analyzerMode: process.env.ANALYZE === "true" ? "server" : "disabled",
            analyzerPort: 8889
        }),
        new html_webpack_plugin_1.default({
            filename: "index.html",
            isBrowser: false,
            isDevelopment: false,
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            },
            template: Path.join(Paths_1.Paths.SourceRenderer, "index.ejs")
        }),
        new webpack_1.DefinePlugin({
            "process.type": "\"renderer\""
        })
    ],
    target: ["web", "electron-renderer"]
};
exports.default = (0, webpack_merge_1.merge)(webpack_config_base_1.BaseConfiguration, Configuration);
//# sourceMappingURL=webpack.config.renderer.prod.js.map
