/**
 * Tests app settings behavior for `@sorrell/app-settings`.
 *
 * @module @sorrell/app-settings/Test/AppSettings.test
 *
 * @file      AppSettings.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    Context,
    Deferred,
    Effect,
    Fiber,
    Layer,
    Option,
    pipe,
    Result,
    Schema,
    Stream
} from "effect";
import { NodeFileSystem, NodePath } from "@effect/platform-node";
import { afterEach, describe, expect, it } from "vitest";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { AppSettings } from "../Source/index.js";
import { join } from "node:path";
import { tmpdir } from "node:os";

const SettingsSchema = Schema.Struct({
    launchAtStartup: Schema.Boolean,
    theme: Schema.String
});

type Settings = Schema.Schema.Type<typeof SettingsSchema>;

const PlatformLayer = Layer.mergeAll(NodeFileSystem.layer, NodePath.layer);
const TemporaryDirectories = new Set<string>();

const MakeTemporaryDirectory = async(): Promise<string> =>
{
    const Directory = await mkdtemp(join(tmpdir(), "sorrell-app-settings-"));
    TemporaryDirectories.add(Directory);
    return Directory;
};

afterEach(async() =>
{
    await Promise.all(Array.from(TemporaryDirectories, async(Directory: string) =>
    {
        await rm(Directory, { force: true, recursive: true });
        TemporaryDirectories.delete(Directory);
    }));
});

describe("AppSettings", () =>
{
    it("resolves native default paths from process-platform conventions", () =>
    {
        expect(AppSettings.defaultFilePath({
            environment: { APPDATA: "D:\\Profiles\\Tester\\Roaming" },
            homeDirectory: "C:\\Users\\Tester",
            platform: "win32"
        })).toBe("D:\\Profiles\\Tester\\Roaming\\SorrellWm\\settings.json");

        expect(AppSettings.defaultFilePath({
            environment: { },
            homeDirectory: "/Users/tester",
            platform: "darwin"
        })).toBe("/Users/tester/Library/Application Support/SorrellWm/settings.json");

        expect(AppSettings.defaultFilePath({
            environment: { XDG_CONFIG_HOME: "/var/user-config" },
            homeDirectory: "/home/tester",
            platform: "linux"
        })).toBe("/var/user-config/SorrellWm/settings.json");

        expect(AppSettings.defaultFilePath({
            environment: { XDG_CONFIG_HOME: "relative-config" },
            homeDirectory: "/home/tester",
            platform: "linux"
        })).toBe("/home/tester/.config/SorrellWm/settings.json");
    });

    it("uses the process-platform path when no custom path is supplied", () =>
    {
        const Settings = AppSettings.make(SettingsSchema, {
            initial: {
                launchAtStartup: false,
                theme: "light"
            }
        });

        expect(Settings.filePath).toBe(AppSettings.defaultFilePath());
    });

    it("creates missing directories and persists successful updates", async() =>
    {
        const Directory = await MakeTemporaryDirectory();
        const FilePath = join(Directory, "nested", "configuration", "settings.json");
        const Settings = AppSettings.make(SettingsSchema, {
            filePath: FilePath,
            initial: {
                launchAtStartup: false,
                theme: "light"
            }
        });

        const Current = await Effect.runPromise(pipe(Effect.gen(function*()
        {
            const Service = yield* Settings;
            yield* Service.setSetting("theme", "dark");
            return yield* Service.get;
        }), Effect.provide(Settings.layer),
            Effect.provide(PlatformLayer)));

        expect(Current).toEqual({
            launchAtStartup: false,
            theme: "dark"
        });
        await expect(readFile(FilePath, "utf8")).resolves.toBe(
            "{\n    \"launchAtStartup\": false,\n    \"theme\": \"dark\"\n}\n"
        );
    });

    it("keeps the in-memory value unchanged when an atomic replacement fails", async() =>
    {
        const Directory = await MakeTemporaryDirectory();
        const FilePath = join(Directory, "settings.json");
        const Settings = AppSettings.make(SettingsSchema, FilePath, {
            initial: {
                launchAtStartup: false,
                theme: "light"
            }
        });

        const Outcome = await Effect.runPromise(pipe(Effect.gen(function*()
        {
            const Service = yield* Settings;

            yield* Effect.promise(async() =>
            {
                await rm(FilePath);
                await mkdir(FilePath);
            });

            const SetResult = yield* pipe(Service.setSetting("theme", "dark"), Effect.result);
            const Current = yield* Service.get;

            return { Current, SetResult };
        }), Effect.provide(Settings.layer),
            Effect.provide(PlatformLayer)));

        expect(Result.isFailure(Outcome.SetResult)).toBe(true);
        if (Result.isFailure(Outcome.SetResult))
        {
            expect(Outcome.SetResult.failure).toBeInstanceOf(AppSettings.FileError);
            expect(Outcome.SetResult.failure.operation).toBe("Replace");
        }
        expect(Outcome.Current).toEqual({
            launchAtStartup: false,
            theme: "light"
        });
    });

    it("keeps committed settings when downstream synchronization fails", async() =>
    {
        const Directory = await MakeTemporaryDirectory();
        const FilePath = join(Directory, "settings.json");
        const Attempts = new Array<string>();
        const ExternalThemes = new Array<string>();
        const DarkApplied = Effect.runSync(Deferred.make<void>());
        const Settings = AppSettings.make(SettingsSchema, {
            filePath: FilePath,
            initial: {
                launchAtStartup: false,
                theme: "light"
            }
        });
        interface ExternalState
        {
            readonly Themes: Array<string>;
        }
        const ExternalState = Context.Service<ExternalState>(
            "@sorrell/app-settings/Test/ExternalState"
        );
        const ExternalStateLive = Layer.succeed(ExternalState, { Themes: ExternalThemes });
        const SynchronizationLive = AppSettings.synchronizeSetting(
            Settings,
            "theme",
            (Theme: string) => Effect.gen(function*()
            {
                const External = yield* ExternalState;
                Attempts.push(Theme);

                if (Theme === "blocked")
                {
                    return yield* Effect.fail(new Error("External mutation failed."));
                }

                External.Themes.push(Theme);

                if (Theme === "dark")
                {
                    yield* Deferred.succeed(DarkApplied, undefined);
                }
            })
        );
        const Live = pipe(SynchronizationLive, Layer.provideMerge(Settings.layer),
            Layer.provide(PlatformLayer),
            Layer.provide(ExternalStateLive));

        const Outcome = await Effect.runPromise(pipe(Effect.gen(function*()
        {
            const Service = yield* Settings;

            yield* Service.setSetting("launchAtStartup", true);
            yield* Service.setSetting("theme", "blocked");
            yield* Service.setSetting("theme", "dark");
            yield* pipe(Deferred.await(DarkApplied), Effect.timeout("5 seconds"));
            const Current = yield* Service.get;

            return { Current };
        }), Effect.provide(Live)));

        expect(Attempts).toEqual([ "light", "blocked", "dark" ]);
        expect(ExternalThemes).toEqual([ "light", "dark" ]);
        expect(Outcome.Current.theme).toBe("dark");
        await expect(readFile(FilePath, "utf8")).resolves.toContain("\"theme\": \"dark\"");
    });

    it("loads external file changes and broadcasts them", async() =>
    {
        const Directory = await MakeTemporaryDirectory();
        const FilePath = join(Directory, "settings.json");
        const Initial: Settings = {
            launchAtStartup: false,
            theme: "light"
        };
        await writeFile(FilePath, JSON.stringify(Initial), "utf8");

        const Settings = AppSettings.make(SettingsSchema, FilePath, {
            watchDebounce: "10 millis"
        });

        const Changed = await Effect.runPromise(pipe(Effect.gen(function*()
        {
            const Service = yield* Settings;
            const ChangeFiber = yield* pipe(Service.changes, Stream.filter((Value: Settings) => Value.theme === "external"),
                Stream.runHead,
                Effect.timeout("5 seconds"),
                Effect.forkChild);

            yield* Effect.promise(() => writeFile(FilePath, JSON.stringify({
                launchAtStartup: true,
                theme: "external"
            }), "utf8"));

            return yield* Fiber.join(ChangeFiber);
        }), Effect.provide(Settings.layer),
            Effect.provide(PlatformLayer)));

        expect(Option.getOrThrow(Changed)).toEqual({
            launchAtStartup: true,
            theme: "external"
        });
    });
});
