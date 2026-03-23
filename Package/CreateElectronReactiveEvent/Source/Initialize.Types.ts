/* File:      Initialize.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

export type FInitAction =
    | "GenerateProvider"
    | "GeneratePreloadContent";

export type FOutputType =
    | "Console"
    | "File"
    | "Clipboard";

export type FOutput =
    | {
        Type: Exclude<FOutputType, "File">;
    }
    | {
        Type: Extract<FOutputType, "File">;
        Path: string;
    };

export type FArguments =
    {
        Action: FInitAction;
        Output: FOutput;
    };
