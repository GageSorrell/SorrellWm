/* File:      LogUtility.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    FArrayTypeName,
    FContainerType,
    FDelimiterStartString,
    FDelimiters,
    FKeyValuePair,
    FLogArray,
    FLogMap,
    FLogRecord,
    FLogSet,
    FLogString,
    FLogStringArray,
    FLogValueType,
    FMap,
    FPrimitive,
    FRecord,
    FSetTypeName,
    TLogContainer,
    TLogPrimitive,
    TLogValue } from "./LogFormat.Types";
import type { FLogDigitSeparator, FLogQuoteStyle, FLogSettings } from "../../../Shared/Log.Types";
import { type FTypeof, Identity } from "../../../Shared/Utility";
import Chalk from "chalk";
import { GetDevSettings } from "#/DevSettings";

Chalk.level = 3;

const LogSettings: FLogSettings = GetDevSettings().Log;

/* eslint-disable @typescript-eslint/no-unsafe-function-type */

const GetWithoutAnsi = (In: string): string =>
{
    /* eslint-disable-next-line @stylistic/max-len, no-control-regex */
    const AnsiEscapeSequencePattern: RegExp = /[\u001B\u009B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[a-zA-Z\d]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))/g;

    return In.replace(AnsiEscapeSequencePattern, "");
};

const GetLength = (In: string): number =>
{
    return GetWithoutAnsi(In).length;
};

const StyleString = (In: string): string =>
{
    const Style: Record<FLogQuoteStyle, string> =
    {
        Double: `"${ In }"`,
        None: In,
        Single: `'${ In }'`
    };

    const BaseString: string = Style[LogSettings.Format.QuoteStyle];

    return LogSettings.Format.Colors
        ? Chalk.hex("#CA5010")(BaseString)
        : BaseString;
};

const StyleSymbol = (In: symbol): string =>
{
    return LogSettings.Format.Colors
        ? Chalk.hex("#00B7C3")(In.toString())
        : In.toString();
};

const StyleNumber = (In: bigint | number): string =>
{
    return LogSettings.Format.Colors
        ? Chalk.green(FormatDigits(In))
        : FormatDigits(In);
};

const FormatString = ({ Depth, Value }: TLogPrimitive<string>): FLogString =>
{
    return {
        Depth,
        String: (IsBase64String(Value) && LogSettings.Format.TruncateBase64Strings)
            ? FormatBase64String(Value)
            : StyleString(Value)
    };
};

const FormatSymbol = ({ Depth, Value }: TLogPrimitive<symbol>): FLogString =>
{
    return {
        Depth,
        String: StyleSymbol(Value)
    };
};

