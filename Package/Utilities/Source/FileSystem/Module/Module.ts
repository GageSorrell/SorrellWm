/**
 * @file      Module.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-example */

import * as Extension from "./Extension.ts";
import { InvalidCharacters, ReservedWindowsFileNames } from "../FileSystem.ts";
import { GetUtf8ByteLength } from "../../String/String.ts";

export namespace FileName
{
    /**
     * For a given {@link FileName} and {@link ExtensionPolicy:param}, determine whether
     * the given {@link FileName} is a valid TypeScript module file name.
     * 
     * @param FileName - The file name to test.
     * 
     * @param ExtensionPolicy - How the file extension (or lack of file extension) should affect
     * the validity of the given {@link FileName}.
     * 
     * @returns {boolean} Whether the given {@link FileName} is a valid name for a TypeScript module.
     */
    export function IsValid(
        FileName: string,
        ExtensionPolicy: Extension.Policy = "Disallow"
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
            (ExtensionPolicy === "Disallow" && !Extension.IsValidRegExp.test(FileName)) ||
            (ExtensionPolicy === "Require" && Extension.IsValidRegExp.test(FileName)) ||
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
}
