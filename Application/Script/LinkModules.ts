/* File:      LinkModules.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import * as Fs from "fs";
import { Paths } from "../Configuration/Paths";

const { AppNodeModules, ConfigurationNodeModules, SourceNodeModules } = Paths;

if (Fs.existsSync(AppNodeModules))
{
    if (!Fs.existsSync(SourceNodeModules))
    {
        Fs.symlinkSync(AppNodeModules, SourceNodeModules, "junction");
    }
    // if (!Fs.existsSync(erbNodeModulesPath))
    if (!Fs.existsSync(ConfigurationNodeModules))
    {
        Fs.symlinkSync(AppNodeModules, ConfigurationNodeModules, "junction");
    }
}