const Inline = (In: FLogStringArray): FLogStringArray =>
{
    const SearchedIndices: Record<FDelimiterStartString, TArray<number>> =
    {
        "<": [ ],
        "[": [ ],
        "{": [ ]
    };

    const Recurrence = (LogStrings: FLogStringArray): FLogStringArray =>
    {
        type FGetInnermostContainerReturnType =
            | undefined
            | {
                Container: FLogStringArray;
                StartSubArray: TArray<FLogString>;
                StopSubArray: TArray<FLogString>;
            };

        const GetString = (InLogString: FLogString): string => InLogString.String;
        const GetInnermostContainer = (InLogStrings: FLogStringArray): FGetInnermostContainerReturnType =>
        {
            const Strings: TArray<string> = InLogStrings.map(GetString);
            const StartDelimiters: TArray<FDelimiterStartString> = [ "<", "[", "{" ];
            const InnermostStartIndex: number = Math.max(...StartDelimiters
                .map((StartDelimiter: FDelimiterStartString): number =>
                {
                    if (SearchedIndices[StartDelimiter].includes(-1))
                    {
                        return -1;
                    }

                    const StopSearchIndex: number = Math.min(...SearchedIndices[StartDelimiter]);

                    const Out: number = Strings
                        .slice(0, StopSearchIndex)
                        .lastIndexOf(StartDelimiter);

                    if (Out === -1)
                    {
                        SearchedIndices[StartDelimiter].push(-1);
                    }

                    return Out;
                }).flat(20));

            if (InnermostStartIndex === -1)
            {
                return undefined;
            }

            SearchedIndices[Strings[InnermostStartIndex] as FDelimiterStartString].push(InnermostStartIndex);

            const GetFirstIndexOfValueAfterIndex = <Type>(
                Values: Readonly<TArray<Type>>,
                TargetValue: Type,
                AfterIndex: number
            ): number | undefined =>
            {
                const StartIndex: number = Math.min(Math.max(AfterIndex + 1, 0), Values.length);

                for (let Index: number = StartIndex; Index < Values.length; Index++)
                {
                    if (Object.is(Values[Index], TargetValue))
                    {
                        return Index;
                    }
                }

                return undefined;
            };

            const InnermostLogString: FLogString | undefined = InLogStrings[InnermostStartIndex];
            if (InnermostLogString === undefined)
            {
                return undefined;
            }

            const InnermostStartDelimiter: string = InnermostLogString.String;
            const InnermostStopDelimiter: string =
                InnermostStartDelimiter === "{"
                    ? "}"
                    : InnermostStartDelimiter === "<"
                        ? ">"
                        : "]";

            const InnermostStopIndex: number | undefined = GetFirstIndexOfValueAfterIndex(
                Strings,
                InnermostStopDelimiter,
                InnermostStartIndex
            );

            if (InnermostStopIndex === undefined)
            {
                return undefined;
            }

            const InnermostContainer: FLogStringArray =
                InLogStrings.slice(InnermostStartIndex, InnermostStopIndex + 1) as FLogStringArray;
            const StopSubArray: TArray<FLogString> = InLogStrings.length >= InnermostStopIndex + 1
                ? InLogStrings.slice(InnermostStopIndex + 1, undefined)
                : [ ];

            return {
                Container: InnermostContainer,
                StartSubArray: InLogStrings.slice(0, InnermostStartIndex),
                StopSubArray
            };
        };

        const ShouldInline = (ContainerLogStrings: FLogStringArray): boolean =>
        {
            const TotalWidth: number =
                ContainerLogStrings[0].Depth * LogSettings.Size.TabWidth +
                ContainerLogStrings.reduce((Accumulator: number, CurrentValue: FLogString): number =>
                {
                    return Accumulator + GetLength(CurrentValue.String);
                }, 0);

            return TotalWidth <= LogSettings.Size.MaxTerminalWidth;
        };

        const InnermostContainer: FGetInnermostContainerReturnType = GetInnermostContainer(LogStrings);
        if (InnermostContainer !== undefined)
        {
            const { Container, StartSubArray, StopSubArray } = InnermostContainer;
            if (ShouldInline(InnermostContainer.Container))
            {
                const Inlined: FLogString =
                {
                    Depth: Container[0].Depth,
                    String: Container.map(GetString).join(" ")
                };
                return [ ...StartSubArray, Inlined, ...StopSubArray ] as FLogStringArray;
            }
        }

        return LogStrings;
    };

    const ShouldRecur = (): boolean =>
    {
        return (
            !SearchedIndices["<"].includes(-1) ||
            !SearchedIndices["{"].includes(-1) ||
            !SearchedIndices["["].includes(-1)
        );
    };

    let Out: FLogStringArray = [ ...In ];

    while (ShouldRecur())
    {
        Out = Recurrence([ ...Out ]);
    }

    return Out;
};

