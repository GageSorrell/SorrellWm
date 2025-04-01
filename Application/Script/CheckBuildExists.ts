/* File:      CheckBuildExists.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 * Comment:   Check if the renderer and main bundles are built.
 */

import * as Fs from "fs";
import * as Path from "path";
import { Paths } from "../Configuration/Paths";
import chalk from "chalk";

const MainPath: string = Path.join(Paths.DistributionMain, "Main.js");
const RendererPath: string = Path.join(Paths.DistributionRenderer, "Renderer.js");

if (!Fs.existsSync(MainPath))
{
    throw new Error(
        chalk.whiteBright.bgRed.bold(
            "The main process is not built yet. Build it by running \"npm run build:main\""
        )
    );
}

if (!Fs.existsSync(RendererPath))
{
    throw new Error(
        chalk.whiteBright.bgRed.bold(
            "The renderer process is not built yet. Build it by running \"npm run build:renderer\""
        )
    );
}
