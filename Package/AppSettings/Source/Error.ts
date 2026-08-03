/**
 * Error types and operations for schema-validated application settings.
 *
 * @module @sorrell/app-settings/Error
 *
 * @file      Error.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Operation from "./Operation.ts";
import { Data } from "effect";
import type { PlatformError } from "effect/PlatformError";
import type { SchemaError } from "effect/SchemaError";

/**
 * The base interface for errors in `@sorrell/app-settings`.
 *
 * @category Error
 * @since 1.0.0
 */
export interface AppSettingsError<CauseType, OpType extends Operation.Op>
{
    readonly Cause: CauseType;
    readonly Op: OpType;
    readonly FilePath: string;
}

/** {@inheritDoc FileError} */
interface FileErrorImpl extends AppSettingsError<PlatformError, Operation.File> { }

/**
 * A failure raised while accessing the settings file.
 */
export class FileError extends Data.TaggedError("AppSettingsFileError")<FileErrorImpl> { }

/** {@inheritDoc JsonError} */
interface JsonErrorImpl extends AppSettingsError<unknown, Operation.Json> { }

/** A failure raised while parsing or serializing the JSON document. */
export class JsonError extends Data.TaggedError("AppSettingsJsonError")<JsonErrorImpl> { }

/** {@inheritDoc ValidationError} */
interface ValidationErrorImpl extends AppSettingsError<SchemaError, Operation.Validation> { }

/** A settings value that did not satisfy the supplied schema. */
export class ValidationError extends Data.TaggedError("AppSettingsValidationError")<ValidationErrorImpl> { }

/**
 * Errors that can occur while loading settings from disk.
 *
 * @category Error
 * @since 2.0.0
 */
export type Any =
    | FileError
    | JsonError
    | ValidationError;
