/**
 * Configuration operations for local monorepo setup.
 *
 * @module @sorrell/wm-monorepo-setup/Configuration
 *
 * @file      Configuration.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Data, Effect, FileSystem } from "effect";

/**
 * Persistent state stored in `Configuration/CodeExtension.json`.
 */
export interface ILocalConfiguration
{
    readonly HasRun: boolean;
}

/**
 * An error raised when local setup state cannot be interpreted safely.
 */
export class LocalConfigError extends Data.TaggedError("LocalConfigError")<{
    readonly Cause?: unknown;
    readonly Message: string;
}> { }

const DefaultLocalConfiguration: ILocalConfiguration =
    {
        HasRun: false
    };

/**
 * Create the local configuration when absent, then read and validate it.
 *
 * @param LocalConfigurationPath - The repository-local state file path.
 * @returns {Effect.Effect<ILocalConfiguration>} The validated setup state.
 */
export function EnsureLocalConfiguration(
    LocalConfigurationPath: string
): Effect.Effect<ILocalConfiguration, Error, FileSystem.FileSystem>
{
    return Effect.gen(function*()
    {
        const FileSystemService: FileSystem.FileSystem = yield* FileSystem.FileSystem;
        const Exists: boolean = yield* FileSystemService.exists(LocalConfigurationPath);

        if (!Exists)
        {
            yield* WriteLocalConfiguration(LocalConfigurationPath, DefaultLocalConfiguration);
        }

        const Content: string = yield* FileSystemService.readFileString(LocalConfigurationPath);
        const Parsed: unknown = yield* Effect.try({
            catch: (Cause: unknown): LocalConfigError =>
                new LocalConfigError({
                    Cause,
                    Message: `Could not parse ${ LocalConfigurationPath } as JSON.`,
                }),
            try: (): unknown => JSON.parse(Content)
        });

        if (!IsLocalConfiguration(Parsed))
        {
            return yield* Effect.fail(new LocalConfigError({
                Message: `${ LocalConfigurationPath } must contain a boolean HasRun property.`
            }));
        }

        return Parsed;
    });
}

/**
 * Persist local setup state in the repository's standard JSON style.
 *
 * @param LocalConfigurationPath - The repository-local state file path.
 * @param Configuration - The setup state to persist.
 * @returns {Effect.Effect<void>} An effect that completes after the write.
 */
export function WriteLocalConfiguration(
    LocalConfigurationPath: string,
    Configuration: ILocalConfiguration
): Effect.Effect<void, Error, FileSystem.FileSystem>
{
    return Effect.gen(function*()
    {
        const FileSystemService: FileSystem.FileSystem = yield* FileSystem.FileSystem;
        const Content: string = `${ JSON.stringify(Configuration, undefined, 4) }\n`;

        yield* FileSystemService.writeFileString(LocalConfigurationPath, Content);
    });
}

/**
 * Delete local setup state if it exists.
 *
 * @param LocalConfigurationPath - The repository-local state file path.
 * @returns {Effect.Effect<void>} An effect that completes after removal.
 */
export function ClearLocalConfiguration(
    LocalConfigurationPath: string
): Effect.Effect<void, Error, FileSystem.FileSystem>
{
    return Effect.gen(function*()
    {
        const FileSystemService: FileSystem.FileSystem = yield* FileSystem.FileSystem;

        yield* FileSystemService.remove(LocalConfigurationPath, { force: true });
    });
}

/**
 * Determine whether parsed JSON has the required local configuration shape.
 *
 * @param Value - The parsed value to inspect.
 * @returns {boolean} Whether the value contains a boolean `HasRun` property.
 */
function IsLocalConfiguration(Value: unknown): Value is ILocalConfiguration
{
    return typeof Value === "object"
        && Value !== null
        && "HasRun" in Value
        && typeof Value.HasRun === "boolean";
}
