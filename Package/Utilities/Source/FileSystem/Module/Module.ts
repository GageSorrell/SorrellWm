/**
 * @file      Module.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { InvalidCharacters, ReservedWindowsFileNames } from "../FileSystem.ts";
import type { ExtensionPolicy } from "./Module.Types.ts";
import { GetUtf8ByteLength } from "../../String/String.ts";

/* eslint-disable @typescript-eslint/typedef */

export namespace ValidExtensions
{
    export/**
           * The valid file extensions for TypeScript *source* modules.
           */
    const Source =
        [
            ".ts",
            ".tsx",
            ".mts",
            ".cts"
        ] as const;

    export/**
           * The valid file extensions for TypeScript *declaration* modules.
           */
    const Declaration =
        [
            ".d.ts",
            ".d.mts",
            ".d.cts"
        ] as const;

    export/**
           * The valid file extensions for *any* TypeScript module.
           */
    const Any =
        [
            ".ts",
            ".tsx",
            ".mts",
            ".cts",
            ".d.ts",
            ".d.mts",
            ".d.cts"
        ] as const;
}

/* eslint-enable @typescript-eslint/typedef */

export function HasTypeScriptExtension(FileName: string): boolean
{
    return /\.(ts|tsx|mts|cts|d\.ts|d\.mts|d\.cts)$/iu.test(FileName);
}

export function IsValidFileName(
    FileName: string,
    ExtensionPolicy: ExtensionPolicy = "Disallow"
): boolean
{
    if (FileName.length === 0)
    {
        return false;
    }

    if (FileName === "." || FileName === "..")
    {
        return false;
    }

    const DoesExtensionSatisfyPolicy: boolean = (
        (ExtensionPolicy === "Disallow" && !HasTypeScriptExtension(FileName)) ||
        (ExtensionPolicy === "Require" && HasTypeScriptExtension(FileName)) ||
        (Array.isArray(ExtensionPolicy) && ExtensionPolicy.some(FileName.endsWith))
    );

    if (!DoesExtensionSatisfyPolicy)
    {
        return false;
    }

    if (FileName.endsWith(".") || FileName.endsWith(" "))
    {
        return false;
    }

    if (GetUtf8ByteLength(FileName) > 255)
    {
        return false;
    }

    if (InvalidCharacters.test(FileName))
    {
        return false;
    }

    const FileNameWithoutDots: string | undefined = FileName.split(".")[0]?.toUpperCase();

    const FileNameContainsWindowsReserved: boolean = (
        FileNameWithoutDots !== undefined &&
        (ReservedWindowsFileNames as ReadonlyArray<string>).includes(FileNameWithoutDots)
    );

    if (FileNameContainsWindowsReserved)
    {
        return false;
    }

    return true;
}
