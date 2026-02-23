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
    TLogSet } from "./LogUtility.Types.Old";
import Chalk from "chalk";
import { LogSettings } from "../../../Shared/LoggerSettings";
import type { TMaybeArray } from "!/Utility/Utility.Types";

Chalk.level = 3;

/* eslint-disable @typescript-eslint/no-unsafe-function-type */

/** TEMPORARY FOR DEBUGGING. */
/* eslint-disable no-console */

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

const StyleString = (In: string): string =>
{
    console.log(`StyleString was provided "${ In }"`);
    return LogSettings.Colors
        ? Chalk.hex("#CA5010")(`"${ In }"`)
        : `"${ In }"`;
};

const StyleSymbol = (In: symbol): string =>
{
    return LogSettings.Colors
        ? Chalk.hex("#00B7C3")(In.toString())
        : In.toString();
};

const StyleNumber = (In: bigint | number): string =>
{
    return LogSettings.Colors
        ? Chalk.green(FormatNumberValue(In))
        : FormatNumberValue(In);
};

const StylePropertyKey = (In: PropertyKey): string =>
{
    if (typeof In === "number")
    {
        return StyleNumber(In);
    }
    else if (typeof In === "symbol")
    {
        return StyleSymbol(In);
    }
    else
    {
        return StyleString(In);
    }
};

function FormatNumber({ Depth, Value }: TLogPrimitive<bigint>): FLogString;
function FormatNumber({ Depth, Value }: TLogPrimitive<number>): FLogString;
function FormatNumber({ Depth, Value }: TLogPrimitive<bigint> | TLogPrimitive<number>): FLogString
{
    return {
        Depth,
        String: StyleNumber(Value)
    };
}

const Indent = (Depth: number): string => " ".repeat(LogSettings.Size.TabWidth).repeat(Depth);

const FormatArray = (LogObject: TLogPrimitive<object>): Array<FLogString> =>
{
    const { Depth, Value }: TLogArray = GetArrayFromPrimitive(LogObject);

    console.log(`FormatArray::Depth is ${ Depth }.`);

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
        console.log(`InsideStrings is formatting Element\n${ Stringify(Element) }.`);
        const Out: FLogString = FormatValue({ Depth: Depth + 3, Value: Element });
        console.log(`InsideStrings used FormatValue, returned\n${ Stringify(Out) }.`);
        return Out;
    });

    if (ShouldObjectInline(InsideStrings))
    {
        console.log(`ShouldObjectInline: true for ${ JSON.stringify(InsideStrings) }.`);
        const InsideString: string = InsideStrings.map(({ String }: FLogString): string => String).join(", ");
        const OutString: string = `${ StartString.String } ${ InsideString } ${ EndString.String }`;
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
        // console.log("FormatElement: Calling FormatValue!");
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
    if (InsideStrings.length === 0)
    {
        return true;
    }

    const Depth: number = InsideStrings[0].Depth;
    const LogStringsLength: number = InsideStrings
        .map((InsideString: FLogString): number => StripChalk(InsideString.String.trim()).length)
        .reduce((Accumulator: number, CurrentValue: number): number => Accumulator + CurrentValue, 0);

    const SpacesWidth: number = InsideStrings.length - 1;
    /* The start/ending braces, as well as a space after/before them respectively. */
    const BracesLength: number = 4;

    const TotalWidth: number =
        Depth * LogSettings.Size.TabWidth +
        LogStringsLength +
        SpacesWidth +
        BracesLength;

    return TotalWidth <= LogSettings.Size.MaxTerminalWidth;
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
        // console.log("FormatRecord::AppendKeyValuePair: Calling FormatValue!");
        const LogString: FLogString = FormatValue(LogPrimitive);
        const KeyString: string = `${ StylePropertyKey(Key) }:`;
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
    const { Depth, Value: LogMap }: TLogMap = GetMapFromPrimitive(LogObject);

    // let LogMapString: string = "";
    // LogMap.forEach((Value: unknown, Key: PropertyKey): void =>
    // {
    //     LogMapString += `{ ${ StylePropertyKey(Key) }, ${ JSON.stringify(Value) } }`;
    // });
    // console.log(`Going to format map, which is\n${ LogMapString }.`);

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

    const Keys: Array<PropertyKey> = Array.from(LogMap.keys());
    const InsideStrings: Array<FLogString> = [ ];
    const AppendKeyValuePair = (Key: PropertyKey): void =>
    {
        const Value: unknown = LogMap.get(Key);
        const LogPrimitive: TLogPrimitive = MakeLogPrimitive(Depth + 2, Value);
        // console.log("FormatMap::AppendKeyValuePair: Calling FormatValue!");
        const LogString: FLogString = FormatValue(LogPrimitive);

        const KeyString: string = `${ StylePropertyKey(Key) },`;

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
                String: "}"
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
            LogString.String = `{ ${ KeyString } ${ LogString.String } }`;
            InsideStrings.push(LogString);
        }
    };

    Keys.forEach(AppendKeyValuePair);

    const MapLogStrings: Array<FLogString> = [ StartBrace, ...InsideStrings, EndBrace ];

    if (ShouldObjectInline(InsideStrings))
    {
        const OutString: string = MapLogStrings.map(({ String }: FLogString): string => String).join(" ");
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

const FormatValue = (LogPrimitive: TLogPrimitive): FLogString =>
{
    console.log(`FormatValue::LogPrimitive.Value is ${ Stringify(LogPrimitive.Value) }.`);
    console.log(`FormatValue::LogPrimitive.Depth is ${ LogPrimitive.Depth }.`);
    const InType: FTypeofReturnValue = typeof LogPrimitive.Value;
    return ValueFormatters[InType](LogPrimitive as never);
};

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
    else if (Value instanceof Map)
    {
        return "Map";
    }
    else
    {
        return "Record";
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

const StripChalk = (In: string): string =>
{
    /* eslint-disable-next-line @stylistic/max-len, no-control-regex */
    const AnsiEscapeSequencePattern: RegExp = /[\u001B\u009B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[a-zA-Z\d]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nqry=><~]))/g;

    return In.replace(AnsiEscapeSequencePattern, "");
};