const FormatDigits = (Value: number | bigint): string =>
{
    const Separators: Record<FLogDigitSeparator, string> =
    {
        Comma: ",",
        None: "",
        Space: " ",
        Underscore: "_"
    };

    const Separator: string = Separators[LogSettings.Format.DigitSeparator];

    const GroupIntegralDigits = (IntegralDigits: string): string =>
    {
        if (IntegralDigits.length <= 3)
        {
            return IntegralDigits;
        }

        const Groups: TArray<string> = [ ];
        for (let Index: number = IntegralDigits.length; Index > 0; Index -= 3)
        {
            const StartIndex: number = Math.max(0, Index - 3);
            Groups.push(IntegralDigits.slice(StartIndex, Index));
        }

        Groups.reverse();
        return Groups.join(Separator);
    };

    const GroupFractionalDigits = (FractionalDigits: string): string =>
    {
        if (FractionalDigits.length <= 3)
        {
            return FractionalDigits;
        }

        const Groups: TArray<string> = [];
        for (let Index: number = 0; Index < FractionalDigits.length; Index += 3)
        {
            Groups.push(FractionalDigits.slice(Index, Index + 3));
        }

        return Groups.join(Separator);
    };

    const ConvertScientificNotationToPlainDecimal = (NumberText: string): string =>
    {
        const ExponentMarkerIndex: number = NumberText.search(/[eE]/);
        if (ExponentMarkerIndex === -1)
        {
            return NumberText;
        }

        const MantissaText: string = NumberText.slice(0, ExponentMarkerIndex);
        const ExponentText: string = NumberText.slice(ExponentMarkerIndex + 1);
        const ExponentValue: number = Number(ExponentText);

        let SignText: string = "";
        let UnsignedMantissaText: string = MantissaText;

        if (UnsignedMantissaText.startsWith("-"))
        {
            SignText = "-";
            UnsignedMantissaText = UnsignedMantissaText.slice(1);
        }
        else if (UnsignedMantissaText.startsWith("+"))
        {
            UnsignedMantissaText = UnsignedMantissaText.slice(1);
        }

        const DecimalPointIndex: number = UnsignedMantissaText.indexOf(".");
        const DigitsOnly: string = UnsignedMantissaText.replace(".", "");
        const DigitsBeforeDecimal: number = (DecimalPointIndex === -1)
            ? DigitsOnly.length
            : DecimalPointIndex;

        const NewDecimalIndex: number = DigitsBeforeDecimal + ExponentValue;

        if (NewDecimalIndex <= 0)
        {
            const LeadingZerosCount: number = -NewDecimalIndex;
            return SignText + "0." + "0".repeat(LeadingZerosCount) + DigitsOnly;
        }

        if (NewDecimalIndex >= DigitsOnly.length)
        {
            const TrailingZerosCount: number = NewDecimalIndex - DigitsOnly.length;
            return SignText + DigitsOnly + "0".repeat(TrailingZerosCount);
        }

        return SignText + DigitsOnly.slice(0, NewDecimalIndex) + "." + DigitsOnly.slice(NewDecimalIndex);
    };

    if (typeof Value === "bigint")
    {
        const IsNegative: boolean = Value < 0n;
        const AbsoluteValue: bigint = IsNegative ? -Value : Value;

        const IntegralDigits: string = AbsoluteValue.toString();
        const GroupedIntegralDigits: string = GroupIntegralDigits(IntegralDigits);

        return (IsNegative ? "-" : "") + GroupedIntegralDigits;
    }

    if (!Number.isFinite(Value))
    {
        return String(Value);
    }

    const IsNegative: boolean = Value < 0 || Object.is(Value, -0);
    const AbsoluteValue: number = Math.abs(Value);

    const PlainDecimalText: string = ConvertScientificNotationToPlainDecimal(AbsoluteValue.toString());
    const Parts: TArray<string> = PlainDecimalText.split(".");
    const IntegralDigits: string = Parts[0] ?? "0";
    const FractionalDigits: string | undefined = Parts[1];

    const GroupedIntegralDigits: string = GroupIntegralDigits(IntegralDigits);

    if (FractionalDigits === undefined || FractionalDigits.length === 0)
    {
        return (IsNegative ? "-" : "") + GroupedIntegralDigits;
    }

    const GroupedFractionalDigits: string = GroupFractionalDigits(FractionalDigits);

    return (IsNegative ? "-" : "") + GroupedIntegralDigits + "." + GroupedFractionalDigits;
};

const FormatNumber = ({ Depth, Value }: TLogPrimitive<number> | TLogPrimitive<bigint>): FLogString =>
{

    return {
        Depth,
        String: StyleNumber(Value)
    };
};

const FormatNull = ({ Depth }: TLogPrimitive<null>): TArray<FLogString> =>
{
    return [ {
        Depth,
        String: LogSettings.Format.Colors ? Chalk.yellow("null") : "null"
    } ];
};

const FormatUndefined = ({ Depth }: TLogPrimitive<undefined>): FLogString =>
{
    return {
        Depth,
        String: LogSettings.Format.Colors ? Chalk.gray("undefined") : "undefined"
    };
};

const FormatFunction = ({ Depth }: TLogPrimitive<Function>): FLogString =>
{
    return {
        Depth,
        String: LogSettings.Format.Colors ? Chalk.red("[ Function ]") : "[ Function ]"
    };
};

const FormatBoolean = ({ Depth, Value }: TLogPrimitive<boolean>): FLogString =>
{
    const StringBase: string = Value ? "true" : "false";
    const StyleFunction: Function = LogSettings.Format.Colors
        ? (Value ? Chalk.blue : Chalk.red)
        : Identity;

    const String: string = StyleFunction(StringBase);

    return {
        Depth,
        String
    };
};

const Delimiters: FDelimiters =
{
    Array: [ "[", "]" ],
    KeyValuePair: [ "{", "}" ],
    Map: [ "<", ">" ],
    Record: [ "{", "}" ],
    Set: [ "{", "}" ]
};

