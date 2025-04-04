/* File:      Log.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FLogLevel } from "Windows";
import type chalk from "chalk";

export type FChalkBackground = Extract<keyof typeof chalk, `bg${ string }`>;

export type FChalkForeground = Extract<keyof typeof chalk, "black" | "whiteBright">;

export type FLogFunction = (...Statements: Array<unknown>) => void;

export type FLoggerRecord = Record<Exclude<FLogLevel, "Normal">, FLogFunction>;

export type FLogger = FLoggerRecord & FLogFunction;

export type FLoggerInterim = FLogFunction & Partial<FLoggerRecord>;
