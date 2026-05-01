/**
 * @file      LinkModules.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import { existsSync, symlinkSync } from "fs";
import { Paths } from "../Configuration/Script/Path";

const { AppNodeModules, ConfigurationNodeModules, SourceNodeModules } = Paths;

if (existsSync(AppNodeModules || ""))
{
    if (!existsSync(SourceNodeModules || ""))
    {
        symlinkSync(AppNodeModules || "", SourceNodeModules || "", "junction");
    }
    if (!existsSync(ConfigurationNodeModules || ""))
    {
        symlinkSync(AppNodeModules || "", ConfigurationNodeModules || "", "junction");
    }
}
