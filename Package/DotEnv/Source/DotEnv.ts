/**
 * Operations for loading environment variables from dotenv files.
 *
 * @module @sorrell/dotenv/DotEnv
 * @internal
 *
 * @file      DotEnv.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Array, Boolean, ConfigProvider, Effect, FileSystem, Function, Iterable, Match, Path, pipe, PlatformError, Record, String, Struct } from "effect";

/**
 * The options passed to effect's {@link ConfigProvider!fromDotEnv | fromDotEnv}.
 *
 * @since 1.0.0
 */
export type DotEnvOptionsBase = Parameters<typeof ConfigProvider.fromDotEnv>[0];

/**
 * The default, base name that is used when searching directories for dotenv files.
 * This value may be used where a suffix is required, and this value will be interpreted
 * as the absence of a suffix.
 *
 * @since 1.0.0
 */
export const DefaultFile = ".env" as const;
export type DefaultFile = typeof DefaultFile;

/**
 * The options provided to {@link fromDotEnv}.
 *
 * @since 1.0.0
 */
export type DotEnvOptions =
    DotEnvOptionsBase &
    {
        /**
         * Either the *directory* path in which the `.env*` files exist, or an array of paths
         * (any mix of files or directories) of the files to load.  Providing a single file path
         * (or no path at all) results in the behavior of the original `fromDotEnv` function.
         *
         * @since 1.0.0
         */
        readonly path?: string | undefined | Array.NonEmptyReadonlyArray<string>;

        /**
         * The suffixes of files to consider when iterating over the `path` property, such that
         * the order in which they exist determines the priority in which variables are selected.
         * The suffix-less file name `".env"` always has the *lowest* priority when loading files.
         *
         * @since 1.0.0
         */
        readonly suffixes?: Array.NonEmptyReadonlyArray<string>;

        /**
         * Whether to require that every suffix in `suffixes` is found.  Failing to find a file
         * with a given suffix will cause the effect to fail with BadArgument.  The default is
         * `false`.
         *
         * @since 1.0.0
         */
        readonly exactSuffixes?: boolean;
    };

const GetFilePaths: {
    (Options: NonNullable<Required<Pick<DotEnvOptions, "exactSuffixes" | "path" | "suffixes">>>):
    Effect.Effect<
        Record.ReadonlyRecord<string, string> | undefined,
        PlatformError.BadArgument,
        | FileSystem.FileSystem
        | Path.Path
    >;
} = ({ path, suffixes }) => undefined as unknown as any;

const Foo = ({
    path,
    suffixes
}: {
    readonly path: Array.NonEmptyReadonlyArray<string>;
    readonly suffixes: Array.NonEmptyReadonlyArray<string>;
}) => Effect.gen(function* ()
{
    const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;
    const PathService: Path.Path = yield* Path.Path;

    const GetError = (PathArg?: string) => ({ cause }: PlatformError.PlatformError) =>
        new PlatformError.BadArgument({
            cause,
            description: PathArg !== undefined
                ? `The path ${ PathArg } is not to a valid file or directory that exists.`
                : "A path was given that is not a valid file or directory that exists.",
            method: "GetError",
            module: "@sorrell/dotenv"
        });

    return yield* pipe(
        path,
        Array.ensure<string>,
        Array.map((PathArg: string) => Effect.gen(function* ()
        {
            const Info: FileSystem.File.Info = yield* Effect.mapError(Fs.stat(PathArg), GetError(PathArg));

            return [ PathArg, Info ] as const;
        })),
        Effect.all,
        Effect.map(Array.map(([ PathArg, Info ]: readonly [ string, FileSystem.File.Info ]) =>
            pipe(
                Match.value(Info),
                Match.when(
                    { type: "File" },
                    () => Effect.succeed(PathArg)
                ),
                Match.when(
                    { type: "Directory" },
                    () => Fs.readDirectory(PathArg, { recursive: false })
                ),
                Match.orElse(Effect.die),
                Effect.map(Array.ensure)
            )
        )),
        Effect.flatMap(Effect.all),
        Effect.map(Function.flow(
            Array.flatten,
            Array.map((Value: string) => PathService.basename(Value)),
            Array.filter(String.startsWith(".env")),
        ))
    );
});

export const fromDotEnv: {
    (options?: DotEnvOptions): Effect.Effect<
        ConfigProvider.ConfigProvider,
        PlatformError,
        FileSystem.FileSystem
    >;
} = Effect.fnUntraced(function*(Options?: DotEnvOptions)
{
    const Files
});
