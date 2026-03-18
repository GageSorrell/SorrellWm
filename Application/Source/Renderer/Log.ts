/* File:      Log.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FGetTimeToken, FLogFunction, FLogger, FLoggerInterim } from "../Shared/Log.Types";
import type { FLogLevel } from "@sorrellwm/windows";
import { GetTimeToken } from "../Shared/Log";

export const GetTime = (): FGetTimeToken =>
{
    return GetTimeToken;
};

/** Use this to create a logger within a given module so that the log category is set for that module. */
export const GetLogger = (Category: string): FLogger =>
{
    const MakeLoggerInternal = (Level: FLogLevel): FLogFunction =>
    {
        return (...Statements: TArray<unknown>): void =>
        {
            const FilteredStatements: TArray<unknown> = Statements.map((Statement: unknown): unknown =>
            {
                if (typeof Statement === "object")
                {
                    return JSON.stringify(Statement, null, 4);
                }
                else
                {
                    return Statement;
                }
            });

            window.electron.ipcRenderer.Send("Log", Category, Level, ...FilteredStatements);
        };
    };

    const Logger: FLoggerInterim = MakeLoggerInternal("Normal");
    Logger.Error = MakeLoggerInternal("Error");
    Logger.Verbose = MakeLoggerInternal("Verbose");
    Logger.Warn = MakeLoggerInternal("Warn");

    return Logger as FLogger;
};
