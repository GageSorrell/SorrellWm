"use strict";
/* File:      webpack.config.main.dev.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 * Comment:   Webpack config for development electron main process.
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
const Webpack = __importStar(require("webpack"));
const webpack_config_base_1 = require("./webpack.config.base");
const webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
const CheckNodeEnvironment_1 = require("../Script/CheckNodeEnvironment");
const Paths_1 = require("./Paths");
const webpack_merge_1 = require("webpack-merge");
/* When an ESLint server is running, we can't set the NODE_ENV so we'll check if it's *
 * at the dev webpack config is not accidentally run in a production environment      */
if (process.env.NODE_ENV === "production") {
    (0, CheckNodeEnvironment_1.CheckNodeEnvironment)("development");
}
const Configuration = {
    devtool: "inline-source-map",
    entry: {
        main: Path.join(Paths_1.Paths.SourceMain, "Main.ts"),
        preload: Path.join(Paths_1.Paths.SourceMain, "Core", "Preload.ts")
    },
    mode: "development",
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
        filename: "[name].bundle.dev.js",
        library: {
            type: "umd"
        },
        path: Paths_1.Paths.Distribution
    },
    plugins: [
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        /* @ts-ignore */
        new webpack_bundle_analyzer_1.BundleAnalyzerPlugin({
            analyzerMode: process.env.ANALYZE === "true" ? "server" : "disabled",
            analyzerPort: 8888
        }),
        new Webpack.DefinePlugin({
            "process.type": "\"browser\""
        })
    ],
    target: "electron-main"
};
exports.default = (0, webpack_merge_1.merge)(webpack_config_base_1.BaseConfiguration, Configuration);
//# sourceMappingURL=webpack.config.main.dev.js.map