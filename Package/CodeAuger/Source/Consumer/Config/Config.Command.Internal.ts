/**
 * @file      Config.Command.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { ConfigCommandEffect, FConfigCommandOptions } from "./Config.Command.Internal.Types.js";
import { FileSystem, Path as EffectPath } from "@effect/platform";
import { Effect } from "effect";
import { GetPackageRootDirectory } from "@sorrell/utilities/npm/effect";

const DefaultConfigBase:  =
    {

    } as const;

export function HandleConfigCommand({ Out }: FConfigCommandOptions): ConfigCommandEffect
{
    return Effect.gen(function* ()
    {
        const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;
        const Path: EffectPath.Path = yield* EffectPath.Path;

        const Root: string = yield* GetPackageRootDirectory();
        const ConfigPath: string = yield* Path.resolve(Root, Out);

        yield* Fs.writeFileString();
    });
}
