/* File:      TsConfig.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { IPackageJson } from "package-json-type";
import type { TDeepWriteable } from "@sorrell/utilities";
import type TypeScript from "typescript";

export type FReadConfigFileResult = ReturnType<typeof TypeScript.readConfigFile>;

export type FRegistrarBaseMatch = Readonly<{
    Name: string;
    Path: string;
}>;

export type FPackageJson = TDeepWriteable<IPackageJson>;