const GetDelimiters = (Depth: number, ContainerType: FContainerType): [ FLogString, FLogString ] =>
{
    const MakeDelimiterLogString = (String: string): FLogString => ({ Depth, String });
    return Delimiters[ContainerType].map(MakeDelimiterLogString) as [ FLogString, FLogString ];
};

const FormatArray = (LogArray: FLogArray): TArray<FLogString> =>
{
    return FormatContainer("Array", LogArray);
};

const FormatMap = ({ Depth, Value }: FLogMap): TArray<FLogString> =>
{
    const FormatKeyValuePair = ({ Depth, Key, Value }: FKeyValuePair): FLogStringArray =>
    {
        const [ StartDelimiterLogString, StopDelimiterLogString ] = GetDelimiters(Depth, "KeyValuePair");

        const FormatMapKey = ({ Depth, Key }: Omit<FKeyValuePair, "Value">): FLogString =>
        {
            const Out: FLogString = FormatValue({ Depth: Depth + 1, Value: Key })[0];
            Out.String += ",";
            return Out;
        };

        const FormatMapValue = ({ Depth, Value }: Omit<FKeyValuePair, "Key">): FLogStringArray =>
        {
            return FormatValue({ Depth: Depth + 1, Value });
        };

        const KeyLogString: FLogString = FormatMapKey({ Depth, Key });
        const ValueLogStrings: FLogStringArray = FormatMapValue({ Depth, Value });

        return [ StartDelimiterLogString, KeyLogString, ...ValueLogStrings, StopDelimiterLogString ];
    };

    const [ StartDelimiterLogString, StopDelimiterLogString ] = GetDelimiters(Depth, "Map");
    const GetKeyValuePairs = (InMap: FMap): TArray<FKeyValuePair> =>
    {
        const Out: TArray<FKeyValuePair> = [ ];

        InMap.forEach((Value: unknown, Key: FPrimitive): void =>
        {
            Out.push({ Depth: Depth + 1, Key, Value: Value as TLogValue });
        });

        return Out;
    };

    const InnerLogStrings: FLogStringArray =
        GetKeyValuePairs(Value).map(FormatKeyValuePair).flat(20) as FLogStringArray;

    return [ StartDelimiterLogString, ...InnerLogStrings, StopDelimiterLogString ];
};

const FormatRecord = ({ Depth, Value }: FLogRecord): TArray<FLogString> =>
{
    const [ StartDelimiterLogString, StopDelimiterLogString ] = GetDelimiters(Depth, "Record");

    const GetKeyValuePairs = (InRecord: FRecord): TArray<FKeyValuePair> =>
    {
        const Out: TArray<FKeyValuePair> = [ ];

        Object.keys(InRecord).forEach((Key: PropertyKey): void =>
        {
            Out.push({ Depth, Key, Value: InRecord[Key] as TLogValue });
        });

        return Out;
    };

    const KeyValuePairs: TArray<FKeyValuePair> = GetKeyValuePairs(Value);

    const FormatKeyValuePair = ({ Depth, Key, Value }: FKeyValuePair, Index: number): FLogStringArray =>
    {
        // const [ StartDelimiterLogString, StopDelimiterLogString ] = GetDelimiters(Depth, "Record");

        const FormatRecordKey = ({ Depth, Key }: Omit<FKeyValuePair, "Value">): FLogString =>
        {
            const Out: FLogString = FormatValue({ Depth: Depth + 1, Value: Key })[0];
            Out.String += ":";
            return Out;
        };

        const FormatRecordValue = ({ Depth, Value }: Omit<FKeyValuePair, "Key">): FLogStringArray =>
        {
            const Out: FLogStringArray = FormatValue({ Depth: Depth + 1, Value });
            if (Index !== KeyValuePairs.length - 1)
            {
                const Last: FLogString | undefined = Out.at(-1);
                if (Last !== undefined)
                {
                    Last.String += ",";
                }
            }
            return Out;
        };

        const KeyLogString: FLogString = FormatRecordKey({ Depth, Key });
        const ValueLogStrings: FLogStringArray = FormatRecordValue({ Depth, Value });

        if (ValueLogStrings.length === 1)
        {
            const Out: FLogString =
            {
                Depth: Depth + 1,
                String: KeyLogString.String + " " + ValueLogStrings[0].String
            };

            return [ Out ];
        }
        else
        {
            return [ KeyLogString, ...ValueLogStrings ];
        }
    };

    const InnerLogStrings: FLogStringArray =
        KeyValuePairs.map(FormatKeyValuePair).flat(20) as FLogStringArray;

    return [ StartDelimiterLogString, ...InnerLogStrings, StopDelimiterLogString ];
};

