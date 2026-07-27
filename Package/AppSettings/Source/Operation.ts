/**
 * Operations performed by `@sorrell/app-settings`.
 *
 * @module @sorrell/app-settings/Operation
 *
 * @file      Operation.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * Identifies the file operation that failed.
 *
 * @category Operation
 * @since 2.0.0
 */
export type File =
        | "Check"
        | "CreateDirectory"
        | "CreateTemporary"
        | "Read"
        | "Replace"
        | "Watch"
        | "Write";

/**
 * Identifies the JSON operation that failed.
 *
 * @category Operation
 * @since 2.0.0
 */
export type Json =
        | "Parse"
        | "Stringify";

/**
 * Identifies the schema operation that failed.
 *
 * @category Operation
 * @since 2.0.0
 */
export type Validation =
        | "Decode"
        | "Encode";

/**
 * An operation performed by `@sorrell/app-settings`.
 *
 * @category Operation
 * @since 2.0.0
 */
export type Op =
        | Json
        | Validation
        | File;
