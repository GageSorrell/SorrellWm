/* File:      Clean.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import * as Fs from "fs";
import { Paths } from "../Configuration/Paths";
import { rimrafSync } from "rimraf";

const FoldersToRemove: Array<string> =
[
    Paths.Distribution,
    Paths.Build
    // Paths.Distribution,
];

FoldersToRemove.forEach((Folder: string): void =>
{
    if (Fs.existsSync(Folder))
    {
        rimrafSync(Folder);
    }
});
