/* File:      Paths.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import * as Path from "path";
import type { FPaths } from "./Paths.Types";

export const GetPaths = (): Record<FPaths, string> =>
{
    return {
        Resource: Path.join(__dirname, "../../Resource")
    };
};
