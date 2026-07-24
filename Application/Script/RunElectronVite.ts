/**
 *
 *
 * @module @sorrell/wm/Script/RunElectronVite
 * @internal
 *
 * @file      RunElectronVite.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";

const Require = createRequire(import.meta.url);
const ElectronViteManifest = Require.resolve("electron-vite/package.json");
const ElectronViteCli = join(dirname(ElectronViteManifest), "bin", "electron-vite.js");
const env = { ...process.env };

/* VS Code uses this variable internally, but Electron *
 * interprets it as a request to run as plain NodeJS   */
delete env.ELECTRON_RUN_AS_NODE;

const ChildProcess = spawn(
    process.execPath,
    [ ElectronViteCli, ...process.argv.slice(2) ],
    {
        env,
        stdio: "inherit"
    }
);

ChildProcess.on("error", (Error: Error) => { throw Error; });

ChildProcess.on("exit", (ExitCode: number | null, Signal: NodeJS.Signals | null) =>
{
    if (Signal !== null)
    {
        process.kill(process.pid, Signal);
        return;
    }

    process.exitCode = ExitCode ?? 1;
});
