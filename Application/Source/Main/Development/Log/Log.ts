/* File:      Log.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type {
    FLogFrontendTokens,
    FLogFunction,
    FLogSettings,
    FLogger,
    FLoggerInterim } from "../../../Shared/Log.Types";
import type { FLogHandler, FShortTimestamp } from "./Log.Types";
import type { FLogLevel, FLogOriginInternal } from "@sorrellwm/windows";
import { Format, FormatBase64String, FormatInline } from "./LogFormat";
import Chalk from "chalk";
import type { FLogValueType } from "./LogFormat.Types";
import { GetDevSettings } from "#/DevSettings";
import Util from "util";

Chalk.level = 3;

const LogSettings: FLogSettings = GetDevSettings().Log;

const FormatCategory = (Category: string): string =>
{
    type FRgb = Record<"Red" | "Green" | "Blue", number>;

    const HashStringToBackgroundColor = (Input: string): string =>
    {
        let HashValue: number = 2166136261;

        for (let Index: number = 0; Index < Input.length; Index++)
        {
            HashValue ^= Input.charCodeAt(Index);
            HashValue = Math.imul(HashValue, 16777619);
        }

        HashValue >>>= 0;

        const Hue: number = HashValue % 360;
        const Saturation: number = 58 + ((HashValue >>> 8) % 23);

        let Lightness: number = 26 + ((HashValue >>> 16) % 12);

        let RgbColor: FRgb = ConvertHslToRgb(Hue, Saturation / 100, Lightness / 100);

        const ShouldAdjustRgbColor = (): boolean =>
        {
            return (
                CalculateContrastRatioWithWhite(RgbColor.Red, RgbColor.Green, RgbColor.Blue) < 4.5 &&
                Lightness > 12
            );
        };

        while (ShouldAdjustRgbColor())
        {
            Lightness--;
            RgbColor = ConvertHslToRgb(Hue, Saturation / 100, Lightness / 100);
        }

        return ConvertRgbToHexColor(RgbColor.Red, RgbColor.Green, RgbColor.Blue);
    };

    const ConvertHslToRgb = (Hue: number, Saturation: number, Lightness: number): FRgb =>
    {
        const Chroma: number = (1 - Math.abs(2 * Lightness - 1)) * Saturation;
        const HuePrime: number = Hue / 60;
        const SecondComponent: number = Chroma * (1 - Math.abs((HuePrime % 2) - 1));
        const MatchValue: number = Lightness - Chroma / 2;

        let RedPrime: number = 0;
        let GreenPrime: number = 0;
        let BluePrime: number = 0;

        if (HuePrime >= 0 && HuePrime < 1)
        {
            RedPrime = Chroma;
            GreenPrime = SecondComponent;
        }
        else if (HuePrime >= 1 && HuePrime < 2)
        {
            RedPrime = SecondComponent;
            GreenPrime = Chroma;
        }
        else if (HuePrime >= 2 && HuePrime < 3)
        {
            GreenPrime = Chroma;
            BluePrime = SecondComponent;
        }
        else if (HuePrime >= 3 && HuePrime < 4)
        {
            GreenPrime = SecondComponent;
            BluePrime = Chroma;
        }
        else if (HuePrime >= 4 && HuePrime < 5)
        {
            RedPrime = SecondComponent;
            BluePrime = Chroma;
        }
        else
        {
            RedPrime = Chroma;
            BluePrime = SecondComponent;
        }

        return {
            Blue: Math.round((BluePrime + MatchValue) * 255),
            Green: Math.round((GreenPrime + MatchValue) * 255),
            Red: Math.round((RedPrime + MatchValue) * 255)
        };
    };

    const CalculateContrastRatioWithWhite = (Red: number, Green: number, Blue: number): number =>
    {
        const RelativeLuminance: number = CalculateSrgbRelativeLuminance(Red, Green, Blue);

        return (1.0 + 0.05) / (RelativeLuminance + 0.05);
    };

    const CalculateSrgbRelativeLuminance = (Red: number, Green: number, Blue: number): number =>
    {
        const RedChannel: number = ConvertSrgbChannelToLinear(Red / 255);
        const GreenChannel: number = ConvertSrgbChannelToLinear(Green / 255);
        const BlueChannel: number = ConvertSrgbChannelToLinear(Blue / 255);

        return 0.2126 * RedChannel + 0.7152 * GreenChannel + 0.0722 * BlueChannel;
    };

    const ConvertSrgbChannelToLinear = (Channel: number): number =>
    {
        if (Channel <= 0.04045)
        {
            return Channel / 12.92;
        }

        return Math.pow((Channel + 0.055) / 1.055, 2.4);
    };

    const ConvertRgbToHexColor = (Red: number, Green: number, Blue: number): string =>
    {
        return (
            "#" +
            ConvertByteToHex(Red) +
            ConvertByteToHex(Green) +
            ConvertByteToHex(Blue)
        );
    };

    const ConvertByteToHex = (Value: number): string =>
    {
        return Value.toString(16).padStart(2, "0").toUpperCase();
    };

    return Chalk.hex("#FFFFFF").bgHex(HashStringToBackgroundColor(Category))(` ${ Category } `);
};

// const FormatCategoryBasic = (Category: string): string =>
// {
//     const PaddedCategory: string = ` ${ Category } `;
//     let HashValue: number = 0;
//     for (let Index: number = 0; Index < Category.length; Index++)
//     {
//         HashValue = (HashValue << 5) - HashValue + PaddedCategory.charCodeAt(Index);
//         HashValue |= 0;
//     }

//     const BackgroundColors: TArray<FChalkBackground> =
//     [
//         "bgBlack",
//         "bgRed",
//         "bgGreen",
//         "bgYellow",
//         "bgBlue",
//         "bgMagenta",
//         "bgCyan",
//         "bgWhite",
//         "bgGray",
//         "bgGrey"
//     ];

//     const HashedIndex: number = Math.abs(HashValue) % BackgroundColors.length;

//     const SelectedBackground: FChalkBackground = BackgroundColors[HashedIndex];

//     const BrightBackgrounds: TArray<FChalkBackground> =
//     [
//         "bgWhite",
//         "bgYellow",
//         "bgCyan",
//         "bgGray",
//         "bgGrey"
//     ];

//     const IsBright: boolean = BrightBackgrounds.includes(SelectedBackground);

//     const ForegroundColor: FChalkForeground = IsBright ? "black" : "whiteBright";

//     /* @ts-expect-error Type safety hell, using union types that mix functions with objects. */
//     return Chalk[SelectedBackground][ForegroundColor](PaddedCategory);
// };

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
    ...Arguments: TArray<unknown>
): void =>
{

    if (Origin !== "Meta")
    {
        const DisabledCategories: TArray<string> =
        [
            ...LogSettings.Category.DisabledCategories[Origin],
            ...LogSettings.Category.DisabledCategories["*"]
        ];

        const ShouldLogGivenStatements: boolean = !(Category in DisabledCategories);
        if (!ShouldLogGivenStatements)
        {
            const IsCategoryDisabledUniversally: boolean =
                Category in LogSettings.Category.DisabledCategories["*"];

            const AttemptedCategories: TArray<string> = IsCategoryDisabledUniversally
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
        Backend: "λ",
        Frontend: "ƒ",
        Meta: "◈",
        Native: "ϑ"
    };

    const OriginEmoji: string = OriginEmojiMap[Origin];

    const FormattedArguments: TArray<string> = Arguments.map((Argument: unknown): string =>
    {
        return Util.format(Argument);
    });

    const GetOutStatements = (): string =>
    {
        const OutStatementsArray: TArray<string> =
        [
            Chalk.bgHex("#AAAAAA").white(` ${ OriginEmoji } `),
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
    ...Statements: TArray<unknown>
): void =>
{
    const StatementsUntokenized: TArray<unknown> = Statements.map(HandleFrontendTokens);
    LogInternal("Frontend", Category, Level, ...StatementsUntokenized);
};

export const GetTime = (): FShortTimestamp =>
{
    const Now: Date = new Date();

    const Minutes: string = Now
        .getMinutes()
        .toString()
        .padStart(2, "0");

    const Seconds: string = Now
        .getSeconds()
        .toString()
        .padStart(2, "0");

    const Milliseconds: string = Now
        .getMilliseconds()
        .toString()
        .padStart(3, "0");

    return `${ Minutes }:${ Seconds }.${ Milliseconds }`;
};

const FrontendTokens: Readonly<Record<FLogFrontendTokens, () => string>> =
{
    __GetTime__: GetTime
} as const;

const HandleFrontendTokens = (Statement: unknown): unknown =>
{
    const IsFrontendToken = (In: unknown): In is FLogFrontendTokens =>
    {
        if (typeof In === "string")
        {
            return Object.keys(FrontendTokens).includes(In);
        }
        else
        {
            return false;
        }
    };

    if (IsFrontendToken(Statement))
    {
        return FrontendTokens[Statement]();
    }
    else
    {
        return Statement;
    }
};

const HandleAlwaysApplyFormat = (Statement: unknown, Statements: TArray<unknown>): unknown =>
{
    if (LogSettings.Format.AlwaysApplyFormat)
    {
        if (typeof Statement === "string" && Statements.length === 1)
        {
            return Statement;
        }
        else if (typeof Statement === "object")
        {
            return Format(Statement);
        }
        else
        {
            return FormatInline(Statement as FLogValueType);
        }
    }
    else
    {
        return Statement;
    }
};

export const HandleBase64Strings = (Statement: unknown, _Statements: TArray<unknown>): unknown =>
{
    if (typeof Statement === "string" && !LogSettings.Format.AlwaysApplyFormat)
    {
        return FormatBase64String(Statement);
    }
    else
    {
        return Statement;
    }
};

/** Use this to create a logger within a given module so that the log category is set for that module. */
export const GetLogger = (Category: string): FLogger =>
{
    const MakeLoggerInternal = (Level: FLogLevel): FLogFunction =>
    {
        return (...Statements: TArray<unknown>): void =>
        {
            // const IsSimple: boolean = Statements.length === 1 && typeof Statements[1] === "string";
            type FStatementTuple = [ unknown, TArray<unknown> ];

            const MultiMap = (
                InArray: TArray<unknown>,
                ...Handlers: TArray<FLogHandler>
            ): TArray<unknown> =>
            {
                let Out: TArray<FStatementTuple> = InArray.map((Statement: unknown): FStatementTuple =>
                {
                    return [ Statement, Statements ];
                });

                Handlers.forEach((Handler: FLogHandler): void =>
                {
                    Out = Out.map(([ Statement, Statements ]: FStatementTuple): FStatementTuple =>
                    {
                        return [ Handler(Statement, Statements), Statements ];
                    });
                });

                return Out.map(([ Statement ]: FStatementTuple): unknown =>
                {
                    return Statement;
                });
            };

            // const FormattedStatements: TArray<unknown> = Statements;
            const FormattedStatements: TArray<unknown> = MultiMap(
                Statements,
                HandleBase64Strings,
                HandleAlwaysApplyFormat
            );

            // const FormattedStatements: TArray<unknown> =
            //     IsSimple
            //         ? Statements
            //         : LogSettings.Format.AlwaysApplyFormat
            //             ? (Statements as TArray<FLogValueType>).map((Statement: FLogValueType): string =>
            //             {
            //                 if (typeof Statement === "object")
            //                 {
            //                     return Format(Statement);
            //                 }
            //                 else
            //                 {
            //                     return FormatInline(Statement);
            //                 }
            //             })
            //             : Statements;
            //     // : Formatters.map((Formatter: FLogFormatFunction): unknown =>
            //     // {
            //     //     return Statements.map(Formatter);
            //     // }).flat(20);

            const SpacedOutStatements: TArray<unknown> =
                FormattedStatements.flatMap((Statement: unknown): TArray<unknown> =>
                {
                    return [ Statement, " " ];
                });

            LogInternal("Backend", Category, Level, ...SpacedOutStatements);
        };
    };

    const Logger: FLoggerInterim = MakeLoggerInternal("Normal");
    Logger.Error = MakeLoggerInternal("Error");
    Logger.Verbose = MakeLoggerInternal("Verbose");
    Logger.Warn = MakeLoggerInternal("Warn");

    return Logger as FLogger;
};
