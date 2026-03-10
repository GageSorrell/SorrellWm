/* File:      index.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

export type FSimpleFlagKey =
    | "Hook"
    | "Renderer";

export type FComplexFlagKey =
    | "ExportName";

export type FFlagKey =
    | FSimpleFlagKey
    | FComplexFlagKey;

export type FSimpleFlag =
{
    Name: FSimpleFlagKey;
};

export type FComplexFlag =
{
    Name: FComplexFlagKey;
    Value: string;
};

export type FFlag =
    | FSimpleFlag
    | FComplexFlag;

export type FFunctionArgument =
{
    Name: string;
    Type: string;
};

export type FRegisteredFunction =
{
    Name: string;
    FilePath: string;
    ReturnType: string;
    Arguments: Array<FFunctionArgument>;
    Flags: Array<FFlag>;
};
