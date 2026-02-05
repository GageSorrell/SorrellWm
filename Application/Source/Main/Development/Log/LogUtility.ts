/* File:      LogUtility.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type {
    FLogObjectType,
    FLogString,
    FTypeofReturnValue,
    FValueFormatter,
    TLogArray,
    TLogMap,
    TLogPrimitive,
    TLogRecord,
    TLogSet } from "./LogUtility.Types";
import { LogSettings } from "?/LoggerSettings";
import type { TMaybeArray } from "?/Utility.Types";

/* eslint-disable @typescript-eslint/no-unsafe-function-type */

// 1. Call Format appropriate function
// 2. If value is a Container, then call the corresponding container
// 3. Collect all formatted values, such that no strings handle newlines, commas, or braces
// 4. Iterate over all formatted values and insert newlines, commas, and braces where needed

const FormatNumberValue = (Value: number | bigint): string =>
{
    const GroupIntegralDigits = (IntegralDigits: string): string =>
    {
        if (IntegralDigits.length <= 3)
        {
            return IntegralDigits;
        }

        const Groups: Array<string> = [];
        for (let Index: number = IntegralDigits.length; Index > 0; Index -= 3)
        {
            const StartIndex: number = Math.max(0, Index - 3);
            Groups.push(IntegralDigits.slice(StartIndex, Index));
        }

        Groups.reverse();
        return Groups.join(" ");
    };

    const GroupFractionalDigits = (FractionalDigits: string): string =>
    {
        if (FractionalDigits.length <= 3)
        {
            return FractionalDigits;
        }

        const Groups: Array<string> = [];
        for (let Index: number = 0; Index < FractionalDigits.length; Index += 3)
        {
            Groups.push(FractionalDigits.slice(Index, Index + 3));
        }

        return Groups.join(" ");
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
    const Parts: Array<string> = PlainDecimalText.split(".");
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

function FormatNumber({ Depth, Value }: TLogPrimitive<bigint>): FLogString;
function FormatNumber({ Depth, Value }: TLogPrimitive<number>): FLogString;
function FormatNumber({ Depth, Value }: TLogPrimitive<bigint> | TLogPrimitive<number>): FLogString
{
    return {
        Depth,
        String: FormatNumberValue(Value)
    };
}

// const FormatRecord = (InValue: Record<PropertyKey, unknown>, Depth: number): string =>
// {
//     const FormatKeyValuePair = (Key: PropertyKey, Value: unknown): string =>
//     {
//         const KeyString: string = Key.toString();
//         const ValueString: string = FormatValue(Value, Depth);

//         return `${ KeyString }: ${ ValueString }`;
//     };

//     const WrapInBraces = (FormattedValues: string): string =>
//     {
//         return "{\n" + FormattedValues + "}";
//     };

//     const FormatFromKey = (Key: PropertyKey): string =>
//     {
//         const Value: unknown = InValue[Key];
//         return FormatKeyValuePair(Key, Value);
//     };

//     const FormattedKeyValuePairs: Array<string> = Object.keys(InValue).map(FormatFromKey);

//     return WrapInBraces(JoinValues(FormattedKeyValuePairs, Depth + 1));
// };

const Indent = (Depth: number): string => " ".repeat(LogSettings.TabWidth).repeat(Depth);

// const JoinValues = (Values: Array<unknown>, Depth: number): string =>
// {
//     const FormatArrayValue = (Value: unknown): string => FormatValue({ Value, Depth });

//     return Values.map(FormatArrayValue).join(",\n").slice(0, -2) + "\n";
// };

const FormatArray = (LogObject: TLogPrimitive<object>): Array<FLogString> =>
{
    const { Depth, Value }: TLogArray = GetArrayFromPrimitive(LogObject);

    if (Value.length === 0)
    {
        const EmptyArrayLogString: FLogString =
        {
            Depth,
            String: "[ ]"
        };

        return [ EmptyArrayLogString ];
    }

    const StartString: FLogString =
    {
        Depth,
        String: "["
    };

    const EndString: FLogString =
    {
        Depth,
        String: "]"
    };

    const InsideStrings: Array<FLogString> = Value.map((Element: unknown): FLogString =>
    {
        return FormatValue({ Depth, Value: Element });
    });

    if (ShouldObjectInline(InsideStrings))
    {
        const InsideString: string = InsideStrings.map(({ String }: FLogString): string => String).join(" ");
        const OutString: string = `[${ StartString.String } ${ InsideString } ${ EndString.String }`;
        const OutLogString: FLogString = {
            Depth,
            String: OutString
        };

        return [ OutLogString ];
    }
    else
    {
        return [ StartString, ...InsideStrings, EndString ];
    }

};

const FormatSet = (LogObject: TLogPrimitive<object>): Array<FLogString> =>
{
    const { Depth, Value }: TLogSet = GetSetFromPrimitive(LogObject);

    if (Value.size === 0)
    {
        const EmptySetLogString: FLogString =
        {
            Depth,
            String: "{ }"
        };

        return [ EmptySetLogString ];
    }

    const StartString: FLogString =
    {
        Depth,
        String: "{"
    };

    const EndString: FLogString =
    {
        Depth,
        String: "}"
    };

    const FormatElement = (Element: unknown): FLogString =>
    {
        return FormatValue({ Depth: Depth + 1, Value: Element });
    };

    const InsideStrings: Array<FLogString> = Array.from(Value).map(FormatElement);

    const SetLogStrings: Array<FLogString> = [ StartString, ...InsideStrings, EndString ];

    if (ShouldObjectInline(InsideStrings))
    {
        const OutString: string = SetLogStrings.join(" ");
        const OutLogString: FLogString =
        {
            Depth,
            String: OutString
        };

        return [ OutLogString ];
    }
    else
    {
        return SetLogStrings;
    }
};

const ShouldObjectInline = (InsideStrings: Array<FLogString>): boolean =>
{
    /* This function should be provided a set of `FLogString`s *
     * all at the same Depth, so checking any is fine.         */
    const Depth: number = InsideStrings[0].Depth;
    const LogStringsLength: number = InsideStrings
        .map((InsideString: FLogString): number => InsideString.String.length)
        .reduce((Accumulator: number, CurrentValue: number): number => Accumulator + CurrentValue, 0);

    const SpacesWidth: number = InsideStrings.length - 1;
    /* The start/ending braces, as well as a space after/before them respectively. */
    const BracesLength: number = 4;

    const TotalWidth: number =
        Depth * LogSettings.TabWidth +
        LogStringsLength +
        SpacesWidth +
        BracesLength;

    return TotalWidth <= LogSettings.MaxTerminalWidth;
};

const FormatRecord = (LogObject: TLogPrimitive<object>): Array<FLogString> =>
{
    /* For keys whose values are not objects, a single FLogString is used.  *
     * Otherwise, one FLogString is used for the key name, then FLogStrings *
     * are created for each element in the value (which is a container).    */

    const { Depth, Value: Record }: TLogRecord = GetRecordFromPrimitive(LogObject);

    const StartBrace: FLogString =
    {
        Depth,
        String: "{"
    };

    const EndBrace: FLogString =
    {
        Depth,
        String: "}"
    };

    const Keys: Array<PropertyKey> = Object.keys(Record);
    const InsideStrings: Array<FLogString> = [ ];
    const AppendKeyValuePair = (Key: PropertyKey): void =>
    {
        const Value: unknown = Record[Key];
        const LogPrimitive: TLogPrimitive = MakeLogPrimitive(Depth + 1, Value);
        const LogString: FLogString = FormatValue(LogPrimitive);
        const KeyString: string = `${ Key.toString() }:`;
        if (typeof Value === "object")
        {
            const KeyLogString: FLogString =
            {
                Depth,
                String: KeyString
            };

            InsideStrings.push(KeyLogString, LogString);
        }
        else
        {
            LogString.String = `${ KeyString } ${ LogString.String }`;
            InsideStrings.push(LogString);
        }
    };

    Keys.forEach(AppendKeyValuePair);

    if (ShouldObjectInline(InsideStrings))
    {
        const GetStringFromLogString = ({ String }: FLogString): string => String;
        const InlinedStrings: Array<string> = InsideStrings.map(GetStringFromLogString);

        const OutArray: Array<string> = [ StartBrace.String, ...InlinedStrings, EndBrace.String ];
        const OutString: string = OutArray.join(" ");
        const OutLogString: FLogString =
        {
            Depth,
            String: OutString
        };

        return [ OutLogString ];
    }
    else
    {
        return [ StartBrace, ...InsideStrings, EndBrace ];
    }
};

const MakeLogPrimitive = (Depth: number, Value: unknown): TLogPrimitive =>
{
    return {
        Depth,
        Value
    };
};

const FormatMap = (LogObject: TLogPrimitive<object>): Array<FLogString> =>
{
    const { Depth, Value: Map }: TLogMap = GetMapFromPrimitive(LogObject);

    const StartBrace: FLogString =
    {
        Depth,
        String: "<"
    };

    const EndBrace: FLogString =
    {
        Depth,
        String: ">"
    };

    const Keys: Array<PropertyKey> = Array.from(Map.keys());
    const InsideStrings: Array<FLogString> = [ ];
    const AppendKeyValuePair = (Key: PropertyKey): void =>
    {
        const Value: unknown = Map.get(Key);
        const LogPrimitive: TLogPrimitive = MakeLogPrimitive(Depth + 1, Value);
        const LogString: FLogString = FormatValue(LogPrimitive);
        const KeyString: string = `${ Key.toString() },`;

        if (typeof Value === "object")
        {
            const EntryStartBrace: FLogString =
            {
                Depth: Depth + 1,
                String: "{"
            };

            const EntryEndBrace: FLogString =
            {
                Depth: Depth + 1,
                String: "{"
            };

            const KeyLogString: FLogString =
            {
                Depth: Depth + 2,
                String: KeyString
            };

            InsideStrings.push(EntryStartBrace, KeyLogString, LogString, EntryEndBrace);
        }
        else
        {
            LogString.String = `{ ${ KeyString }, ${ LogString.String } }`;
            InsideStrings.push(LogString);
        }
    };

    Keys.forEach(AppendKeyValuePair);

    const MapLogStrings: Array<FLogString> = [ StartBrace, ...InsideStrings, EndBrace ];

    if (ShouldObjectInline(InsideStrings))
    {
        const OutString: string = MapLogStrings.join(" ");
        const OutLogString: FLogString =
        {
            Depth,
            String: OutString
        };

        return [ OutLogString ];
    }
    else
    {
        return MapLogStrings;
    }
};

const IsLogObject = (LogPrimitive: TLogPrimitive): LogPrimitive is TLogPrimitive<object> =>
{
    return typeof LogPrimitive === "object";
};

const FormatValue = (LogPrimitive: TLogPrimitive): FLogString =>
{
    const InType: FTypeofReturnValue = typeof LogPrimitive.Value;
    return IsLogObject(LogPrimitive)
        ? ReduceLogStrings(ValueFormatters["object"](LogPrimitive as never) as Array<FLogString>)
        : ValueFormatters[InType](LogPrimitive as never) as FLogString;
};

// const FormatNonObject = <T extends FPrimitive>(LogPrimitive: TLogPrimitive<T>): FLogString =>
// {
//     const InType: FTypeofReturnValue = typeof LogPrimitive.Value;
//     return ValueFormatters[InType](LogPrimitive as never) as FLogString;
// };

const GetLogObjectType = ({ Value }: TLogPrimitive<object>): FLogObjectType =>
{
    if (Value === null)
    {
        return "null";
    }
    else if (Array.isArray(Value))
    {
        return "Array";
    }
    else if (Value instanceof Set)
    {
        return "Set";
    }
    else // Value instanceof Map
    {
        return "Map";
    }
};

const FormatNull = ({ Depth }: TLogPrimitive<object>): Array<FLogString> =>
{
    const LogString: FLogString =
    {
        Depth,
        String: "null"
    };

    return [ LogString ];
};

const GetArrayFromPrimitive = ({ Depth, Value: InValue }: TLogPrimitive<object>): TLogArray =>
{
    const Value: TLogArray["Value"] = InValue as TLogArray["Value"];
    return {
        Depth,
        Type: "Array",
        Value
    };
};

const GetSetFromPrimitive = ({ Depth, Value: InValue }: TLogPrimitive<object>): TLogSet =>
{
    const Value: TLogSet["Value"] = InValue as TLogSet["Value"];
    return {
        Depth,
        Type: "Set",
        Value
    };
};

const GetMapFromPrimitive = ({ Depth, Value: InValue }: TLogPrimitive<object>): TLogMap =>
{
    const Value: TLogMap["Value"] = InValue as TLogMap["Value"];
    return {
        Depth,
        Type: "Map",
        Value
    };
};

const GetRecordFromPrimitive = ({ Depth, Value: InValue }: TLogPrimitive<object>): TLogRecord =>
{
    const Value: TLogRecord["Value"] = InValue as TLogRecord["Value"];
    return {
        Depth,
        Type: "Record",
        Value
    };
};

const ReduceLogStrings = (LogStrings: Array<FLogString>): FLogString =>
{
    const MinDepth: number = ((): number =>
    {
        const GetDepth = (LogString: FLogString): number => LogString.Depth;
        return Math.min(...LogStrings.map(GetDepth));
    })();

    const CollectLogString = ({ Depth: InDepth, String }: FLogString, Index: number): string =>
    {
        const IsLast: boolean = LogStrings.length === Index - 1;
        const Depth: number = InDepth - MinDepth;
        const LineEnd: string = IsLast ? "" : ",";
        return Indent(Depth) + String + LineEnd;
    };

    const String: string = LogStrings.map(CollectLogString).join("\n");

    return {
        Depth: MinDepth,
        String
    };
};

const FormatObject = (LogObject: TLogPrimitive<object>): FLogString =>
{
    const FormattedObject: TMaybeArray<FLogString> = FormatObjectInternal(LogObject);
    return Array.isArray(FormattedObject)
        ? ReduceLogStrings(FormattedObject)
        : FormattedObject;
};

const FormatObjectInternal = (LogObject: TLogPrimitive<object>): TMaybeArray<FLogString> =>
{
    const LogObjectType: FLogObjectType = GetLogObjectType(LogObject);
    type FObjectFormatters = Record<FLogObjectType, ((In: TLogPrimitive<object>) => Array<FLogString>)>;
    const FormatFunctions: FObjectFormatters =
    {
        Array: FormatArray,
        Map: FormatMap,
        Record: FormatRecord,
        Set: FormatSet,
        null: FormatNull
    };

    return FormatFunctions[LogObjectType](LogObject);
};

const FormatBoolean = ({ Depth, Value }: TLogPrimitive<boolean>): FLogString =>
{
    const String: string = Value ? "true" : "false";

    return {
        Depth,
        String
    };
};

const FormatFunction = ({ Depth }: TLogPrimitive<Function>): FLogString =>
{
    return {
        Depth,
        String: "[ Function ]"
    };
};

const FormatString = ({ Depth, Value }: TLogPrimitive<string>): FLogString =>
{
    return {
        Depth,
        String: Value
    };
};

const FormatSymbol = ({ Depth, Value }: TLogPrimitive<symbol>): FLogString =>
{
    return {
        Depth,
        String: Value.toString()
    };
};

const FormatUndefined = ({ Depth }: TLogPrimitive<undefined>): FLogString =>
{
    return {
        Depth,
        String: "undefined"
    };
};

const ValueFormatters: FValueFormatter =
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

export const LogFormat = (Value: unknown): string =>
{
    return FormatValue({ Depth: 0, Value }).String;
};
