"use strict";
/* File:      webpack.config.renderer.dev.ts
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("webpack-dev-server");
const Fs = __importStar(require("fs"));
const Path = __importStar(require("path"));
const child_process_1 = require("child_process");
const webpack_config_base_1 = require("./webpack.config.base");
const CheckNodeEnvironment_1 = require("../../Script/CheckNodeEnvironment");
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const Paths_1 = require("../Script/Path");
const react_refresh_webpack_plugin_1 = __importDefault(require("@pmmmwh/react-refresh-webpack-plugin"));
const chalk_1 = __importDefault(require("chalk"));
const webpack_merge_1 = require("webpack-merge");
const webpack_1 = __importDefault(require("webpack"));
/* When an ESLint server is running, we can't set the NODE_ENV so we'll check if it's *
 * at the dev webpack config is not accidentally run in a production environment.     */
if (process.env.NODE_ENV === "production") {
    (0, CheckNodeEnvironment_1.CheckNodeEnvironment)("development");
}
const Port = process.env.PORT || 1212;
const Manifest = Path.resolve(Paths_1.Paths.Intermediate, "renderer.json");
const skipDLLs = module.parent?.filename.includes("webpack.config.renderer.dev.dll") ||
    module.parent?.filename.includes("webpack.config.eslint");
/** Warn if the DLL is not built. */
if (!skipDLLs &&
    !(Fs.existsSync(Paths_1.Paths.Distribution) && Fs.existsSync(Manifest))) {
    console.log(chalk_1.default.black.bgYellow.bold("The DLL files are missing. Sit back while we build them for you with \"npm run build-dll\""));
    (0, child_process_1.execSync)("npm run postinstall");
}
const configuration = {
    devtool: "inline-source-map",
    mode: "development",
    target: ["web", "electron-renderer"],
    entry: [
        `webpack-dev-server/client?http://localhost:${Port}/Distribution`,
        "webpack/hot/only-dev-server",
        Path.join(Paths_1.Paths.SourceRenderer, "index.tsx")
    ],
    output: {
        filename: "renderer.dev.js",
        library: {
            type: "umd"
        },
        path: Paths_1.Paths.DistributionRenderer,
        publicPath: "/"
    },
    module: {
        rules: [
            {
                include: /\.module\.s?(c|a)ss$/,
                test: /\.s?(c|a)ss$/,
                use: [
                    "style-loader",
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
                test: /\.s?css$/,
                use: ["style-loader", "css-loader", "sass-loader"]
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
    plugins: [
        ...(skipDLLs
            ? []
            : [
                new webpack_1.default.DllReferencePlugin({
                    context: Paths_1.Paths.Distribution,
                    /* eslint-disable-next-line @typescript-eslint/no-require-imports */
                    manifest: require(Manifest),
                    sourceType: "var"
                })
            ]),
        new webpack_1.default.NoEmitOnErrorsPlugin(),
        /**
         * Create global constants which can be configured at compile time.
         *
         * Useful for allowing different behavior between development builds and
         * release builds.
         *
         * NODE_ENV should be production so that modules do not perform certain
         * development checks.
         *
         * By default, use `development` as `NODE_ENV`.  This can be overridden with
         * `staging`, for example, by changing the ENV variables in the npm scripts.
         */
        new webpack_1.default.EnvironmentPlugin({
            NODE_ENV: "development"
        }),
        new webpack_1.default.LoaderOptionsPlugin({
            debug: true
        }),
        new react_refresh_webpack_plugin_1.default(),
        new html_webpack_plugin_1.default({
            env: process.env.NODE_ENV,
            filename: Path.join("index.html"),
            isBrowser: false,
            isDevelopment: process.env.NODE_ENV !== "production",
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            },
            nodeModules: Paths_1.Paths.AppNodeModules,
            template: Path.join(Paths_1.Paths.SourceRenderer, "index.ejs")
        })
    ],
    node: {
        __dirname: false,
        __filename: false
    },
    devServer: {
        compress: true,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        historyApiFallback: {
            verbose: true
        },
        hot: true,
        port: Port,
        setupMiddlewares(Middlewares) {
            console.log("Starting preload.js builder...");
            const preloadProcess = (0, child_process_1.spawn)("npm", ["run", "start:preload"], {
                shell: true,
                stdio: "inherit"
            })
                .on("close", (Code) => process.exit(Code))
                .on("error", console.error);
            console.log("Starting Main Process...");
            let Arguments = ["run", "start:main"];
            if (process.env.MAIN_ARGS) {
                Arguments = Arguments.concat(["--", ...process.env.MAIN_ARGS.matchAll(/"[^"]+"|[^\s"]+/g)].flat());
            }
            const MyProcess = (0, child_process_1.spawn)("npm", Arguments, {
                shell: true,
                stdio: "pipe"
            })
                .on("close", (code) => {
                preloadProcess.kill();
                process.exit(code);
            })
                .on("error", console.error);
            if (MyProcess !== null && MyProcess.stdout !== null && MyProcess.stderr !== null) {
                const ToUtf8 = (Data) => {
                    process.stdout.write(Data.toString("utf8"));
                };
                MyProcess.stdout.on("data", ToUtf8);
                MyProcess.stderr.on("data", ToUtf8);
            }
            return Middlewares;
        },
        static: {
            publicPath: "/"
        }
    }
};
exports.default = (0, webpack_merge_1.merge)(webpack_config_base_1.BaseConfiguration, configuration);
//# sourceMappingURL=webpack.config.renderer.dev.js.map
