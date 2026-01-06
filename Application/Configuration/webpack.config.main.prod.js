"use strict";
/* File:      webpack.config.main.prod.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 * Comment:   Webpack config for production electron main process.
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
const CheckNodeEnvironment_1 = require("../Script/CheckNodeEnvironment");
const DeleteSourceMaps_1 = require("../Script/DeleteSourceMaps");
const Paths_1 = require("./Paths");
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const webpack_merge_1 = require("webpack-merge");
(0, CheckNodeEnvironment_1.CheckNodeEnvironment)("production");
(0, DeleteSourceMaps_1.DeleteSourceMaps)();
const configuration = {
    devtool: "source-map",
    mode: "production",
    target: "electron-main",
    entry: {
        main: Path.join(Paths_1.Paths.SourceMain, "Main.ts"),
        preload: Path.join(Paths_1.Paths.SourceMain, "Core", "Preload.ts")
    },
    /**
     * Disables webpack processing of __dirname and __filename.
     * If you run the bundle in node.js it falls back to these values of node.js.
     * https://github.com/webpack/webpack/issues/2010
     */
    node: {
        __dirname: false,
        __filename: false
    },
    output: {
        filename: "[name].js",
        library: {
            type: "umd"
        },
        path: Paths_1.Paths.DistributionMain
    },
    optimization: {
        minimizer: [
            new terser_webpack_plugin_1.default({
                parallel: true
            })
        ]
    },
    plugins: [
        new webpack_bundle_analyzer_1.BundleAnalyzerPlugin({
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
        new webpack_1.EnvironmentPlugin({
            DEBUG_PROD: false,
            NODE_ENV: "production",
            START_MINIMIZED: false
        }),
        new webpack_1.DefinePlugin({
            "process.type": "\"browser\""
        })
    ],
};
exports.default = (0, webpack_merge_1.merge)(webpack_config_base_1.BaseConfiguration, configuration);
//# sourceMappingURL=webpack.config.main.prod.js.map