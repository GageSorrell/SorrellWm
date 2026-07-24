/**
 *
 *
 * @module @sorrell/log/Node/NodeMetadata
 *
 * @file      NodeMetadata.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ProcessMetadata } from "../LogRecord.js";

/** Capture authoritative metadata for the current Node or Electron process. */
export function Process(
    ProcessType = "Node",
    ThreadIdentifier?: string
): ProcessMetadata
{
    return {
        Architecture: process.arch,
        Platform: process.platform,
        ProcessIdentifier: process.pid,
        ProcessType,
        ...(ThreadIdentifier === undefined ? { } : { ThreadIdentifier })
    };
}
