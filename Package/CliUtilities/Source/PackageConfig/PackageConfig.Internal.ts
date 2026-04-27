/**
 * @file      PackageConfig.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Cause, ConfigError, ConfigProvider, Effect, Schema } from "effect";
import type { EReadPackageJson, FSettingsRecord } from "./PackageConfig.Internal.Types.js";
import { GetPackageJson, type RootDirectoryNotFoundError } from "@sorrell/utilities/npm";
import Fs from "fs/promises";
import { GetPackageRootDirectory } from "@sorrell/utilities/npm/effect";
import type { IPackageJson } from "package-json-type";
import type { ParseError } from "effect/ParseResult";
import Path from "path";

/* eslint-disable jsdoc/require-jsdoc */

export function IsRecordLike(Value: unknown): Value is Record<string, unknown>
{
    return typeof Value === "object" && Value !== null && !Array.isArray(Value);
}

export function HasNodeErrorCode(Value: unknown, Code: string): boolean
{
    return IsRecordLike(Value) && Value["code"] === Code;
}

export function ErrorToMessage(Value: unknown): string
{
    if (Value instanceof Error && Value.message.length > 0)
    {
        return Value.message;
    }

    return String(Value);
}

export function DecodeSettingsProviderEffect<
    SettingsType extends FSettingsRecord,
    EncodedType
>(
    Value: unknown,
    ConfigPath: ReadonlyArray<string>,
    SettingsSchema: Schema.Schema<SettingsType, EncodedType, never>
): Effect.Effect<ConfigProvider.ConfigProvider, ConfigError.ConfigError>
{
    return Schema.decodeUnknown(
        SettingsSchema,
        {
            errors: "all",
            onExcessProperty: "error"
        }
    )(Value).pipe(
        Effect.map((Settings: SettingsType) => ConfigProvider.fromJson(Settings)),
        Effect.mapError((TheParseError: ParseError) =>
        {
            return ConfigError.InvalidData(
                [ ...ConfigPath ],
                `Config value does not conform to the settings schema: ${String(TheParseError)}`
            );
        })
    );
}

export function LoadJsonFileProviderEffect<
    Settings extends FSettingsRecord,
    Encoded
>(
    ConfigFilePath: string,
    ConfigPath: ReadonlyArray<string>,
    SettingsSchema: Schema.Schema<Settings, Encoded, never>
): Effect.Effect<ConfigProvider.ConfigProvider, ConfigError.ConfigError>
{
    return Effect.gen(function*()
    {
        const FileContents: string = yield* Effect.tryPromise(
            {
                catch: (ErrorCause: unknown) =>
                {
                    if (HasNodeErrorCode(ErrorCause, "ENOENT"))
                    {
                        return ConfigError.MissingData(
                            [ ...ConfigPath ],
                            `Config file does not exist: ${ConfigFilePath}`
                        );
                    }

                    return ConfigError.SourceUnavailable(
                        [ ...ConfigPath ],
                        `Could not read config file ${ConfigFilePath}: ${ErrorToMessage(ErrorCause)}`,
                        Cause.fail(ErrorCause)
                    );
                },
                try: () => Fs.readFile(ConfigFilePath, "utf-8")
            }
        );

        const JsonValue: unknown = yield* Effect.try(
            {
                catch: (ErrorCause: unknown) =>
                {
                    return ConfigError.InvalidData(
                        [ ...ConfigPath ],
                        `Config file is not valid JSON: ${ErrorToMessage(ErrorCause)}`
                    );
                },
                try: () => JSON.parse(FileContents) as unknown
            }
        );

        return yield* DecodeSettingsProviderEffect(
            JsonValue,
            ConfigPath,
            SettingsSchema
        );
    });
}

export function BuildResolvedProviderEffect<
    Settings extends FSettingsRecord,
    Encoded
>(
    PackageName: string,
    SettingsSchema: Schema.Schema<Settings, Encoded, never>,
    DefaultFileName: string | undefined
): Effect.Effect<
    ConfigProvider.ConfigProvider,
    ConfigError.ConfigError | RootDirectoryNotFoundError
>
{
    return Effect.gen(function*()
    {
        const PackageJson: IPackageJson = yield* ReadPackageJsonEffect(PackageName);
        const PackageJsonPath: string = yield* GetPackageRootDirectory();
        const PackageJsonDirectory: string = Path.dirname(PackageJsonPath);

        const ConfigSection: IPackageJson["config"] = PackageJson.config;

        if (IsRecordLike(ConfigSection) && Object.hasOwn(ConfigSection, PackageName))
        {
            const PackageConfigValue: string | undefined = ConfigSection[PackageName];

            if (typeof PackageConfigValue === "string")
            {
                const ConfigFilePath: string =
                    Path.resolve(PackageJsonDirectory, PackageConfigValue);

                return yield* LoadJsonFileProviderEffect(
                    ConfigFilePath,
                    [ "config", PackageName ],
                    SettingsSchema
                );
            }

            if (IsRecordLike(PackageConfigValue))
            {
                return yield* DecodeSettingsProviderEffect(
                    PackageConfigValue,
                    [ "config", PackageName ],
                    SettingsSchema
                );
            }

            return yield* Effect.fail(
                ConfigError.Unsupported(
                    [ "config", PackageName ],
                    `Expected package.json config["${ PackageName }"] to be ` +
                    "either a string path or a JSON object."
                )
            );
        }

        if (DefaultFileName !== undefined)
        {
            const DefaultConfigFilePath: string =
                Path.resolve(PackageJsonDirectory, DefaultFileName);

            return yield* LoadJsonFileProviderEffect(
                DefaultConfigFilePath,
                [ DefaultFileName ],
                SettingsSchema
            );
        }

        return yield* Effect.fail(
            ConfigError.MissingData(
                [ "config", PackageName ],
                `Missing package.json config["${ PackageName }"], and no ` +
                "default file name was provided."
            )
        );
    });
}

export function ReadPackageJsonEffect(PackageName: string): EReadPackageJson
{
    return Effect.tryPromise(
        {
            catch: (ErrorCause: unknown) =>
            {
                return ConfigError.SourceUnavailable(
                    [ PackageName ],
                    (
                        "Could not read the package.json for the current " +
                        `working directory: ${ ErrorToMessage(ErrorCause) }`
                    ),
                    Cause.fail(ErrorCause)
                );
            },
            try: () => GetPackageJson()
        }
    );
}
