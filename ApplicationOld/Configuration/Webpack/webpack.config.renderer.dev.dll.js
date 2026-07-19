"use strict";
/* File:      webpack.config.renderer.dev.dll.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 * Comment:   Builds the DLL for development electron renderer process.
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
const CheckNodeEnvironment_1 = require("../../Script/CheckNodeEnvironment");
const Paths_1 = require("../Script/Path");
const package_json_1 = require("../../package.json");
const webpack_merge_1 = require("webpack-merge");
(0, CheckNodeEnvironment_1.CheckNodeEnvironment)("development");
const configuration = {
    context: Paths_1.Paths.Root,
    devtool: "eval",
    entry: {
        renderer: Object.keys(package_json_1.dependencies || {})
    },
    externals: ["fsevents", "crypto-browserify"],
    mode: "development",
    /**
     * Use `module` from `webpack.config.renderer.dev.js`
     */
    /* eslint-disable-next-line @typescript-eslint/no-require-imports */
    module: require("./webpack.config.renderer.dev.js").default.module,
    output: {
        filename: "[name].dev.dll.js",
        library: {
            name: "renderer",
            type: "var"
        },
        path: Paths_1.Paths.Distribution
    },
    plugins: [
        new webpack_1.DllPlugin({
            name: "[name]",
            path: Path.join(Paths_1.Paths.Distribution, "[name].json")
        }),
        /**
         * Create global constants which can be configured at compile time.
         *
         * Useful for allowing different behavior between development builds and
         * release builds
         *
         * NODE_ENV should be production so that modules do not perform certain
         * development checks
         */
        new webpack_1.EnvironmentPlugin({
            NODE_ENV: "development"
        }),
        new webpack_1.LoaderOptionsPlugin({
            debug: true,
            options: {
                context: Paths_1.Paths.Source,
                output: {
                    path: Paths_1.Paths.Distribution
                }
            }
        })
    ],
    target: "electron-renderer"
};
exports.default = (0, webpack_merge_1.merge)(webpack_config_base_1.BaseConfiguration, configuration);
//# sourceMappingURL=webpack.config.renderer.dev.dll.js.map
