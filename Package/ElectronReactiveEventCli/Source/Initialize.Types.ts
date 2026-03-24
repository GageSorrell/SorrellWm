/* File:      Initialize.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

export type FOutputType =
    | "console"
    | "clipboard"
    | "file";

export type FCommandName =
    | "preload"
    | "provider";

export interface IOptions
{
    Output: FOutputType;
}

export interface IGenerationRequest
{
    CommandName: FCommandName;
    OutputType: FOutputType;
    OutputPath: string | undefined;
    OutputPathExists: boolean;
}

