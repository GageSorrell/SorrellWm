/**
 * @file      List.Command.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Effect } from "effect";
import { GetPackageJson } from "@sorrell/utilities/npm/effect";
import type { IPackageJson } from "package-json-type";

/* eslint-disable @typescript-eslint/typedef */

export/** Get the installed dependencies of the package that contains the current work directory. */
const GetDependencyNames = Effect.gen(function* ()
{
    /* eslint-enable @typescript-eslint/typedef */
    const PackageJson: IPackageJson = yield* GetPackageJson();

    return [
        ...(Object.keys(PackageJson?.dependencies || { }) || [ ]),
        ...(Object.keys(PackageJson?.devDependencies || { }) || [ ])
    ] as const;
});
