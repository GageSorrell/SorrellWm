/**
 * @file      process-output.interface.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ProcessOutput } from "./process-output.js";
import type { ProcessOutputStream } from "./process-output-stream.js";

export interface ProcessOutputRendererOptions
{
    /**
     * Pass your implementation of process output class to write to stdout and stderr.
     * Global option that can not be tempered with subtasks.
     * @default 'ProcessOutput'
     */
    processOutput?: ProcessOutput
}

/**
 * Customize the behavior of the ProcessOutput.
 */
export interface ProcessOutputOptions
{
    /**
     * After the `ProcessOutput.release()` which streams should be dumped.
     *
     * @default `[ 'stdout', 'stderr' ]`
     */
    dump?: Array<keyof ProcessOutputStreamMap>

    /**
     * After the `ProcessOutput.release()` whether to leave empty line or not.
     *
     * @default `true`
     */
    leaveEmptyLine?: boolean
}

export type ProcessOutputStreamMap = Record<"stdout" | "stderr", ProcessOutputStream>;
