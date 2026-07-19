/**
 * @file      Paths.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
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
