/**
 * A schema-validated, JSON-file-backed settings service.
 *
 * @module @sorrell/app-settings/AppSettings
 *
 * @file      AppSettings.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as NodePath from "node:path";
import {
    Context,
    Data,
    type Duration,
    Effect,
    FileSystem,
    Layer,
    Option,
    Path,
    type PlatformError,
    Schema,
    type SchemaError,
    type Scope,
    Stream,
    SubscriptionRef,
    pipe
} from "effect";
import { homedir } from "node:os";

const TypeIdKey = "~sorrell/app-settings/AppSettings" as const;

export/** The application directory name used by default. */
const DefaultApplicationName = "SorrellWm";

export/** The settings filename used by default. */
const DefaultFileName = "settings.json";

/** Operating-system identifiers understood by the default path resolver. */
export type Platform =
    | "aix"
    | "android"
    | "cygwin"
    | "darwin"
    | "freebsd"
    | "haiku"
    | "linux"
    | "netbsd"
    | "openbsd"
    | "sunos"
    | "win32";

/** Identifies the file operation that failed. */
export type FileOperation =
    | "Check"
    | "CreateDirectory"
    | "CreateTemporary"
    | "Read"
    | "Replace"
    | "Watch"
    | "Write";

/** Identifies the JSON operation that failed. */
export type JsonOperation = "Parse" | "Stringify";

/** Identifies the schema operation that failed. */
export type ValidationOperation = "Decode" | "Encode";

/** A failure raised while accessing the settings file. */
export class FileError extends Data.TaggedError("AppSettingsFileError")<{
    readonly cause: PlatformError.PlatformError;
    readonly filePath: string;
    readonly operation: FileOperation;
}> { }

/** A failure raised while parsing or serializing the JSON document. */
export class JsonError extends Data.TaggedError("AppSettingsJsonError")<{
    readonly cause: unknown;
    readonly filePath: string;
    readonly operation: JsonOperation;
}> { }

/** A settings value that did not satisfy the supplied schema. */
export class ValidationError extends Data.TaggedError("AppSettingsValidationError")<{
    readonly cause: SchemaError.SchemaError;
    readonly filePath: string;
    readonly operation: ValidationOperation;
}> { }

/** Errors that can occur while loading settings from disk. */
export type LoadError = FileError | JsonError | ValidationError;

/** Errors that can occur while persisting settings to disk. */
export type WriteError = FileError | JsonError | ValidationError;

/** Errors that can prevent the settings layer from being constructed. */
export type InitializationError = LoadError | WriteError;

/** Options used to resolve the platform-default settings path. */
export interface DefaultFilePathOptions
{
    /** The app-specific directory name. Defaults to `SorrellWm`. */
    readonly applicationName?: string;

    /** Environment variables used for platform directory discovery. Defaults to `process.env`. */
    readonly environment?: Readonly<Record<string, string | undefined>>;

    /** The settings filename. Defaults to `settings.json`. */
    readonly fileName?: string;

    /** The user home directory. Defaults to the value returned by `os.homedir()`. */
    readonly homeDirectory?: string;

    /** The operating system. Defaults to `process.platform`. */
    readonly platform?: Platform;
}

/** Optional behavior used when constructing an app-settings service. */
export interface MakeOptions<Settings extends object>
{
    /** The app directory name used when `filePath` is omitted. */
    readonly applicationName?: string;

    /** A custom settings path. When omitted, the platform default is used. */
    readonly filePath?: string;

    /** The filename used when `filePath` is omitted. */
    readonly fileName?: string;

    /** A value to persist when the settings file does not yet exist. */
    readonly initial?: Settings;

    /** JSON indentation. Defaults to four spaces. */
    readonly jsonSpace?: number | string;

    /** Time used to coalesce bursts of file-system events. Defaults to 50 ms. */
    readonly watchDebounce?: Duration.Input;

    /** Delay before restarting a failed file watcher. Defaults to one second. */
    readonly watchRetryDelay?: Duration.Input;
}

/** The operations exposed by a constructed app-settings service. */
export interface Service<Settings extends object>
{
    /** A stream containing the current settings followed by every committed update. */
    readonly changes: Stream.Stream<Settings>;

    /** Retrieves the complete current settings value. */
    readonly get: Effect.Effect<Settings>;

    /** Retrieves one setting from the current settings value. */
    readonly getSetting: <Key extends keyof Settings>(Key: Key) => Effect.Effect<Settings[Key]>;

