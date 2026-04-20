/**
 * @file      DeleteSourceMaps.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import * as Fs from "fs";
import { Paths } from "../Configuration/Script";
import path from "path";
import { rimrafSync } from "rimraf";

export function DeleteSourceMaps()
{
    if (Fs.existsSync(Paths.DistributionMain))
    {
        rimrafSync(
            path.join(Paths.DistributionMain, "*.js.map"),
            {
                glob: true
            }
        );
    }
    if (Fs.existsSync(Paths.DistributionRenderer))
    {
        rimrafSync(
            path.join(Paths.DistributionRenderer, "*.js.map"),
            {
                glob: true
            }
        );
    }
}
