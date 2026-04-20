/**
 * @file      LinkModules.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import * as Fs from "fs";
import { Paths } from "../Configuration";

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
