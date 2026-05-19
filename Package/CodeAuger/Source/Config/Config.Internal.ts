/**
 * @file      Config.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Formatter } from "./Config.Types.js";
import { GetPackageJson } from "@sorrell/utilities/npm";
import type { IPackageJson } from "package-json-type";

export async function GetInstalledFormatters(): Promise<ReadonlyArray<Formatter>>
{
    const PackageJson: IPackageJson = await GetPackageJson();

    const Dependencies: ReadonlyArray<string> =
        [
            ...Object.keys(PackageJson.bundleDependencies || { }),
            ...Object.keys(PackageJson.bundledDependencies || { }),
            ...Object.keys(PackageJson.dependencies || { }),
            ...Object.keys(PackageJson.devDependencies || { }),
            ...Object.keys(PackageJson.optionalDependencies || { }),
            ...Object.keys(PackageJson.peerDependencies || { })
        ] as const;

    const Formatters: ReadonlyArray<Formatter> =
        [
            "eslint",
            "ox",
            "prettier"
        ];

    return Formatters.filter((Formatter: Formatter): boolean =>
    {
        return Dependencies.includes(Formatter);
    });
}
