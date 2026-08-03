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

import * as Error from "./Error.ts";
import * as NodePath from "node:path";
import {
    Context,
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

export/**
       * The type identifier of this module.
       *
       * @category AppSettings
       * @since 1.0.0
       */
const TypeId = "~sorrell/app-settings/AppSettings" as const;

/** {@inheritDoc TypeId:var} */
export type TypeId = typeof TypeId;

export/**
       * The settings filename used by default.
       *
       * @category Default
       * @since 2.0.0
       */
const DefaultFileName = "settings.json";

/**
 * Operating-system identifiers understood by the default path resolver.
 *
 * @category Platform
 * @since 2.0.0
 */
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

/**
 * Options used to resolve the platform-default settings path.
 *
 * @category Constructor
 * @since 1.0.0
 */
export interface DefaultFilePathOptions
{
    /** The app-specific directory name. Defaults to `SorrellWm`. */
    readonly ApplicationName: string;

    /** Environment variables used for platform directory discovery. Defaults to `process.env`. */
    readonly Env?: Readonly<Record<string, string | undefined>>;

    /** The settings filename. Defaults to `settings.json`. */
    readonly FileName?: string;

    /** The user home directory. Defaults to the value returned by `os.homedir()`. */
    readonly HomeDir?: string;

    /** The operating system. Defaults to `process.platform`. */
    readonly Platform?: Platform;
}

/**
 * Optional behavior used when constructing an app-settings service.
 *
 * @category Constructor
 * @since 1.0.0
 */
export interface MakeOptions<Settings extends object>
{
    /** The app directory name used when `filePath` is omitted. */
    readonly ApplicationName: string;

    /** A custom settings path. When omitted, the platform default is used. */
    readonly FilePath?: string;

    /** The filename used when `filePath` is omitted. */
    readonly FileName?: string;

    /** A value to persist when the settings file does not yet exist. */
    readonly Initial?: Settings;

    /** JSON indentation. Defaults to four spaces. */
    readonly JsonIndentNum?: number | string;

    /** Time used to coalesce bursts of file-system events. Defaults to 50 ms. */
    readonly WatchDebounce?: Duration.Input;

    /** Delay before restarting a failed file watcher. Defaults to one second. */
    readonly WatchRetryDelay?: Duration.Input;
}

/**
 * The operations exposed by a constructed app-settings service.
 *
 * @category Constructor
 * @since 1.0.0
 */
export interface Service<Settings extends object>
{
    /** A stream containing the current settings followed by every committed update. */
    readonly Changes: Stream.Stream<Settings>;

    /** Retrieves the complete current settings value. */
    readonly Get: Effect.Effect<Settings>;

    /** Retrieves one setting from the current settings value. */
    readonly GetSetting: <Key extends keyof Settings>(Key: Key) => Effect.Effect<Settings[Key]>;

    /** Replaces and persists the complete settings value. */
    readonly Set: (Settings: Settings) => Effect.Effect<void, Error.Any>;

    /** Replaces and persists one setting. */
    readonly SetSetting: <Key extends keyof Settings>(
        Key: Key,
        Value: Settings[Key]
    ) => Effect.Effect<void, Error.Any>;

    /** Computes, validates, and persists a replacement settings value. */
    readonly Update: (
        Update: (Settings: Settings) => Settings
    ) => Effect.Effect<void, Error.Any>;
}

/**
 * The nominal context identifier for a settings service at a particular path.
 *
 * @category Constructor
 * @since 1.0.0
 */
export interface Identifier<Settings extends object, FilePath extends string>
{
    readonly [ TypeId ]:
    {
        readonly FilePath: FilePath;
        readonly Settings: Settings;
    };
}

/**
 * A settings service tag together with the scoped layer that provides it.
 *
 * @category AppSettings
 * @since 1.0.0
 */
export interface Tag<
    Settings extends object,
    Encoded,
    DecodingServices,
    EncodingServices,
    FilePath extends string
> extends Context.Service<Identifier<Settings, FilePath>, Service<Settings>>
{
    /** The custom or platform-default path resolved during construction. */
    readonly FilePath: FilePath;

    /** A scoped layer that loads, persists, and monitors the settings file. */
    readonly Layer: Layer.Layer<
        Identifier<Settings, FilePath>,
        Error.Any,
        | DecodingServices
        | EncodingServices
        | FileSystem.FileSystem
        | Path.Path
    >;

    /** The schema supplied when this service was constructed. */
    readonly Schema: Schema.Codec<Settings, Encoded, DecodingServices, EncodingServices>;
}

/**
 * An effectful function that reconciles committed settings with external state.
 *
 * @category Mutator
 * @since 1.0.0
 */
export type SyncFn<Settings extends object, E = never, R = never> =
    (NewSettings: Settings) => Effect.Effect<void, E, R>;

export/**
       * Construct a scoped layer that reconciles every committed settings value.
       *
       * The current value is applied when the layer starts. Synchronizer failures are
       * logged without terminating the stream, and requirements are preserved in the
       * returned layer so application services can be provided downstream of settings.
       *
       * @category Mutator
       * @since 1.0.0
       */
const Sync = <Settings extends object, Identifier, Error, Requirements>(
    SettingsTag: Context.Key<Identifier, Service<Settings>>,
    Synchronize: SyncFn<Settings, Error, Requirements>
): Layer.Layer<never, never, Identifier | Requirements> => Layer.effectDiscard(
    Effect.gen(function*()
    {
        const SettingsService = yield* SettingsTag;

        yield* pipe(
            SettingsService.Changes,
            Stream.runForEach((Current: Settings) => pipe(Effect.suspend(() => Synchronize(Current)), Effect.catch((ErrorValue: Error) => Effect.logWarning(
                    `Settings synchronization failed for ${ SettingsTag.key }; `
                    + "the committed value remains active.",
                    ErrorValue
                )))),
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
       *
       * @category Mutator
       * @since 1.0.0
       */
const SyncSetting = <
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

        yield* pipe(
            SettingsService.Changes,
            Stream.map((Current: Settings): SelectedSetting<Settings, Key> => ({
                Current,
                Value: Current[KeyValue]
            })),
            Stream.changesWith((
                Previous: SelectedSetting<Settings, Key>,
                Current: SelectedSetting<Settings, Key>
            ): boolean => Object.is(Previous.Value, Current.Value)),
            Stream.runForEach(({ Current, Value }: SelectedSetting<Settings, Key>) => pipe(
                Effect.suspend(() => Synchronize(Value, Current)),
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
    readonly Json: string;
    readonly Settings: Settings;
}

interface ResolvedOptions<Settings extends object>
{
    readonly initial: Option.Option<Settings>;
    readonly jsonSpace: number | string;
    readonly watchDebounce: Duration.Input;
    readonly watchRetryDelay: Duration.Input;
}

/**
 * A resolved file path.
 *
 * @category Internal
 * @since 1.0.0
 */
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
 *
 * @category Accessor
 * @since 1.0.0
 */
export function GetDefaultFilePath(Options: DefaultFilePathOptions): string
{
    const ApplicationName = Options.ApplicationName;
    const Environment = Options.Env ?? process.env;
    const FileName = Options.FileName ?? DefaultFileName;
    const HomeDirectory = Options.HomeDir ?? homedir();
    const Platform: Platform = Options.Platform ?? process.platform;

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
 *
 * @category Constructor
 * @since 1.0.0
 */
export function Make<
    Settings extends object,
    Encoded,
    DecodingServices,
    EncodingServices,
    const Input extends
        | string
        | MakeOptions<Settings>
        | undefined = undefined
>(
    SettingsSchema: Schema.Codec<Settings, Encoded, DecodingServices, EncodingServices>,
    Options: MakeOptions<Settings>
): Tag<
    Settings,
    Encoded,
    DecodingServices,
    EncodingServices,
    ResolvedFilePath<Input>
>
{
    const SettingsFilePath: string = Options?.FilePath ?? GetDefaultFilePath(Options);
    const Resolved: ResolvedOptions<Settings> =
        {
            initial: Options?.Initial === undefined
                ? Option.none()
                : Option.some(Options.Initial),
            jsonSpace: Options?.JsonIndentNum ?? 4,
            watchDebounce: Options?.WatchDebounce ?? "50 millis",
            watchRetryDelay: Options?.WatchRetryDelay ?? "1 second"
        };

    const ServiceTag = Context.Service<Identifier<Settings, string>, Service<Settings>>(
        `${ TypeId }/${ SettingsFilePath }`
    );

    const Live = Layer.effect(
        ServiceTag,
        MakeService(SettingsSchema, SettingsFilePath, Resolved)
    );

    return Object.assign(ServiceTag, {
        FilePath: SettingsFilePath,
        Layer: Live,
        Schema: SettingsSchema
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
    Error.Any,
    | DecodingServices
    | EncodingServices
    | FileSystem.FileSystem
    | Path.Path
    | Scope.Scope
> => Effect.gen(function*()
{
    const Fs = yield* FileSystem.FileSystem;
    const PathService = yield* Path.Path;
    const SchemaServices = yield* Effect.context<DecodingServices | EncodingServices>();
    const AbsoluteFilePath = PathService.resolve(SettingsFilePath);
    const DirectoryPath = PathService.dirname(AbsoluteFilePath);

    yield* pipe(
        Fs.makeDirectory(DirectoryPath, { recursive: true }),
        Effect.mapError((Cause: PlatformError.PlatformError) => new Error.FileError({
            Cause,
            FilePath: AbsoluteFilePath,
            Op: "CreateDirectory"
        }))
    );

    const Decode = (Input: unknown): Effect.Effect<Settings, Error.ValidationError> =>
        pipe(
            Schema.decodeUnknownEffect(SettingsSchema)(Input),
            Effect.provide(SchemaServices),
            Effect.mapError((Cause: SchemaError.SchemaError) => new Error.ValidationError({
                Cause,
                FilePath: AbsoluteFilePath,
                Op: "Decode"
            }))
        );

    const Encode = (Value: Settings): Effect.Effect<Encoded, Error.ValidationError> =>
        pipe(
            Schema.encodeEffect(SettingsSchema)(Value),
            Effect.provide(SchemaServices),
            Effect.mapError((Cause: SchemaError.SchemaError) => new Error.ValidationError({
                Cause,
                FilePath: AbsoluteFilePath,
                Op: "Encode"
            }))
        );

    const Stringify = (Value: Encoded): Effect.Effect<string, Error.JsonError> => Effect.try({
        catch: (Cause: unknown) => new Error.JsonError({
            Cause,
            FilePath: AbsoluteFilePath,
            Op: "Stringify"
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

    const EncodeState = (Value: Settings) =>
        pipe(
            Encode(Value),
            Effect.flatMap(Stringify),
            Effect.map((Json: string) => ({ Json, Settings: Value }))
        );

    const Parse = (Json: string): Effect.Effect<unknown, Error.JsonError> => Effect.try({
        catch: (Cause: unknown) => new Error.JsonError({
            Cause,
            FilePath: AbsoluteFilePath,
            Op: "Parse"
        }),
        try: () => JSON.parse(Json) as unknown
    });

    const ReadState: Effect.Effect<State<Settings>, Error.Any> = pipe(
        Fs.readFileString(AbsoluteFilePath),
        Effect.mapError((Cause: PlatformError.PlatformError) => new Error.FileError({
            Cause,
            FilePath: AbsoluteFilePath,
            Op: "Read"
        })),
        Effect.flatMap(Parse),
        Effect.flatMap(Decode),
        Effect.flatMap(EncodeState)
    );

    const WriteJson = (Json: string): Effect.Effect<void, Error.FileError> =>
        Effect.acquireUseRelease(
            pipe(
                Fs.makeTempFile({
                    directory: DirectoryPath,
                    prefix: `.${ PathService.basename(AbsoluteFilePath) }-`,
                    suffix: ".tmp"
                }),
                Effect.mapError((Cause: PlatformError.PlatformError) => new Error.FileError({
                    Cause,
                    FilePath: AbsoluteFilePath,
                    Op: "CreateTemporary"
                }))),
            (TemporaryPath: string) => pipe(Fs.writeFileString(TemporaryPath, Json),
                Effect.mapError((Cause: PlatformError.PlatformError) => new Error.FileError({
                    Cause,
                    FilePath: AbsoluteFilePath,
                    Op: "Write"
                })),
                Effect.flatMap(() => pipe(Fs.rename(TemporaryPath, AbsoluteFilePath),
                    Effect.mapError((Cause: PlatformError.PlatformError) => new Error.FileError({
                        Cause,
                        FilePath: AbsoluteFilePath,
                        Op: "Replace"
                    }))
                ))
            ),
            (TemporaryPath: string) => pipe(Fs.remove(TemporaryPath, { force: true }), Effect.ignore)
        );

    const Persist = (Value: Settings): Effect.Effect<State<Settings>, Error.Any> =>
        pipe(EncodeState(Value), Effect.tap((StateValue: State<Settings>) => WriteJson(StateValue.Json)));

    const Exists: boolean = yield* pipe(
        Fs.exists(AbsoluteFilePath),
        Effect.mapError((Cause: PlatformError.PlatformError) => new Error.FileError({
            Cause,
            FilePath: AbsoluteFilePath,
            Op: "Check"
        }))
    );

    const InitialState: State<Settings> = yield* Exists
        ? ReadState
        : Option.match(Options.initial, {
            onNone: () => pipe(Decode({ }), Effect.flatMap(Persist)),
            onSome: Persist
        });

    const StateRef = yield* SubscriptionRef.make(InitialState);

    const Set = (Value: Settings): Effect.Effect<void, Error.Any> => pipe(
        SubscriptionRef.updateSomeEffect(StateRef, (Current: State<Settings>) =>
            pipe(
                EncodeState(Value),
                Effect.flatMap((Next: State<Settings>) => Next.Json === Current.Json
                    ? Effect.succeed(Option.none())
                    : pipe(WriteJson(Next.Json), Effect.as(Option.some(Next))
                    ))
            )
        ),
        Effect.uninterruptible
    );

    const Update = (UpdateValue: (Value: Settings) => Settings) => pipe(
        SubscriptionRef.updateSomeEffect(
            StateRef,
            (Current: State<Settings>) => pipe(
                Effect.sync(() => UpdateValue(Current.Settings)),
                Effect.flatMap(EncodeState),
                Effect.flatMap((Next: State<Settings>) => Next.Json === Current.Json
                    ? Effect.succeed(Option.none())
                    : pipe(WriteJson(Next.Json), Effect.as(Option.some(Next))))
            )
        ),
        Effect.uninterruptible
    );

    const Reload: Effect.Effect<void> = pipe(SubscriptionRef.updateSomeEffect(
        StateRef,
        (Current: State<Settings>) => pipe(ReadState, Effect.flatMap((Next: State<Settings>) => Next.Json === Current.Json
                ? Effect.succeed(Option.none())
                : Effect.succeed(Option.some(Next))))
    ), Effect.catch((ErrorValue: Error.Any) => Effect.logWarning(
            "Ignoring an invalid external app-settings update.",
            ErrorValue
        )));

    const WatchOnce: Effect.Effect<void, Error.FileError> = pipe(
        Fs.watch(DirectoryPath),
        Stream.filter((Event: FileSystem.WatchEvent) =>
            PathService.resolve(DirectoryPath, Event.path) === AbsoluteFilePath
        ),
        Stream.debounce(Options.watchDebounce),
        Stream.runForEach(() => Reload),
        Effect.mapError((Cause: PlatformError.PlatformError) => new Error.FileError({
            Cause,
            FilePath: AbsoluteFilePath,
            Op: "Watch"
        }))
    );

    yield* pipe(WatchOnce, Effect.catch((ErrorValue: Error.FileError) => Effect.logWarning(
            "The app-settings file watcher stopped; it will be restarted.",
            ErrorValue
        )),
        Effect.andThen(Effect.sleep(Options.watchRetryDelay)),
        Effect.forever,
        Effect.forkScoped({ startImmediately: true }));

    return {
        Changes: pipe(
            SubscriptionRef.changes(StateRef),
            Stream.map((Value: State<Settings>) => Value.Settings)
        ),
        Get: pipe(
            SubscriptionRef.get(StateRef),
            Effect.map((Value: State<Settings>) => Value.Settings)
        ),
        GetSetting: <Key extends keyof Settings>(Key: Key): Effect.Effect<Settings[Key]> =>
            pipe(
                SubscriptionRef.get(StateRef),
                Effect.map((Value: State<Settings>) => Value.Settings[Key])
            ),
        Set,
        SetSetting: <K extends keyof Settings>(
            Key: K,
            Value: Settings[K]
        ): Effect.Effect<void, Error.Any> => Update((Current: Settings) => ({
            ...Current,
            [ Key ]: Value
        })),
        Update
    } as const;
});