const FormatContainer = (
    ContainerType: FSetTypeName | FArrayTypeName,
    { Depth, Value }: FLogSet | FLogArray
): TArray<FLogString> =>
{
    const [ StartDelimiterLogString, StopDelimiterLogString ] = GetDelimiters(Depth, ContainerType);

    const MakeLogValue = (In: FLogValueType): TLogValue => ({ Depth: Depth + 1, Value: In });

    const ValueArray: TArray<FLogValueType> = Array.isArray(Value)
        ? Value
        : Array.from(Value);

    const AppendComma = ({ Depth, String }: FLogString, Index: number): FLogString =>
    {
        return Index !== ValueArray.length - 1
            ? {
                Depth,
                String: String + ","
            }
            : {
                Depth,
                String
            };
    };

    const InnerLogStrings: FLogStringArray =
        ValueArray.map(MakeLogValue).map(FormatValue).flat(20).map(AppendComma) as FLogStringArray;

    if (InnerLogStrings.length === 0)
    {
        return [ {
            Depth,
            String: StartDelimiterLogString.String + " " + StopDelimiterLogString.String
        } ];
    }
    else
    {
        return [ StartDelimiterLogString, ...InnerLogStrings, StopDelimiterLogString ];
    }
};

const FormatSet = (LogSet: FLogSet): TArray<FLogString> =>
{
    return FormatContainer("Set", LogSet);
};

const FormatObject = ({ Depth, Value }: TLogContainer): TArray<FLogString> =>
{
    let Formatter: Function = FormatRecord;
    if (Value instanceof Map)
    {
        Formatter = FormatMap;
    }
    else if (Value instanceof Set)
    {
        Formatter = FormatSet;
    }
    else if (Array.isArray(Value))
    {
        Formatter = FormatArray;
    }
    else if (Value === null)
    {
        Formatter = FormatNull;
    }

    return Formatter({ Depth, Value });
};

const FormatValue = ({ Depth, Value }: TLogValue): FLogStringArray =>
{
    const Formatters: Record<FTypeof, Function> =
    {
        bigint: FormatNumber,
        boolean: FormatBoolean,
        function: FormatFunction,
        number: FormatNumber,
        object: FormatObject,
        string: FormatString,
        symbol: FormatSymbol,
        undefined: FormatUndefined
    };

    const Values: FLogString | FLogStringArray = Formatters[typeof Value]({ Depth, Value });

    return Array.isArray(Values)
        ? Values
        : [ Values ];
};

export const Format = (Value: FLogValueType): string =>
{
    const InlinedArray: FLogStringArray = Inline(FormatValue({ Depth: 0, Value }));
    const Out: string = InlinedArray
        .map(({ Depth, String }: FLogString, Index: number): string =>
        {
            const StopDelimiters: TArray<string> = [ ">", "]", "}" ];
            const StartDelimiters: TArray<string> = [ "<", "[", "{" ];
            const Character: string = GetWithoutAnsi(String)[GetWithoutAnsi(String).length - 1] || "";
            if (StopDelimiters.includes(Character))
            {
                if (Index !== InlinedArray.length - 1)
                {
                    const Next: FLogString | undefined = InlinedArray[Index + 1];
                    if (Next !== undefined)
                    {
                        const NextStringStart: string | undefined = Next.String[0];
                        if (NextStringStart !== undefined)
                        {
                            if (StartDelimiters.includes(NextStringStart))
                            {
                                String += ",";
                            }
                        }
                    }
                }
            }

            return " ".repeat(LogSettings.Size.TabWidth * Depth) + String;
        })
        .join("\n");

    return Out;
};

export const FormatInline = (Value: FLogValueType): string =>
{
    return Format(Value).replaceAll("\n", " ");
};

const IsBase64String = (In: string): boolean =>
{
    // const NormalizedInput: string = In.replace(/\s+/g, "");

    // if (NormalizedInput.length === 0 || NormalizedInput.length % 4 !== 0)
    // {
    //     return false;
    // }

    // return /^[A-Za-z0-9+/]*={0,2}$/.test(NormalizedInput);
    return (
        In.startsWith("data:") &&
        In.includes(";") &&
        In.length > 20
    );
};

export const FormatBase64String = (In: string): string =>
{
    if (!LogSettings.Format.TruncateBase64Strings)
    {
        return In;
    }

    if (IsBase64String(In))
    {
        return Chalk.gray(`[ Base64 (${ In.slice("data:".length).split(";")[0] }) ]`);
    }
    else
    {
        return In;
    }

};
