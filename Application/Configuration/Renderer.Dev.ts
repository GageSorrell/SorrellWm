/* File:      Renderer.Dev.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import "webpack-dev-server";
import * as Fs from "fs";
import * as Path from "path";
import { type ChildProcess, execSync, spawn } from "child_process";
import {
    type Configuration,
    DllReferencePlugin,
    EnvironmentPlugin,
    LoaderOptionsPlugin,
    NoEmitOnErrorsPlugin } from "webpack";
import { Log, LogError } from "./Common";
import { BaseConfiguration } from "./Base";
import { CheckNodeEnvironment } from "../Script/CheckNodeEnvironment";
import HtmlWebpackPlugin from "html-webpack-plugin";
import type { Middleware } from "webpack-dev-server";
import { Paths } from "./Paths";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import chalk from "chalk";
import { merge } from "webpack-merge";

/* When an ESLint server is running, we can't set the NODE_ENV so we'll check if it's *
 * at the dev webpack config is not accidentally run in a production environment.     */
if (process.env.NODE_ENV === "production")
{
    CheckNodeEnvironment("development");
}

const Port: number | string = process.env.PORT || 1212;
const Manifest: string = Path.resolve(Paths.Intermediate, "renderer.json");
const skipDLLs: boolean | undefined =
  module.parent?.filename.includes("Renderer.Dev.Dll") ||
  module.parent?.filename.includes("EsLint");

/* Warn if the DLL is not built. */
if (
    !skipDLLs &&
    !(Fs.existsSync(Paths.Intermediate) && Fs.existsSync(Manifest))
)
{
    /* eslint-disable-next-line @stylistic/max-len */
    Log(chalk.black.bgYellow.bold(`The DLL files are missing.  Sit back while we build them for you with ${ chalk.bgGray.white("npm run build-dll") }`));
    execSync("npm run postinstall");
}

const Configuration: Configuration =
{
    devServer:
    {
        compress: true,
        headers:
        {
            "Access-Control-Allow-Origin": "*"
        },
        historyApiFallback:
        {
            verbose: true
        },
        hot: true,
        port: Port,
        setupMiddlewares(Middlewares: Array<Middleware>)
        {
            Log("Starting Preload.js builder...");
            const PreloadProcess: ChildProcess = spawn(
                "npm",
                [ "run", "start:preload" ],
                {
                    shell: true,
                    stdio: "inherit"
                }
            )
                .on("close", (Code: number) => process.exit(Code!))
                .on("error", LogError);

            Log("Starting Main Process...");
            let Arguments: Array<string> = [ "run", "start:main" ];
            if (process.env.MAIN_ARGS)
            {
                Arguments = Arguments.concat(
                    [ "--", ...process.env.MAIN_ARGS.matchAll(/"[^"]+"|[^\s"]+/g) ].flat()
                );
            }

            const MainProcess: ChildProcess = spawn(
                "npm",
                Arguments,
                {
                    shell: true,
                    stdio: "pipe"
                }
            )
                .on("close", (code: number) =>
                {
                    PreloadProcess.kill();
                    process.exit(code!);
                })
                .on("error", LogError);

            if (MainProcess !== null && MainProcess.stdout !== null && MainProcess.stderr !== null)
            {
                /* Allow printing emoji and using terminal colors, and exclude filtered statements. */

                const OnStdOut = (Data: Buffer): void =>
                {
                    process.stdout.write(Data.toString("utf8"));
                };

                const OnStdErr = (Data: Buffer): void =>
                {
                    process.stderr.write(Data.toString("utf8"));
                };

                MainProcess.stdout.on("data", OnStdOut);
                MainProcess.stderr.on("data", OnStdErr);
            }
            return Middlewares;
        },
        static:
        {
            publicPath: "/"
        }
    },
    devtool: "inline-source-map",
    entry:
    [
        `webpack-dev-server/client?http://localhost:${ Port }/Distribution`,
        "webpack/hot/only-dev-server",
        Path.join(Paths.SourceRenderer, "index.tsx")
    ],
    mode: "development",
    module:
    {
        rules:
        [
            {
                include: /\.module\.s?(c|a)ss$/,
                test: /\.s?(c|a)ss$/,
                use:
                [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options:
                        {
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
                use: [ "style-loader", "css-loader", "sass-loader" ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource"
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: "asset/resource"
            },
            {
                test: /\.svg$/,
                use:
                [
                    {
                        loader: "@svgr/webpack",
                        options:
                        {
                            prettier: false,
                            ref: true,
                            svgo: false,
                            svgoConfig:
                            {
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
    node:
    {
        __dirname: false,
        __filename: false
    },
    output:
    {
        filename: "renderer.dev.js",
        library:
        {
            type: "umd"
        },
        path: Paths.DistributionRenderer,
        publicPath: "/"
    },
    plugins: [
        ...(skipDLLs
            ? [ ]
            : [
                new DllReferencePlugin({
                    context: Paths.Intermediate,
                    /* eslint-disable-next-line @typescript-eslint/no-require-imports */
                    manifest: require(Manifest),
                    sourceType: "var"
                })
            ]),
        new NoEmitOnErrorsPlugin(),
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
        new EnvironmentPlugin({
            NODE_ENV: "development"
        }),
        new LoaderOptionsPlugin({
            debug: true
        }),
        new ReactRefreshWebpackPlugin(),
        new HtmlWebpackPlugin({
            env: process.env.NODE_ENV,
            filename: Path.join("index.html"),
            isBrowser: false,
            isDevelopment: process.env.NODE_ENV !== "production",
            minify:
            {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            },
            nodeModules: Paths.AppNodeModules,
            template: Path.join(Paths.SourceRenderer, "index.ejs")
        })
    ],
    target: [ "web", "electron-renderer" ]
};

export default merge(BaseConfiguration, Configuration);
