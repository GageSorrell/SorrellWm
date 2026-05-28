/**
 * @file      List.Command.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Path as EffectPath, FileSystem } from "@effect/platform";
import type { EGetDependencyNames } from "./List.Command.Internal.Types.js";
import { Effect } from "effect";
import { GetPackageJson } from "@sorrell/utilities/npm/effect";
import type { IPackageJson } from "package-json-type";

export const GetDependencyNames: EGetDependencyNames = Effect.gen(function* ()
{
    const Fs: FileSystem.FileSystem = yield* FileSystem.FileSystem;
    const Path: EffectPath.Path = yield* EffectPath.Path;

    const PackageJson: IPackageJson = yield* GetPackageJson();

    return [
        ...(Object.keys(PackageJson?.dependencies || { }) || [ ]),
        ...(Object.keys(PackageJson?.devDependencies || { }) || [ ])
    ] as const;
});