    /** Replaces and persists the complete settings value. */
    readonly set: (Settings: Settings) => Effect.Effect<void, WriteError>;

    /** Replaces and persists one setting. */
    readonly setSetting: <Key extends keyof Settings>(
        Key: Key,
        Value: Settings[Key]
    ) => Effect.Effect<void, WriteError>;

    /** Computes, validates, and persists a replacement settings value. */
    readonly update: (
        Update: (Settings: Settings) => Settings
    ) => Effect.Effect<void, WriteError>;
}

/** The nominal context identifier for a settings service at a particular path. */
export interface Identifier<Settings extends object, FilePath extends string>
{
    readonly [TypeIdKey]: {
        readonly filePath: FilePath;
        readonly settings: Settings;
    };
}

/** A settings service tag together with the scoped layer that provides it. */
export interface Tag<
    Settings extends object,
    Encoded,
    DecodingServices,
    EncodingServices,
    FilePath extends string
> extends Context.Service<Identifier<Settings, FilePath>, Service<Settings>>
{
    /** The custom or platform-default path resolved during construction. */
    readonly filePath: FilePath;

    /** A scoped layer that loads, persists, and monitors the settings file. */
    readonly layer: Layer.Layer<
        Identifier<Settings, FilePath>,
        InitializationError,
        DecodingServices | EncodingServices | FileSystem.FileSystem | Path.Path
    >;

    /** The schema supplied when this service was constructed. */
    readonly schema: Schema.Codec<Settings, Encoded, DecodingServices, EncodingServices>;
}

/** An effectful function that reconciles committed settings with external state. */
export type Synchronizer<Settings extends object, E = never, R = never> =
    (NewSettings: Settings) => Effect.Effect<void, E, R>;

export/**
       * Construct a scoped layer that reconciles every committed settings value.
       *
       * The current value is applied when the layer starts. Synchronizer failures are
       * logged without terminating the stream, and requirements are preserved in the
       * returned layer so application services can be provided downstream of settings.
       */
const synchronize = <Settings extends object, Identifier, Error, Requirements>(
    SettingsTag: Context.Key<Identifier, Service<Settings>>,
    Synchronize: Synchronizer<Settings, Error, Requirements>
): Layer.Layer<never, never, Identifier | Requirements> => Layer.effectDiscard(
    Effect.gen(function*()
    {
        const SettingsService = yield* SettingsTag;

        yield* SettingsService.changes.pipe(
            Stream.runForEach((Current: Settings) => Effect.suspend(() => Synchronize(Current)).pipe(
                Effect.catch((ErrorValue: Error) => Effect.logWarning(
                    `Settings synchronization failed for ${ SettingsTag.key }; `
                    + "the committed value remains active.",
                    ErrorValue
                ))
            )),
            Effect.forkScoped({ startImmediately: true })
        );
    })
);

interface SelectedSetting<Settings extends object, Key extends keyof Settings>
{
    readonly Current: Settings;
    readonly Value: Settings[Key];
}

export/**
       * Construct a scoped layer that reconciles one setting whenever its value changes.
       *
       * Changes to unrelated settings are ignored using `Object.is` equality. The
       * synchronizer receives both the selected value and the complete committed value.
       */
const synchronizeSetting = <
    Settings extends object,
    Identifier,
    Key extends keyof Settings,
    Error,
    Requirements
>(
    SettingsTag: Context.Key<Identifier, Service<Settings>>,
    KeyValue: Key,
    Synchronize: (
        Value: Settings[Key],
        Settings: Settings
    ) => Effect.Effect<void, Error, Requirements>
): Layer.Layer<never, never, Identifier | Requirements> => Layer.effectDiscard(
    Effect.gen(function*()
    {
        const SettingsService = yield* SettingsTag;

        yield* SettingsService.changes.pipe(
            Stream.map((Current: Settings): SelectedSetting<Settings, Key> => ({
                Current,
                Value: Current[KeyValue]
            })),
            Stream.changesWith((
                Previous: SelectedSetting<Settings, Key>,
                Current: SelectedSetting<Settings, Key>
            ): boolean => Object.is(Previous.Value, Current.Value)),
            Stream.runForEach(({ Current, Value }: SelectedSetting<Settings, Key>) => Effect.suspend(
                () => Synchronize(Value, Current)
            ).pipe(
                Effect.catch((ErrorValue: Error) => Effect.logWarning(
                    `Settings synchronization failed for ${ SettingsTag.key }[${ String(KeyValue) }]; `
                    + "the committed value remains active.",
                    ErrorValue
                ))
            )),
            Effect.forkScoped({ startImmediately: true })
        );
    })
);

