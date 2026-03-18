/* File:      Paths.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import * as Path from "path";
import type { FDirectory } from "./Path.Types";

export const GetPath = (Directory: FDirectory): string =>
{
    const Paths: TRecord<FDirectory, string> =
    {
        Resource: Path.join(__dirname, "../Resource")
    };

    return Paths[Directory];
};
