/* File:      RegisterCommand.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { CliConfig } from "../Schema.Types.js";

export type FEventOwner =
    | "Main"
    | "Renderer";

export type FEventDeclaringModule =
    {
        Declarations: Array<{
            Name: string;
            Owner: FEventOwner;
        }>;
        Path: string;
    };

export type FRegistrarDefinition = CliConfig["main"];

export type FEventDeclarationMatch = Readonly<{
    Path: string;
    Declarations: Array<{
        Name: string;
        Owner: FEventOwner;
    }>;
}>;

export type FImportedEventDeclaration = Readonly<{
    Name: string;
    Owner: FEventOwner;
    Alias: string;
}>;

export type FImportGroup =
    {
        ModuleSpecifier: string;
        Declarations: Array<FImportedEventDeclaration>;
    };
