/* File:      DeleteSourceMaps.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import * as Fs from "fs";
import { Paths } from "../Configuration/Paths";
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
