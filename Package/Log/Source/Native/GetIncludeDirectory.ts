/**
 *
 *
 * @module @sorrell/log/Native/GetIncludeDirectory
 *
 * @file      GetIncludeDirectory.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { fileURLToPath } from "node:url";

/** Return the absolute directory containing `sorrell/log.hpp`. */
export function GetIncludeDirectory(): string
{
    return fileURLToPath(new URL("../../native/include", import.meta.url));
}
