/**
 * @file      Paths.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import * as Path from "path";
import type { FWebpackPath } from "./Path.Types";

const Root: string = Path.resolve(__dirname, "../..");
const ConfigurationPath: string = Path.resolve(__dirname);

const App: string = Path.join(Root, "Release", "Application");
const Distribution: string = Path.join(App, "Distribution");
const Release: string = Path.join(Root, "Release");
const Source: string = Path.join(Root, "Source");
const SourceMain: string = Path.join(Source, "Main");

export const Paths: Readonly<Record<FWebpackPath, string>> =
{
    App,
    AppNodeModules: Path.join(App, "node_modules"),
    AppPackage: Path.join(App, "package.json"),
    Build: Path.join(Release, "Build"),
    ConfigurationNodeModules: Path.join(ConfigurationPath, "node_modules"),
    Distribution,
    DistributionMain: Path.join(Distribution, "Main"),
    DistributionRenderer: Path.join(Distribution, "Renderer"),
    EntryPoint: Path.join(SourceMain, "Initialize", "EntryPoint.ts"),
    Intermediate: Path.join(Root, "Intermediate"),
    Preload: Path.join(SourceMain, "Initialize", "Preload.ts"),
    Release,
    Root,
    Source,
    SourceMain,
    SourceNodeModules: Path.join(Source, "node_modules"),
    SourceRenderer: Path.join(Source, "Renderer"),
    SourceShared: Path.join(Source, "Shared")
} as const;
