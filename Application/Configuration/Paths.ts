/* File:      webpack.paths.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import * as Path from "path";
import type { FWebpackPaths } from "./Paths.Types";

const Root: string = Path.join(__dirname, "../..");
const ConfigurationPath: string = Path.join(__dirname, "..");
const DistributionPath: string = Path.join(__dirname, "../dll");
const Source: string = Path.join(Root, "Source");
const Release: string = Path.join(Root, "Release");
const App: string = Path.join(Release, "Application");
const Distribution: string = Path.join(App, "Distribution");

export const Paths: Record<FWebpackPaths, string> =
{
    App,
    AppNodeModules: Path.join(App, "node_modules"),
    AppPackage: Path.join(App, "package.json"),
    Build: Path.join(Release, "Build"),
    ConfigurationNodeModules: Path.join(ConfigurationPath, "node_modules"),
    Distribution,
    DistributionMain: Path.join(Distribution, "Main"),
    DistributionRenderer: Path.join(Distribution, "Renderer"),
    Release,
    Root,
    Source,
    SourceMain: Path.join(Source, "Main"),
    SourceNodeModules: Path.join(Source, "node_modules"),
    SourceRenderer: Path.join(Source, "Renderer")
};
