/**
 * @file      LoadConfig.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Provider from "../../../Provider/Config/Config.Types.js";
import type { Config } from "../../../Consumer/Config/Config.Types.js";
import { Effect } from "effect";
import { Path as EffectPath } from "@effect/platform";
import type { RootDirectoryNotFoundError } from "@sorrell/utilities/npm";
import { loadConfig } from "c12";

async function LoadFromCTwelve(
    RootDirectory: string,
    Type: "consumer"
): Promise<Config>;
async function LoadFromCTwelve(
    RootDirectory: string,
    Type: "provider"
): Promise<Provider.Config>;
async function LoadFromCTwelve(
    RootDirectory: string,
    Type: "consumer" | "provider"
): Promise<Config | Provider.Config>;
/* eslint-disable-next-line jsdoc/require-jsdoc */
async function LoadFromCTwelve(
    RootDirectory: string,
    Type: "consumer" | "provider"
): Promise<Config | Provider.Config>
{
    return (await loadConfig<Config | Provider.Config>({
        cwd: RootDirectory,
        name: { consumer: "code-auger", provider: "code-auger.provider" }[Type]
    })).config;
}

export function LoadConfig(
    RootDirectory: string,
    Type: "provider"
): Effect.Effect<Provider.Config, RootDirectoryNotFoundError, never>;
export function LoadConfig(
    RootDirectory: string,
    Type: "consumer"
): Effect.Effect<Config, RootDirectoryNotFoundError, never>;
/* eslint-disable-next-line jsdoc/require-jsdoc */
export function LoadConfig(
    RootDirectory: string,
    Type: "consumer" | "provider"
): Effect.Effect<Config | Provider.Config, RootDirectoryNotFoundError, never>
{
    return Effect.promise(() => LoadFromCTwelve(RootDirectory, Type));
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
export function GetProviderConfig(
    PackageName: string,
    NodeModulesDirectory: string
): Effect.Effect<Provider.Config, RootDirectoryNotFoundError, EffectPath.Path>
{
    return Effect.gen(function* ()
    {
        const Path: EffectPath.Path = yield* EffectPath.Path;

        const ProviderPath: string = Path.resolve(NodeModulesDirectory, PackageName);

        return yield* LoadConfig(ProviderPath, "provider");
    });
}
