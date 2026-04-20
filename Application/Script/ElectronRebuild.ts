/**
 * @file      ElectronRebuild.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import * as Fs from "fs";
import { Paths } from "../Configuration/Script";
import { dependencies as Dependencies } from "../Release/Application/package.json";
import { execSync } from "child_process";

const IsProjectConfigured: boolean = (
    Object.keys(Dependencies || { }).length > 0 &&
    Fs.existsSync(Paths.AppNodeModules)
);

if (IsProjectConfigured)
{
    /* eslint-disable-next-line @stylistic/max-len */
    const ElectronRebuildCommand: string = "../../node_modules/.bin/electron-rebuild --force --types prod,dev,optional --module-dir .";
    const Command: string = process.platform === "win32"
        ? ElectronRebuildCommand.replace(/\//g, "\\")
        : ElectronRebuildCommand;
    execSync(
        Command,
        {
            cwd: Paths.App,
            stdio: "inherit"
        });
}
