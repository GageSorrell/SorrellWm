/* File:      Renderer.Dev.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import "webpack-dev-server";
import * as Fs from "fs";
import * as Path from "path";
import { type ChildProcess, execSync, spawn } from "child_process";
import { BaseConfiguration } from "./Base";
import { CheckNodeEnvironment } from "../Script/CheckNodeEnvironment";
import HtmlWebpackPlugin from "html-webpack-plugin";
import type { Middleware } from "webpack-dev-server";
import { Paths } from "./Paths";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import chalk from "chalk";
import { merge } from "webpack-merge";
import webpack from "webpack";

/* When an ESLint server is running, we can't set the NODE_ENV so we'll check if it's *
 * at the dev webpack config is not accidentally run in a production environment.     */
if (process.env.NODE_ENV === "production")
{
    CheckNodeEnvironment("development");
}

const Port: number | string = process.env.PORT || 1212;
const Manifest: string = Path.resolve(Paths.Intermediate, "renderer.json");
const skipDLLs: boolean | undefined =
  module.parent?.filename.includes("webpack.config.renderer.dev.dll") ||
  module.parent?.filename.includes("webpack.config.eslint");

/** Warn if the DLL is not built. */
if (
    !skipDLLs &&
    !(Fs.existsSync(Paths.Intermediate) && Fs.existsSync(Manifest))
)
{
    console.log(
        chalk.black.bgYellow.bold(
            "The DLL files are missing. Sit back while we build them for you with \"npm run build-dll\""
        )
    );
    execSync("npm run postinstall");
}

const configuration: webpack.Configuration = {
    devtool: "inline-source-map",

    mode: "development",

    target: [ "web", "electron-renderer" ],

    entry: [
        `webpack-dev-server/client?http://localhost:${ Port }/Distribution`,
        "webpack/hot/only-dev-server",
        Path.join(Paths.SourceRenderer, "index.tsx")
    ],

    output: {
        filename: "renderer.dev.js",
        library:
        {
            type: "umd"
        },
        path: Paths.DistributionRenderer,
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
                use: [ "style-loader", "css-loader", "sass-loader" ]
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
    plugins: [
        ...(skipDLLs
            ? [ ]
            : [
                new webpack.DllReferencePlugin({
                    context: Paths.Intermediate,
                    /* eslint-disable-next-line @typescript-eslint/no-require-imports */
                    manifest: require(Manifest),
                    sourceType: "var"
                })
            ]),

        new webpack.NoEmitOnErrorsPlugin(),

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
        new webpack.EnvironmentPlugin({
            NODE_ENV: "development"
        }),
        new webpack.LoaderOptionsPlugin({
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

    node: {
        __dirname: false,
        __filename: false
    },

    devServer: {
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
            console.log("Starting Preload.js builder...");
            const PreloadProcess: ChildProcess = spawn(
                "npm",
                [ "run", "start:preload" ],
                {
                    shell: true,
                    stdio: "inherit"
                }
            )
                .on("close", (Code: number) => process.exit(Code!))
                .on("error", console.error);

            console.log("Starting Main Process...");
            let Arguments: Array<string> = [ "run", "start:main" ];
            if (process.env.MAIN_ARGS)
            {
                Arguments = Arguments.concat(
                    [ "--", ...process.env.MAIN_ARGS.matchAll(/"[^"]+"|[^\s"]+/g) ].flat()
                );
            }
            const MyProcess: ChildProcess = spawn("npm", Arguments, {
                shell: true,
                stdio: "pipe"
            })
                .on("close", (code: number) =>
                {
                    PreloadProcess.kill();
                    process.exit(code!);
                })
                .on("error", console.error);

            if (MyProcess !== null && MyProcess.stdout !== null && MyProcess.stderr !== null)
            {
                const ToUtf8 = (Data: Buffer): void =>
                {
                    process.stdout.write(Data.toString("utf8"));
                };

                MyProcess.stdout.on("data", ToUtf8);
                MyProcess.stderr.on("data", ToUtf8);
            }
            return Middlewares;
        },
        static:
        {
            publicPath: "/"
        }
    }
};

export default merge(BaseConfiguration, configuration);
