/* File:      Log.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FChalkBackground, FChalkForeground, FLogFunction, FLogger, FLoggerInterim } from "./Log.Types";
import type { FLogCategory, FLogLevel, FLogOrigin } from "Windows";
import Chalk from "chalk";
import Util from "util";

Chalk.level = 1;

const FormatCategory = (Category: FLogCategory): string =>
{
    const PaddedCategory: string = ` ${ Category } `;
    let HashValue: number = 0;
    for (let Index: number = 0; Index < Category.length; Index++)
    {
        HashValue = (HashValue << 5) - HashValue + PaddedCategory.charCodeAt(Index);
        HashValue |= 0;
    }

    const BackgroundColors: Array<FChalkBackground> =
    [
        "bgBlack",
        "bgRed",
        "bgGreen",
        "bgYellow",
        "bgBlue",
        "bgMagenta",
        "bgCyan",
        "bgWhite",
        "bgGray",
        "bgGrey"
    ];

    const HashedIndex: number = Math.abs(HashValue) % BackgroundColors.length;

    const SelectedBackground: FChalkBackground = BackgroundColors[HashedIndex];

    const BrightBackgrounds: Array<FChalkBackground> =
    [
        "bgWhite",
        "bgYellow",
        "bgCyan",
        "bgGray",
        "bgGrey"
    ];

    const IsBright: boolean = BrightBackgrounds.includes(SelectedBackground);

    const ForegroundColor: FChalkForeground = IsBright ? "black" : "white";

    /* @ts-expect-error Type safety hell, using union types that mix functions with objects. */
    return Chalk[SelectedBackground][ForegroundColor](PaddedCategory);
};

const FormatLevel = (Level: FLogLevel): string =>
{
    const Colors: Record<FLogLevel, (Text: string) => string> =
    {
        Error: Chalk.bgRedBright.whiteBright,
        Normal: (Text: string): string => Text,
        Verbose: Chalk.bgCyan.whiteBright,
        Warn: Chalk.bgYellow.whiteBright
    };

    return Colors[Level](` ${ Level } `);
};

const LogInternal = (
    Origin: FLogOrigin,
    Category: FLogCategory,
    Level: FLogLevel,
    ...Arguments: Array<unknown>
): void =>
{
    const OriginEmojiMap: Record<FLogOrigin, string> =
    {
        Backend: "🐛",
        Frontend: "⚛️",
        Native: "🦾"
    };

    const OriginEmoji: string = OriginEmojiMap[Origin];

    const FormattedArguments: Array<string> = Arguments.map((Argument: unknown): string =>
    {
        return Util.format(Argument);
    });

    const OutStatements: Array<string> =
    [
        OriginEmoji + " ",
        FormatCategory(Category),
        FormatLevel(Level),
        ...FormattedArguments
    ];

    const Stream: NodeJS.WriteStream = Level === "Error"
        ? process.stderr
        : process.stdout;

    // OutStatements.forEach((Statement: string): void =>
    // {
    //     Stream.write(Statement);
    // });
    Stream.write(OutStatements.join("") + "\n");
};

/** This should only be used when registering the Log event. */
export const LogFrontend = (
    Category: FLogCategory,
    Level: FLogLevel,
    ...Statements: Array<unknown>
): void =>
{
    LogInternal("Frontend", Category, Level, ...Statements);
};

/** Use this to create a logger within a given module so that the log category is set for that module. */
export const GetLogger = (Category: FLogCategory): FLogger =>
{
    const MakeLoggerInternal = (Level: FLogLevel): FLogFunction =>
    {
        return (...Statements: Array<unknown>): void =>
        {
            LogInternal("Backend", Category, Level, ...Statements);
        };
    };

    const Logger: FLoggerInterim = MakeLoggerInternal("Normal");
    Logger.Error = MakeLoggerInternal("Error");
    Logger.Verbose = MakeLoggerInternal("Verbose");
    Logger.Warn = MakeLoggerInternal("Warn");

    return Logger as FLogger;
};
