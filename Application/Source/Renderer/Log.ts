/* File:      Log.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FGetTimeToken, FLogFunction, FLogger, FLoggerInterim } from "../Shared/Log.Types";
import type { FLogLevel, FRecord } from "@sorrellwm/windows";
import { GetTimeToken } from "../Shared/Log";
import { NewObject, type SObject } from "Source/Shared/Utility/Object";

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
            // const FilteredStatements: TArray<unknown> = Statements.map((Statement: unknown): unknown =>
            // {
            //     const GetTypeString = (In: unknown): string => `[ ${ typeof In } ]`;
            //     const CanSendViaIpc: boolean = (
            //         typeof Statement !== "function" &&
            //         typeof Statement !== "symbol"
            //     );

            //     if (!CanSendViaIpc)
            //     {
            //         return GetTypeString(Statement);
            //     }

            //     const PruneByType = (
            //         Container: FRecord | TArray<unknown>,
            //         ...Types: TArray<FTypeof>
            //     ): FRecord | TArray<unknown> =>
            //     {
            //         type FContainer = FRecord | TArray<unknown>;
            //         if (Array.isArray(Container))
            //         {
            //             return Container.map((Element: unknown): unknown =>
            //             {
            //                 if (Types.includes(typeof Element))
            //                 {
            //                     return GetTypeString(Element);
            //                 }
            //                 else
            //                 {
            //                     return (typeof Element === "object")
            //                         ? PruneByType(Element as FContainer, ...Types)
            //                         : Element;
            //                 }
            //             });
            //         }
            //         else
            //         {
            //             const Out: FRecord = { };
            //             Object.keys(Container).forEach((Key: string): void =>
            //             {
            //                 const Property: unknown = Container[Key];
            //                 if (!Types.includes(typeof Property))
            //                 {
            //                     Out[Key] = (typeof Property === "object")
            //                         ? PruneByType(Property as FContainer, ...Types)
            //                         : Property;
            //                 }
            //                 else
            //                 {
            //                     Out[Key] = GetTypeString(Property);
            //                 }
            //             });

            //             return Out as FContainer;
            //         }
            //     };

            //     return (typeof Statement === "object")
            //         ? PruneByType(Statement as FRecord | TArray<unknown>)
            //         : Statement;
            // });
            // const FilteredStatements: Array<unknown> = Statements.map((Statement: unknown): unknown =>
            // {
            //     if (typeof Statement === "object" && Statement !== null)
            //     {
            //         const StatementObject: SObject = NewObject(Statement as FRecord);
            //         const Mapped: unknown = StatementObject.MapStructured(({ Property }): unknown =>
            //         {
            //             if (typeof Property === "function")
            //             {
            //                 return "[ function ]";
            //             }
            //             else if (typeof Property === "symbol")
            //             {
            //                 return "[ symbol ]";
            //             }
            //             else
            //             {
            //                 return Property;
            //             }
            //         }).GetPlainCopy();

            //         console.log("\n\n\nMAPPED\n\n\n", JSON.stringify(Mapped, null, 4), "\n\n\nMAPPED\n\n\n");
            //         return Mapped;
            //     }
            //     else if (typeof Statement === "function")
            //     {
            //         return "[ function ]";
            //     }
            //     else if (typeof Statement === "symbol")
            //     {
            //         return "[ symbol ]";
            //     }
            //     else
            //     {
            //         return Statement;
            //     }
            // });

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
