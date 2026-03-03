/* File:      Log.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { type FLogger, GetLogger } from "#/Development";

const TreeLogger: FLogger = GetLogger("Tree");
// TreeLogger.Formatters.push((Statement: unknown): unknown =>
// {
//     if (typeof Statement === "object" && Statement !== null && "Screenshot" in Statement)
//     {
//         const { Screenshot: _, ...Out } = Statement;
//         return Out;
//     }
//     else
//     {
//         return Statement;
//     }
// });

/**
 * Log statements for the `Tree` collection of modules.
 * This function, which returns the logger, is exported
 * (rather than exporting the logger directly) to be
 * consistent with how the logger is typically retrieved
 * (retrieved at the top of each module).
 */
export const GetTreeLogger: (() => FLogger) = (): FLogger => TreeLogger;
