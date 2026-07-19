"use strict";
/* File:      webpack.config.base.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 * Comment:   Base webpack config used across other specific configs.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseConfiguration = void 0;
const webpack_1 = require("webpack");
const package_json_1 = require("../../Release/Application/package.json");
const Paths_1 = require("../Script/Path");
const tsconfig_paths_webpack_plugin_1 = __importDefault(require("tsconfig-paths-webpack-plugin"));
exports.BaseConfiguration = {
    externals: [...Object.keys(package_json_1.dependencies || {})],
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.[jt]sx?$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        compilerOptions: {
                            // module: "esnext"
                            module: "es2016",
                            allowImportingTsExtensions: true
                        },
                        /* Remove this line to enable type checking in webpack builds. */
                        transpileOnly: true
                    }
                }
            }
        ]
    },
    output: {
        /* https://github.com/webpack/webpack/issues/1114 */
        library: {
            type: "commonjs2"
        },
        path: Paths_1.Paths.Source
    },
    plugins: [
        new webpack_1.EnvironmentPlugin({
            NODE_ENV: "production"
        })
    ],
    /**
      * Determine the array of extensions that should be used to resolve modules.
      */
    resolve: {
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
        modules: [Paths_1.Paths.Source, "node_modules"],
        /* There is no need to add aliases here, the paths in tsconfig get mirrored. */
        plugins: [new tsconfig_paths_webpack_plugin_1.default()]
    },
    stats: "errors-only"
};
//# sourceMappingURL=webpack.config.base.js.map