const ReduceLogStrings = (LogStrings: Array<FLogString>): FLogString =>
{
    const MinDepth: number = ((): number =>
    {
        const GetDepth = (LogString: FLogString): number => LogString.Depth;
        // console.log(`ReduceLogStrings: LogStrings is ${ JSON.stringify(LogStrings).slice(0, 40) }.`);
        return Math.min(...(LogStrings.map(GetDepth)));
    })();

    const CollectLogString = ({ Depth: InDepth, String }: FLogString, Index: number): string =>
    {
        console.log(`CollectLogString: String is "${ String }".`);
        const ShouldAppendComma: boolean = ((): boolean =>
        {
            const IsLast: boolean = LogStrings.length === Index - 1;
            const StartBraces: Array<string> = [ "{", "[", "<" ];
            const IsOnlyStartBrace: boolean = StartBraces.includes(StripChalk(String.trim()));
            const AlreadyEndsWithComma: boolean = String[String.length - 1] === ",";

            /* eslint-disable-next-line @stylistic/max-len */
            // console.log(`CollectLogString: IsOnlyBrace is ${ IsOnlyBrace ? "true" : "false" } for LogString "${ String }"`);

            return !IsLast && !IsOnlyStartBrace && !AlreadyEndsWithComma;
        })();

        const Depth: number = InDepth - MinDepth;
        const LineEnd: string = ShouldAppendComma ? "," : "";
        console.log(`CollectLogString: Depth is ${ Depth } for String "${ String }".`);
        return Indent(Depth) + String + LineEnd;
    };

    const String: string = LogStrings.map(CollectLogString).join("\n");

    const GetNextNonWhitespaceCharacter = (In: string, InIndex: number): number | undefined =>
    {
        for (let Index: number = InIndex + 1; Index < In.length; Index++)
        {
            const Character: string = In[Index];
            const IsWhitespace = (InChar: string): boolean =>
            {
                return InChar.replace(/\s+/g, "") === "";
            };

            if (!IsWhitespace(Character))
            {
                return Index;
            }
        }

        return undefined;
    };

    const EndingBraces: Array<string> = [ "}", ">", "]" ];
    const IndicesToRemove: Array<number> = [ ];
    for (let Index: number = 0; Index < String.length; Index++)
    {
        if (String[Index] !== ",")
        {
            continue;
        }

        const NextNonWhitespaceCharacterIndex: number | undefined =
            GetNextNonWhitespaceCharacter(String, Index);

        if (NextNonWhitespaceCharacterIndex !== undefined)
        {
            const NextNonWhitespaceCharacter: string = String[NextNonWhitespaceCharacterIndex];
            if (EndingBraces.includes(NextNonWhitespaceCharacter))
            {
                IndicesToRemove.push(Index);
            }
        }
    }

    const RemoveCharactersAtIndices = (InString: string, Indices: Array<number>): string =>
    {
        if (typeof InString !== "string")
        {
            throw new TypeError("Text must be a string.");
        }

        if (!Array.isArray(Indices))
        {
            throw new TypeError("Indices must be an array of numbers.");
        }

        const TextLength: number = InString.length;

        for (const Index of Indices)
        {
            if (!Number.isInteger(Index))
            {
                throw new TypeError(`All indices must be integers. Found: ${Index}`);
            }

            if (Index < 0 || Index >= TextLength)
            {
                throw new RangeError(`Index out of range: ${Index}. Valid range is [0, ${TextLength - 1}].`);
            }
        }

        const UniqueSortedIndicesDescending: Array<number> = Array
            .from(new Set(Indices))
            .sort((Left: number, Right: number) => Right - Left);

        let Result: string = InString;

        for (const Index of UniqueSortedIndicesDescending)
        {
            Result = Result.slice(0, Index) + Result.slice(Index + 1);
        }

        return Result;
    };

    const OutString: string = RemoveCharactersAtIndices(String, IndicesToRemove);

    return {
        Depth: MinDepth,
        String: OutString
    };
};

