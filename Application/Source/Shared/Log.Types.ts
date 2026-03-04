/* File:      Log.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FLogLevel, FLogOrigin } from "@sorrellwm/windows";
import type chalk from "chalk";

export type FChalkBackground = Extract<keyof typeof chalk, `bg${ string }`>;

export type FChalkForeground = Extract<keyof typeof chalk, "black" | "whiteBright">;

export type FLogFunction = (...Statements: TArray<unknown>) => void;

export type FLogFormatFunction = (Statement: unknown) => unknown;

export type FLoggerRecord = Record<Exclude<FLogLevel, "Normal">, FLogFunction>;

export type FLogOriginExtended = FLogOrigin | "*";

export type FLogDigitSeparator =
    | "Space"
    | "Comma"
    | "Underscore"
    | "None";

export type FLogQuoteStyle =
    | "Double"
    | "Single"
    | "None";

export type FLogSettings = Readonly<{
    Category:
    {
        DisabledCategories:
        {
            [ LogOrigin in FLogOriginExtended ]: TArray<string>;
        };
        LogDisabledCategoryAttempts: boolean;
    };
    Format:
    {
        AlwaysApplyFormat: boolean;
        Colors: boolean;
        DigitSeparator: FLogDigitSeparator;
        QuoteStyle: FLogQuoteStyle;
        TruncateBase64Strings: boolean;
    };
    Size:
    {
        LimitStatementLength:
        {
            Enabled: boolean;
            MaxLength: number;
        };
        MaxTerminalWidth: number;
        TabWidth: number;
    };
}>;

export type FLogger = FLoggerRecord & FLogFunction;

export type FLoggerInterim = FLogFunction & Partial<FLoggerRecord>;

export type FLog = (...Arguments: TArray<unknown>) => void;

export type FGetTimeToken = "__GetTime__";

export type FLogFrontendTokens =
    | FGetTimeToken;