interface State<Settings extends object>
{
    readonly json: string;
    readonly settings: Settings;
}

interface ResolvedOptions<Settings extends object>
{
    readonly initial: Option.Option<Settings>;
    readonly jsonSpace: number | string;
    readonly watchDebounce: Duration.Input;
    readonly watchRetryDelay: Duration.Input;
}

type ResolvedFilePath<Input> = Input extends string
    ? Input
    : Input extends { readonly filePath: infer FilePath extends string; }
        ? FilePath
        : string;

/**
 * Resolves the default settings path for the current operating system.
 *
 * Windows uses roaming application data, macOS uses Application Support, and
 * other platforms use the XDG configuration directory convention.
 */
export function defaultFilePath(Options: DefaultFilePathOptions = { }): string
{
    const ApplicationName = Options.applicationName ?? DefaultApplicationName;
    const Environment = Options.environment ?? process.env;
    const FileName = Options.fileName ?? DefaultFileName;
    const HomeDirectory = Options.homeDirectory ?? homedir();
    const Platform: Platform = Options.platform ?? process.platform;

    if (Platform === "win32")
    {
        const RoamingDirectory = Environment.APPDATA;
        const LocalDirectory = Environment.LOCALAPPDATA;
        const BaseDirectory = RoamingDirectory !== undefined
            && NodePath.win32.isAbsolute(RoamingDirectory)
            ? RoamingDirectory
            : LocalDirectory !== undefined && NodePath.win32.isAbsolute(LocalDirectory)
                ? LocalDirectory
                : NodePath.win32.join(HomeDirectory, "AppData", "Roaming");

        return NodePath.win32.join(BaseDirectory, ApplicationName, FileName);
    }

    if (Platform === "darwin")
    {
        return NodePath.posix.join(
            HomeDirectory,
            "Library",
            "Application Support",
            ApplicationName,
            FileName
        );
    }

    const ConfigDirectory = Environment.XDG_CONFIG_HOME;
    const BaseDirectory = ConfigDirectory !== undefined
        && NodePath.posix.isAbsolute(ConfigDirectory)
        ? ConfigDirectory
        : NodePath.posix.join(HomeDirectory, ".config");

    return NodePath.posix.join(BaseDirectory, ApplicationName, FileName);
}

/**
 * Constructs a typed settings tag and its scoped live layer.
 *
 * The settings path defaults to the conventional per-user configuration
 * directory for `process.platform`. A custom path may be supplied through
 * `options.filePath` or as the legacy second string argument.
 *
 * When the file does not exist, `options.initial` is used. If it is omitted,
 * the schema decodes an empty object so schema defaults can supply the initial
 * value.
 */
export function make<
    Settings extends object,
    Encoded,
    DecodingServices,
    EncodingServices,
    const Input extends string | MakeOptions<Settings> | undefined = undefined
>(
    SettingsSchema: Schema.Codec<Settings, Encoded, DecodingServices, EncodingServices>,
    FilePathOrOptions?: Input,
    LegacyOptions?: Input extends string ? Omit<MakeOptions<Settings>, "filePath"> : never
): Tag<
    Settings,
    Encoded,
    DecodingServices,
    EncodingServices,
    ResolvedFilePath<Input>
>
{
    const Options: MakeOptions<Settings> | undefined = typeof FilePathOrOptions === "string"
        ? LegacyOptions
        : FilePathOrOptions;
    const SettingsFilePath: string = typeof FilePathOrOptions === "string"
        ? FilePathOrOptions
        : Options?.filePath ?? defaultFilePath(Options);
    const Resolved: ResolvedOptions<Settings> = {
        initial: Options?.initial === undefined ? Option.none() : Option.some(Options.initial),
        jsonSpace: Options?.jsonSpace ?? 4,
        watchDebounce: Options?.watchDebounce ?? "50 millis",
        watchRetryDelay: Options?.watchRetryDelay ?? "1 second"
    };

    const ServiceTag = Context.Service<Identifier<Settings, string>, Service<Settings>>(
        `${ TypeIdKey }/${ SettingsFilePath }`
    );

    const Live = Layer.effect(
        ServiceTag,
        MakeService(SettingsSchema, SettingsFilePath, Resolved)
    );

    return Object.assign(ServiceTag, {
        filePath: SettingsFilePath,
        layer: Live,
        schema: SettingsSchema
    }) as unknown as Tag<
        Settings,
        Encoded,
        DecodingServices,
        EncodingServices,
        ResolvedFilePath<Input>
    >;
}

