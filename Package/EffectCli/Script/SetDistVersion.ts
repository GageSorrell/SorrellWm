/**
 * @file      SetDistVersion.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable no-console */

import { promises as Fs } from "fs";
import type { IPackageJson } from "package-json-type";
import { resolve } from "path";

async function Main(): Promise<void>
{
    const DistPackageJson: IPackageJson = JSON.parse(await Fs.readFile(
        resolve("./package.dist.json"),
        { encoding: "utf-8" }
    ));

    const { version } = JSON.parse(await Fs.readFile(
        resolve("./package.json"),
        { encoding: "utf-8" }
    ));

    const OutDistPackageJson: IPackageJson =
        {
            ...DistPackageJson,
            version
        };

    await Fs.writeFile(
        resolve("./dist/package.json"),
        JSON.stringify(OutDistPackageJson, null, 4),
        { encoding: "utf-8" }
    );

    console.log("✓ Successfully patched package.json in the \"./dist\" directory!");
}

await Main();
