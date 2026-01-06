"use strict";
/* File:      webpack.config.preload.dev.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
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
Object.defineProperty(exports, "__esModule", { value: true });
const Path = __importStar(require("path"));
const webpack_1 = require("webpack");
const webpack_config_base_1 = require("./webpack.config.base");
const webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
const CheckNodeEnvironment_1 = require("../Script/CheckNodeEnvironment");
const Paths_1 = require("./Paths");
const webpack_merge_1 = require("webpack-merge");
/* When an ESLint server is running, we can't set the NODE_ENV so we'll check if it's *
 * at the dev webpack config is not accidentally run in a production environment.     */
if (process.env.NODE_ENV === "production") {
    (0, CheckNodeEnvironment_1.CheckNodeEnvironment)("development");
}
const Configuration = {
    devtool: "inline-source-map",
    entry: Path.join(Paths_1.Paths.SourceMain, "Core", "Preload.ts"),
    mode: "development",
    node: {
        __dirname: false,
        __filename: false
    },
    output: {
        filename: "preload.js",
        library: {
            type: "umd"
        },
        path: Paths_1.Paths.Distribution
    },
    plugins: [
        new webpack_bundle_analyzer_1.BundleAnalyzerPlugin({
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
        new webpack_1.EnvironmentPlugin({
            NODE_ENV: "development"
        }),
        new webpack_1.LoaderOptionsPlugin({
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
exports.default = (0, webpack_merge_1.merge)(webpack_config_base_1.BaseConfiguration, Configuration);
//# sourceMappingURL=webpack.config.preload.dev.js.map