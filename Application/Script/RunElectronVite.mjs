/**
 *
 *
 * @module @sorrell/wm/Script/RunElectronVite
 * @internal
 *
 * @file      RunElectronVite.mjs
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { spawn } from "node:child_process";

const Require = createRequire(import.meta.url);
const ElectronViteManifest = Require.resolve("electron-vite/package.json");
const ElectronViteCli = join(dirname(ElectronViteManifest), "bin", "electron-vite.js");
const Environment = { ...process.env };

/* VS Code uses this variable internally, but Electron interprets it as a
 * request to run as plain Node.js. Never pass it to the application. */
delete Environment.ELECTRON_RUN_AS_NODE;

const ChildProcess = spawn(
    process.execPath,
    [ ElectronViteCli, ...process.argv.slice(2) ],
    {
        env: Environment,
        stdio: "inherit"
    }
);

ChildProcess.on("error", (Error) =>
{
    throw Error;
});

ChildProcess.on("exit", (ExitCode, Signal) =>
{
    if (Signal !== null)
    {
        process.kill(process.pid, Signal);
        return;
    }

    process.exitCode = ExitCode ?? 1;
});
