/* File:      Log.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type {
    FChalkBackground,
    FChalkForeground,
    FLogFormatFunction,
    FLogFunction,
    FLogger,
    FLoggerInterim } from "!/Log.Types";
import type { FLogLevel, FLogOriginInternal } from "Windows";
import Chalk from "chalk";
import { LogSettings } from "../../../Shared/LoggerSettings";
import Util from "util";

Chalk.level = 3;

const FormatCategory = (Category: string): string =>
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

    const ForegroundColor: FChalkForeground = IsBright ? "black" : "whiteBright";

    /* @ts-expect-error Type safety hell, using union types that mix functions with objects. */
    return Chalk[SelectedBackground][ForegroundColor](PaddedCategory);
};

const FormatLevel = (Level: FLogLevel): string =>
{
    const Colors: Record<FLogLevel, (Text: string) => string> =
    {
        Error: Chalk.bgRedBright.whiteBright,
        Normal: Chalk.bgGray,
        Verbose: Chalk.bgCyan.whiteBright,
        Warn: Chalk.bgYellow.whiteBright
    };

    if (typeof Colors[Level] !== "function")
    {
        throw new Error(`Colors[Level] is ${ Level }.`);
    }

    return Colors[Level](` ${ Level } `);
};

const DisabledCategoriesAttempted: typeof LogSettings.Category.DisabledCategories =
{
    "*": [ ],
    Backend: [ ],
    Frontend: [ ],
    Native: [ ]
};

const LogInternal = (
    Origin: FLogOriginInternal,
    Category: string,
    Level: FLogLevel,
    ...Arguments: Array<unknown>
): void =>
{

    if (Origin !== "Meta")
    {
        const DisabledCategories: Array<string> =
        [
            ...LogSettings.Category.DisabledCategories[Origin],
            ...LogSettings.Category.DisabledCategories["*"]
        ];

        const ShouldLogGivenStatements: boolean = !(Category in DisabledCategories);
        if (!ShouldLogGivenStatements)
        {
            const IsCategoryDisabledUniversally: boolean =
                Category in LogSettings.Category.DisabledCategories["*"];

            const AttemptedCategories: Array<string> = IsCategoryDisabledUniversally
                ? [
                    ...DisabledCategoriesAttempted[Origin],
                    ...DisabledCategoriesAttempted["*"]
                ]
                : DisabledCategoriesAttempted[Origin];

            const ShouldLogDisabledCategory: boolean = (
                LogSettings.Category.LogDisabledCategoryAttempts &&
                !AttemptedCategories.includes(Category)
            );

            if (ShouldLogDisabledCategory)
            {
                DisabledCategoriesAttempted[IsCategoryDisabledUniversally ? "*" : Origin].push(Category);
                LogInternal(
                    "Meta",
                    "Log",
                    "Normal",
                    /* eslint-disable-next-line @stylistic/max-len */
                    `The category "${ Category }" was logged about, from ${ Origin } code.  Further attempts to log this category from this origin will not be reported.`
                );
            }

            return;
        }
    }

    const OriginEmojiMap: Record<FLogOriginInternal, string> =
    {
        Backend: "🐛",
        Frontend: "⚛️",
        Meta: "🧠",
        Native: "🦾"
    };

    const OriginEmoji: string = OriginEmojiMap[Origin];

    const FormattedArguments: Array<string> = Arguments.map((Argument: unknown): string =>
    {
        return Util.format(Argument);
    });

    const GetOutStatements = (): string =>
    {
        const OutStatementsArray: Array<string> =
        [
            OriginEmoji + " ",
            FormatLevel(Level),
            FormatCategory(Category),
            " ",
            ...FormattedArguments
        ];

        const OutStatementsBase: string = OutStatementsArray.join("");

        if (LogSettings.Size.LimitStatementLength.Enabled)
        {
            const PrefixLength: number = OutStatementsArray.slice(0, 4).reduce(
                (TotalLength: number, Statement: string): number =>
                {
                    return TotalLength + (Statement?.length ?? 0);
                }, 0);

            const TotalLength: number = PrefixLength + LogSettings.Size.LimitStatementLength.MaxLength;

            return OutStatementsBase.slice(0, TotalLength);
        }
        else
        {
            return OutStatementsBase;
        }
    };

    const Stream: NodeJS.WriteStream = Level === "Error"
        ? process.stderr
        : process.stdout;

    Stream.write(GetOutStatements() + "\n");
};

/** This should only be used when registering the Log event. */
export const LogFrontend = (
    Category: string,
    Level: FLogLevel,
    ...Statements: Array<unknown>
): void =>
{
    LogInternal("Frontend", Category, Level, ...Statements);
};

/** Use this to create a logger within a given module so that the log category is set for that module. */
export const GetLogger = (Category: string): FLogger =>
{
    const Formatters: Array<FLogFormatFunction> = [ ];
    const MakeLoggerInternal = (Level: FLogLevel): FLogFunction =>
    {
        return (...Statements: Array<unknown>): void =>
        {
            const FormattedStatements: Array<unknown> = Formatters.length === 0
                ? Statements
                : Formatters.map((Formatter: FLogFormatFunction): unknown =>
                {
                    return Statements.map(Formatter);
                }).flat(20);

            LogInternal("Backend", Category, Level, ...FormattedStatements);
        };
    };

    const Logger: FLoggerInterim = MakeLoggerInternal("Normal");
    Logger.Error = MakeLoggerInternal("Error");
    Logger.Verbose = MakeLoggerInternal("Verbose");
    Logger.Warn = MakeLoggerInternal("Warn");
    Logger.Formatters = Formatters;

    return Logger as FLogger;
};
