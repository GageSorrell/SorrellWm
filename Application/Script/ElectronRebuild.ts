/* File:      ElectronRebuild.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import * as Fs from "fs";
import { Paths } from "../Configuration/Paths";
import { dependencies } from "../Release/Application/package.json";
import { execSync } from "child_process";

if (Object.keys(dependencies || {}).length > 0 && Fs.existsSync(Paths.AppNodeModules))
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
