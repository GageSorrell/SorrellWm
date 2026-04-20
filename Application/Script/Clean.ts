/**
 * @file      Clean.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import * as Fs from "fs";
import { Paths } from "../Configuration/Script";
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