/** Temporary helper to debug the formatter. */
const Stringify = (In: unknown, Depth: number = 1): string =>
{
    const BaseString: string = JSON.stringify(In, null, 4);
    if (Depth === 0)
    {
        return BaseString;
    }
    else
    {
        const Indent: string = " ".repeat(LogSettings.Size.TabWidth * Depth);
        const IndentedString: string = BaseString.replaceAll("\n", "\n" + Indent);
        return IndentedString;
    }
};

const FormatObject = (LogObject: TLogPrimitive<object>): FLogString =>
{
    const FormattedObject: TMaybeArray<FLogString> = FormatObjectInternal(LogObject);
    if (Array.isArray(FormattedObject))
    {
        const Out: FLogString = FormattedObject.length > 1
            ? ReduceLogStrings(FormattedObject)
            : FormattedObject[0];

        // console.log(`FormatObject: FormattedObject array had ${ FormattedObject.length } elements.`);
        // console.log(`FormatObject: LogObject is\n${ Stringify(LogObject) }`);
        // console.log(`FormatObject: typeof LogObject.Value === ${ typeof LogObject.Value }`);
        // const LogObjectValueKeys: Array<string> = LogObject.Value instanceof Map
        //     ? Array.from(LogObject.Value.keys())
        //     : Object.keys(LogObject.Value);

        // console.log(`FormatObject: LogObject's Keys are ${ JSON.stringify(LogObjectValueKeys) }`);
        // console.log(`FormatObject: Out is\n${ Stringify(Out) }`);

        return Out;
    }
    else
    {
        return FormattedObject;
    }
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
        String: StyleString(Value)
    };
};

const FormatSymbol = ({ Depth, Value }: TLogPrimitive<symbol>): FLogString =>
{
    return {
        Depth,
        String: StyleSymbol(Value)
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

export const LogFormat = (Title: string, Value: unknown): string =>
{
    const FormattedValue: string = FormatValue({ Depth: 0, Value }).String;

    const PutValueOnNewLine: boolean = (
        typeof Value === "object" && (
            FormattedValue.length <= LogSettings.Size.MaxTerminalWidth ||
            FormattedValue.includes("\n")
        )
    );

    return PutValueOnNewLine
        ? Chalk.bold(Title) + "\n" + FormattedValue
        // ? Chalk.bold(Title) + "\n" + JSON.stringify(FormattedValue)
        : `${ Chalk.bold(Title + ":") } ${ FormattedValue }`;
};