const MakeService = <Settings extends object, Encoded, DecodingServices, EncodingServices>(
    SettingsSchema: Schema.Codec<Settings, Encoded, DecodingServices, EncodingServices>,
    SettingsFilePath: string,
    Options: ResolvedOptions<Settings>
): Effect.Effect<
    Service<Settings>,
    InitializationError,
    DecodingServices | EncodingServices | FileSystem.FileSystem | Path.Path | Scope.Scope
> => Effect.gen(function*()
{
    const Fs = yield* FileSystem.FileSystem;
    const PathService = yield* Path.Path;
    const SchemaServices = yield* Effect.context<DecodingServices | EncodingServices>();
    const AbsoluteFilePath = PathService.resolve(SettingsFilePath);
    const DirectoryPath = PathService.dirname(AbsoluteFilePath);

    yield* pipe(
        Fs.makeDirectory(DirectoryPath, { recursive: true }),
        Effect.mapError((Cause: PlatformError.PlatformError) => new FileError({
            cause: Cause,
            filePath: AbsoluteFilePath,
            operation: "CreateDirectory"
        }))
    );

    const Decode = (Input: unknown): Effect.Effect<Settings, ValidationError> =>
        pipe(
            Schema.decodeUnknownEffect(SettingsSchema)(Input),
            Effect.provide(SchemaServices),
            Effect.mapError((Cause: SchemaError.SchemaError) => new ValidationError({
                cause: Cause,
                filePath: AbsoluteFilePath,
                operation: "Decode"
            }))
        );

    const Encode = (Value: Settings): Effect.Effect<Encoded, ValidationError> =>
        pipe(
            Schema.encodeEffect(SettingsSchema)(Value),
            Effect.provide(SchemaServices),
            Effect.mapError((Cause: SchemaError.SchemaError) => new ValidationError({
                cause: Cause,
                filePath: AbsoluteFilePath,
                operation: "Encode"
            }))
        );

    const Stringify = (Value: Encoded): Effect.Effect<string, JsonError> => Effect.try({
        catch: (Cause: unknown) => new JsonError({
            cause: Cause,
            filePath: AbsoluteFilePath,
            operation: "Stringify"
        }),
        try: (): string =>
        {
            const Json: string | undefined = JSON.stringify(Value, undefined, Options.jsonSpace);

            if (Json === undefined)
            {
                throw new TypeError("The encoded settings value cannot be represented as JSON.");
            }

            return `${ Json }\n`;
        }
    });

    const EncodeState = (Value: Settings): Effect.Effect<State<Settings>, JsonError | ValidationError> =>
        pipe(
            Encode(Value),
            Effect.flatMap(Stringify),
            Effect.map((Json: string) => ({ json: Json, settings: Value }))
        );

    const Parse = (Json: string): Effect.Effect<unknown, JsonError> => Effect.try({
        catch: (Cause: unknown) => new JsonError({
            cause: Cause,
            filePath: AbsoluteFilePath,
            operation: "Parse"
        }),
        try: () => JSON.parse(Json) as unknown
    });

    const ReadState: Effect.Effect<State<Settings>, LoadError> = pipe(
        Fs.readFileString(AbsoluteFilePath),
        Effect.mapError((Cause: PlatformError.PlatformError) => new FileError({
            cause: Cause,
            filePath: AbsoluteFilePath,
            operation: "Read"
        })),
        Effect.flatMap(Parse),
        Effect.flatMap(Decode),
        Effect.flatMap(EncodeState)
    );

    const WriteJson = (Json: string): Effect.Effect<void, FileError> =>
        Effect.acquireUseRelease(
            pipe(
                Fs.makeTempFile({
                    directory: DirectoryPath,
                    prefix: `.${ PathService.basename(AbsoluteFilePath) }-`,
                    suffix: ".tmp"
                }),
                Effect.mapError((Cause: PlatformError.PlatformError) => new FileError({
                    cause: Cause,
                    filePath: AbsoluteFilePath,
                    operation: "CreateTemporary"
                }))),
            (TemporaryPath: string) => pipe(Fs.writeFileString(TemporaryPath, Json),
                Effect.mapError((Cause: PlatformError.PlatformError) => new FileError({
                    cause: Cause,
                    filePath: AbsoluteFilePath,
                    operation: "Write"
                })),
                Effect.flatMap(() => pipe(Fs.rename(TemporaryPath, AbsoluteFilePath),
                    Effect.mapError((Cause: PlatformError.PlatformError) => new FileError({
                        cause: Cause,
                        filePath: AbsoluteFilePath,
                        operation: "Replace"
                    }))
                ))
            ),
            (TemporaryPath: string) => pipe(Fs.remove(TemporaryPath, { force: true }), Effect.ignore)
        );

    const Persist = (Value: Settings): Effect.Effect<State<Settings>, WriteError> =>
        EncodeState(Value).pipe(
            Effect.tap((StateValue: State<Settings>) => WriteJson(StateValue.json))
        );

    const Exists: boolean = yield* pipe(
        Fs.exists(AbsoluteFilePath),
        Effect.mapError((Cause: PlatformError.PlatformError) => new FileError({
            cause: Cause,
            filePath: AbsoluteFilePath,
            operation: "Check"
        }))
    );

    const InitialState: State<Settings> = yield* Exists
        ? ReadState
        : Option.match(Options.initial, {
            onNone: () => pipe(Decode({ }), Effect.flatMap(Persist)),
            onSome: Persist
        });

    const StateRef = yield* SubscriptionRef.make(InitialState);

    const Set = (Value: Settings): Effect.Effect<void, WriteError> =>
        SubscriptionRef.updateSomeEffect(StateRef, (Current: State<Settings>) =>
            pipe(
                EncodeState(Value),
                Effect.flatMap((Next: State<Settings>) => Next.json === Current.json
                    ? Effect.succeed(Option.none())
                    : WriteJson(Next.json).pipe(
                        Effect.as(Option.some(Next))
                    ))
            )
        ).pipe(Effect.uninterruptible);

    const Update = (
        UpdateValue: (Value: Settings) => Settings
    ): Effect.Effect<void, WriteError> => SubscriptionRef.updateSomeEffect(
        StateRef,
        (Current: State<Settings>) => Effect.sync(() => UpdateValue(Current.settings)).pipe(
            Effect.flatMap(EncodeState),
            Effect.flatMap((Next: State<Settings>) => Next.json === Current.json
                ? Effect.succeed(Option.none())
                : WriteJson(Next.json).pipe(
                    Effect.as(Option.some(Next))
                ))
        )
    ).pipe(Effect.uninterruptible);

    const Reload: Effect.Effect<void> = SubscriptionRef.updateSomeEffect(
        StateRef,
        (Current: State<Settings>) => ReadState.pipe(
            Effect.flatMap((Next: State<Settings>) => Next.json === Current.json
                ? Effect.succeed(Option.none())
                : Effect.succeed(Option.some(Next)))
        )
    ).pipe(
        Effect.catch((ErrorValue: LoadError) => Effect.logWarning(
            "Ignoring an invalid external app-settings update.",
            ErrorValue
        ))
    );

    const WatchOnce: Effect.Effect<void, FileError> = Fs.watch(DirectoryPath).pipe(
        Stream.filter((Event: FileSystem.WatchEvent) =>
            PathService.resolve(DirectoryPath, Event.path) === AbsoluteFilePath
        ),
        Stream.debounce(Options.watchDebounce),
        Stream.runForEach(() => Reload),
        Effect.mapError((Cause: PlatformError.PlatformError) => new FileError({
            cause: Cause,
            filePath: AbsoluteFilePath,
            operation: "Watch"
        }))
    );

    yield* WatchOnce.pipe(
        Effect.catch((ErrorValue: FileError) => Effect.logWarning(
            "The app-settings file watcher stopped; it will be restarted.",
            ErrorValue
        )),
        Effect.andThen(Effect.sleep(Options.watchRetryDelay)),
        Effect.forever,
        Effect.forkScoped({ startImmediately: true })
    );

    return {
        changes: SubscriptionRef.changes(StateRef).pipe(
            Stream.map((Value: State<Settings>) => Value.settings)
        ),
        get: SubscriptionRef.get(StateRef).pipe(
            Effect.map((Value: State<Settings>) => Value.settings)
        ),
        getSetting: <Key extends keyof Settings>(Key: Key): Effect.Effect<Settings[Key]> =>
            SubscriptionRef.get(StateRef).pipe(
                Effect.map((Value: State<Settings>) => Value.settings[Key])
            ),
        set: Set,
        setSetting: <Key extends keyof Settings>(
            Key: Key,
            Value: Settings[Key]
        ): Effect.Effect<void, WriteError> => Update((Current: Settings) => ({
            ...Current,
            [Key]: Value
        })),
        update: Update
    };
});
