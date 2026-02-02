/* File:      Api.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FLogFunction, FLogger, FLoggerInterim } from "?/Log.Types";
import type { FLogLevel } from "Windows";

/** Use this to create a logger within a given module so that the log category is set for that module. */
export const GetLogger = (Category: string): FLogger =>
{
    const MakeLoggerInternal = (Level: FLogLevel): FLogFunction =>
    {
        return (...Statements: Array<unknown>): void =>
        {
            window.electron.ipcRenderer.Send("Log", Category, Level, ...Statements);
        };
    };

    const Logger: FLoggerInterim = MakeLoggerInternal("Normal");
    Logger.Error = MakeLoggerInternal("Error");
    Logger.Verbose = MakeLoggerInternal("Verbose");
    Logger.Warn = MakeLoggerInternal("Warn");

    return Logger as FLogger;
};
