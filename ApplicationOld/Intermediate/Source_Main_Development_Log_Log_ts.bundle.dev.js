"use strict";
exports.id = "Source_Main_Development_Log_Log_ts";
exports.ids = ["Source_Main_Development_Log_Log_ts"];
exports.modules = {

/***/ "./Source/Main/Development/DevSettings.ts"
/*!************************************************!*\
  !*** ./Source/Main/Development/DevSettings.ts ***!
  \************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/* File:      DevSettings.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetDevSettings = void 0;
const DevSettings = __importStar(__webpack_require__(/*! ../../../Configuration/Development/DevSettings.json */ "./Configuration/Development/DevSettings.json"));
const GetDevSettings = () => {
    const { $schema: _, ...Settings } = DevSettings;
    return Settings;
};
exports.GetDevSettings = GetDevSettings;


/***/ },

/***/ "./Source/Main/Development/Log/Log.ts"
/*!********************************************!*\
  !*** ./Source/Main/Development/Log/Log.ts ***!
  \********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/* File:      Log.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogFrontend = LogFrontend;
exports.GetTime = GetTime;
exports.HandleBase64Strings = HandleBase64Strings;
exports.GetLogger = GetLogger;
const LogFormat_1 = __webpack_require__(/*! ./LogFormat */ "./Source/Main/Development/Log/LogFormat.ts");
const chalk_1 = __importDefault(__webpack_require__(/*! chalk */ "./node_modules/chalk/source/index.js"));
const DevSettings_1 = __webpack_require__(/*! #/Development/DevSettings */ "./Source/Main/Development/DevSettings.ts");
const util_1 = __importDefault(__webpack_require__(/*! util */ "util"));
chalk_1.default.level = 3;
const LogSettings = (0, DevSettings_1.GetDevSettings)().Log;
function FormatCategory(Category) {
    const HashStringToBackgroundColor = (Input) => {
        let HashValue = 2166136261;
        for (let Index = 0; Index < Input.length; Index++) {
            HashValue ^= Input.charCodeAt(Index);
            HashValue = Math.imul(HashValue, 16777619);
        }
        HashValue >>>= 0;
        const Hue = HashValue % 360;
        const Saturation = 58 + ((HashValue >>> 8) % 23);
        let Lightness = 26 + ((HashValue >>> 16) % 12);
        let RgbColor = ConvertHslToRgb(Hue, Saturation / 100, Lightness / 100);
        const ShouldAdjustRgbColor = () => {
            return (CalculateContrastRatioWithWhite(RgbColor.Red, RgbColor.Green, RgbColor.Blue) < 4.5 &&
                Lightness > 12);
        };
        while (ShouldAdjustRgbColor()) {
            Lightness--;
            RgbColor = ConvertHslToRgb(Hue, Saturation / 100, Lightness / 100);
        }
        return ConvertRgbToHexColor(RgbColor.Red, RgbColor.Green, RgbColor.Blue);
    };
    const ConvertHslToRgb = (Hue, Saturation, Lightness) => {
        const Chroma = (1 - Math.abs(2 * Lightness - 1)) * Saturation;
        const HuePrime = Hue / 60;
        const SecondComponent = Chroma * (1 - Math.abs((HuePrime % 2) - 1));
        const MatchValue = Lightness - Chroma / 2;
        let RedPrime = 0;
        let GreenPrime = 0;
        let BluePrime = 0;
        if (HuePrime >= 0 && HuePrime < 1) {
            RedPrime = Chroma;
            GreenPrime = SecondComponent;
        }
        else if (HuePrime >= 1 && HuePrime < 2) {
            RedPrime = SecondComponent;
            GreenPrime = Chroma;
        }
        else if (HuePrime >= 2 && HuePrime < 3) {
            GreenPrime = Chroma;
            BluePrime = SecondComponent;
        }
        else if (HuePrime >= 3 && HuePrime < 4) {
            GreenPrime = SecondComponent;
            BluePrime = Chroma;
        }
        else if (HuePrime >= 4 && HuePrime < 5) {
            RedPrime = SecondComponent;
            BluePrime = Chroma;
        }
        else {
            RedPrime = Chroma;
            BluePrime = SecondComponent;
        }
        return {
            Blue: Math.round((BluePrime + MatchValue) * 255),
            Green: Math.round((GreenPrime + MatchValue) * 255),
            Red: Math.round((RedPrime + MatchValue) * 255)
        };
    };
    const CalculateContrastRatioWithWhite = (Red, Green, Blue) => {
        const RelativeLuminance = CalculateSrgbRelativeLuminance(Red, Green, Blue);
        return (1.0 + 0.05) / (RelativeLuminance + 0.05);
    };
    const CalculateSrgbRelativeLuminance = (Red, Green, Blue) => {
        const RedChannel = ConvertSrgbChannelToLinear(Red / 255);
        const GreenChannel = ConvertSrgbChannelToLinear(Green / 255);
        const BlueChannel = ConvertSrgbChannelToLinear(Blue / 255);
        return 0.2126 * RedChannel + 0.7152 * GreenChannel + 0.0722 * BlueChannel;
    };
    const ConvertSrgbChannelToLinear = (Channel) => {
        if (Channel <= 0.04045) {
            return Channel / 12.92;
        }
        return Math.pow((Channel + 0.055) / 1.055, 2.4);
    };
    const ConvertRgbToHexColor = (Red, Green, Blue) => {
        return ("#" +
            ConvertByteToHex(Red) +
            ConvertByteToHex(Green) +
            ConvertByteToHex(Blue));
    };
    const ConvertByteToHex = (Value) => {
        return Value.toString(16).padStart(2, "0").toUpperCase();
    };
    return chalk_1.default.hex("#FFFFFF").bgHex(HashStringToBackgroundColor(Category))(` ${Category} `);
}
;
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
function FormatLevel(Level) {
    const Colors = {
        Error: chalk_1.default.bgRedBright.whiteBright,
        Normal: chalk_1.default.bgGray,
        Verbose: chalk_1.default.bgCyan.whiteBright,
        Warn: chalk_1.default.bgYellow.whiteBright
    };
    if (typeof Colors[Level] !== "function") {
        throw new Error(`Colors[Level] is ${Level}.`);
    }
    return Colors[Level](` ${Level} `);
}
;
const DisabledCategoriesAttempted = {
    "*": [],
    Backend: [],
    Frontend: [],
    Native: []
};
function LogInternal(Origin, Category, Level, ...Arguments) {
    if (Origin !== "Meta") {
        const DisabledCategories = [
            ...LogSettings.Category.DisabledCategories[Origin],
            ...LogSettings.Category.DisabledCategories["*"]
        ];
        const ShouldLogGivenStatements = !(Category in DisabledCategories);
        if (!ShouldLogGivenStatements) {
            const IsCategoryDisabledUniversally = Category in LogSettings.Category.DisabledCategories["*"];
            const AttemptedCategories = IsCategoryDisabledUniversally
                ? [
                    ...DisabledCategoriesAttempted[Origin],
                    ...DisabledCategoriesAttempted["*"]
                ]
                : DisabledCategoriesAttempted[Origin];
            const ShouldLogDisabledCategory = (LogSettings.Category.LogDisabledCategoryAttempts &&
                !AttemptedCategories.includes(Category));
            if (ShouldLogDisabledCategory) {
                DisabledCategoriesAttempted[IsCategoryDisabledUniversally ? "*" : Origin].push(Category);
                LogInternal("Meta", "Log", "Normal", 
                /* eslint-disable-next-line @stylistic/max-len */
                `The category "${Category}" was logged about, from ${Origin} code.  Further attempts to log this category from this origin will not be reported.`);
            }
            return;
        }
    }
    const OriginEmojiMap = {
        Backend: "λ",
        Frontend: "ƒ",
        Meta: "◈",
        Native: "ϑ"
    };
    const OriginEmoji = OriginEmojiMap[Origin];
    const FormattedArguments = Arguments.map((Argument) => {
        return util_1.default.format(Argument);
    });
    const GetOutStatements = () => {
        const OutStatementsArray = [
            chalk_1.default.bgHex("#AAAAAA").white(` ${OriginEmoji} `),
            FormatLevel(Level),
            FormatCategory(Category),
            " ",
            ...FormattedArguments
        ];
        const OutStatementsBase = OutStatementsArray.join("");
        if (LogSettings.Size.LimitStatementLength.Enabled) {
            const PrefixLength = OutStatementsArray.slice(0, 4).reduce((TotalLength, Statement) => {
                return TotalLength + (Statement?.length ?? 0);
            }, 0);
            const TotalLength = PrefixLength + LogSettings.Size.LimitStatementLength.MaxLength;
            return OutStatementsBase.slice(0, TotalLength);
        }
        else {
            return OutStatementsBase;
        }
    };
    const Stream = Level === "Error"
        ? process.stderr
        : process.stdout;
    Stream.write(GetOutStatements() + "\n");
}
/** This should only be used when registering the Log event. */
function LogFrontend(Category, Level, ...Statements) {
    const Parse = (Statement) => {
        if (typeof Statement === "string") {
            try {
                const ParsedObject = JSON.parse(Statement);
                if (typeof ParsedObject === "object") {
                    return ParsedObject;
                }
                else {
                    return Statement;
                }
            }
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            catch (_Error) {
                return Statement;
            }
        }
        else {
            return Statement;
        }
    };
    const StatementsUntokenized = Statements.map(Parse).map(HandleFrontendTokens);
    LogInternal("Frontend", Category, Level, ...StatementsUntokenized);
}
;
function GetTime() {
    const Now = new Date();
    const Minutes = Now
        .getMinutes()
        .toString()
        .padStart(2, "0");
    const Seconds = Now
        .getSeconds()
        .toString()
        .padStart(2, "0");
    const Milliseconds = Now
        .getMilliseconds()
        .toString()
        .padStart(3, "0");
    return `${Minutes}:${Seconds}.${Milliseconds}`;
}
;
const FrontendTokens = {
    __GetTime__: GetTime
};
function HandleFrontendTokens(Statement) {
    const IsFrontendToken = (In) => {
        if (typeof In === "string") {
            return Object.keys(FrontendTokens).includes(In);
        }
        else {
            return false;
        }
    };
    if (IsFrontendToken(Statement)) {
        return FrontendTokens[Statement]();
    }
    else {
        return Statement;
    }
}
;
function HandleAlwaysApplyFormat(Statement, Statements) {
    if (LogSettings.Format.AlwaysApplyFormat) {
        if (typeof Statement === "string" && Statements.length === 1) {
            return Statement;
        }
        else if (typeof Statement === "object") {
            return (0, LogFormat_1.Format)(Statement);
        }
        else {
            return (0, LogFormat_1.FormatInline)(Statement);
        }
    }
    else {
        return Statement;
    }
}
;
function HandleBase64Strings(Statement, _Statements) {
    if (typeof Statement === "string" && !LogSettings.Format.AlwaysApplyFormat) {
        return (0, LogFormat_1.FormatBase64String)(Statement);
    }
    else {
        return Statement;
    }
}
;
/** Use this to create a logger within a given module so that the log category is set for that module. */
function GetLogger(Category) {
    const MakeLoggerInternal = (Level) => {
        return (...Statements) => {
            const MultiMap = (InArray, ...Handlers) => {
                let Out = InArray.map((Statement) => {
                    return [Statement, Statements];
                });
                Handlers.forEach((Handler) => {
                    Out = Out.map(([Statement, Statements]) => {
                        return [Handler(Statement, Statements), Statements];
                    });
                });
                return Out.map(([Statement]) => {
                    return Statement;
                });
            };
            // const FormattedStatements: TArray<unknown> = Statements;
            const FormattedStatements = MultiMap(Statements, HandleBase64Strings, HandleAlwaysApplyFormat);
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
            const SpacedOutStatements = FormattedStatements.flatMap((Statement) => {
                return [Statement, " "];
            });
            LogInternal("Backend", Category, Level, ...SpacedOutStatements);
        };
    };
    const Logger = MakeLoggerInternal("Normal");
    Logger.Error = MakeLoggerInternal("Error");
    Logger.Verbose = MakeLoggerInternal("Verbose");
    Logger.Warn = MakeLoggerInternal("Warn");
    return Logger;
}


/***/ },

/***/ "./Source/Main/Development/Log/LogFormat.ts"
/*!**************************************************!*\
  !*** ./Source/Main/Development/Log/LogFormat.ts ***!
  \**************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/* File:      LogUtility.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FormatBase64String = exports.FormatInline = exports.Format = void 0;
const chalk_1 = __importDefault(__webpack_require__(/*! chalk */ "./node_modules/chalk/source/index.js"));
const DevSettings_1 = __webpack_require__(/*! #/Development/DevSettings */ "./Source/Main/Development/DevSettings.ts");
const Shared_1 = __webpack_require__(/*! ../../../Shared */ "./Source/Shared/index.ts");
chalk_1.default.level = 3;
const LogSettings = (0, DevSettings_1.GetDevSettings)().Log;
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
const GetWithoutAnsi = (In) => {
    /* eslint-disable-next-line @stylistic/max-len, no-control-regex */
    const AnsiEscapeSequencePattern = /[\u001B\u009B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[a-zA-Z\d]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))/g;
    return In.replace(AnsiEscapeSequencePattern, "");
};
const GetLength = (In) => {
    return GetWithoutAnsi(In).length;
};
const StyleString = (In) => {
    const Style = {
        Double: `"${In}"`,
        None: In,
        Single: `'${In}'`
    };
    const BaseString = Style[LogSettings.Format.QuoteStyle];
    return LogSettings.Format.Colors
        ? chalk_1.default.hex("#CA5010")(BaseString)
        : BaseString;
};
const StyleSymbol = (In) => {
    return LogSettings.Format.Colors
        ? chalk_1.default.hex("#00B7C3")(In.toString())
        : In.toString();
};
const StyleNumber = (In) => {
    return LogSettings.Format.Colors
        ? chalk_1.default.green(FormatDigits(In))
        : FormatDigits(In);
};
const FormatString = ({ Depth, Value }) => {
    return {
        Depth,
        String: (IsBase64String(Value) && LogSettings.Format.TruncateBase64Strings)
            ? (0, exports.FormatBase64String)(Value)
            : StyleString(Value)
    };
};
const FormatSymbol = ({ Depth, Value }) => {
    return {
        Depth,
        String: StyleSymbol(Value)
    };
};
const Inline = (In) => {
    const SearchedIndices = {
        "<": [],
        "[": [],
        "{": []
    };
    const Recurrence = (LogStrings) => {
        const GetString = (InLogString) => InLogString.String;
        const GetInnermostContainer = (InLogStrings) => {
            const Strings = InLogStrings.map(GetString);
            const StartDelimiters = ["<", "[", "{"];
            const InnermostStartIndex = Math.max(...StartDelimiters
                .map((StartDelimiter) => {
                if (SearchedIndices[StartDelimiter].includes(-1)) {
                    return -1;
                }
                const StopSearchIndex = Math.min(...SearchedIndices[StartDelimiter]);
                const Out = Strings
                    .slice(0, StopSearchIndex)
                    .lastIndexOf(StartDelimiter);
                if (Out === -1) {
                    SearchedIndices[StartDelimiter].push(-1);
                }
                return Out;
            }).flat(20));
            if (InnermostStartIndex === -1) {
                return undefined;
            }
            SearchedIndices[Strings[InnermostStartIndex]].push(InnermostStartIndex);
            const GetFirstIndexOfValueAfterIndex = (Values, TargetValue, AfterIndex) => {
                const StartIndex = Math.min(Math.max(AfterIndex + 1, 0), Values.length);
                for (let Index = StartIndex; Index < Values.length; Index++) {
                    if (Object.is(Values[Index], TargetValue)) {
                        return Index;
                    }
                }
                return undefined;
            };
            const InnermostLogString = InLogStrings[InnermostStartIndex];
            if (InnermostLogString === undefined) {
                return undefined;
            }
            const InnermostStartDelimiter = InnermostLogString.String;
            const InnermostStopDelimiter = InnermostStartDelimiter === "{"
                ? "}"
                : InnermostStartDelimiter === "<"
                    ? ">"
                    : "]";
            const InnermostStopIndex = GetFirstIndexOfValueAfterIndex(Strings, InnermostStopDelimiter, InnermostStartIndex);
            if (InnermostStopIndex === undefined) {
                return undefined;
            }
            const InnermostContainer = InLogStrings.slice(InnermostStartIndex, InnermostStopIndex + 1);
            const StopSubArray = InLogStrings.length >= InnermostStopIndex + 1
                ? InLogStrings.slice(InnermostStopIndex + 1, undefined)
                : [];
            return {
                Container: InnermostContainer,
                StartSubArray: InLogStrings.slice(0, InnermostStartIndex),
                StopSubArray
            };
        };
        const ShouldInline = (ContainerLogStrings) => {
            const TotalWidth = ContainerLogStrings[0].Depth * LogSettings.Size.TabWidth +
                ContainerLogStrings.reduce((Accumulator, CurrentValue) => {
                    return Accumulator + GetLength(CurrentValue.String);
                }, 0);
            return TotalWidth <= LogSettings.Size.MaxTerminalWidth;
        };
        const InnermostContainer = GetInnermostContainer(LogStrings);
        if (InnermostContainer !== undefined) {
            const { Container, StartSubArray, StopSubArray } = InnermostContainer;
            if (ShouldInline(InnermostContainer.Container)) {
                const Inlined = {
                    Depth: Container[0].Depth,
                    String: Container.map(GetString).join(" ")
                };
                return [...StartSubArray, Inlined, ...StopSubArray];
            }
        }
        return LogStrings;
    };
    const ShouldRecur = () => {
        return (!SearchedIndices["<"].includes(-1) ||
            !SearchedIndices["{"].includes(-1) ||
            !SearchedIndices["["].includes(-1));
    };
    let Out = [...In];
    while (ShouldRecur()) {
        Out = Recurrence([...Out]);
    }
    return Out;
};
const FormatDigits = (Value) => {
    const Separators = {
        Comma: ",",
        None: "",
        Space: " ",
        Underscore: "_"
    };
    const Separator = Separators[LogSettings.Format.DigitSeparator];
    const GroupIntegralDigits = (IntegralDigits) => {
        if (IntegralDigits.length <= 3) {
            return IntegralDigits;
        }
        const Groups = [];
        for (let Index = IntegralDigits.length; Index > 0; Index -= 3) {
            const StartIndex = Math.max(0, Index - 3);
            Groups.push(IntegralDigits.slice(StartIndex, Index));
        }
        Groups.reverse();
        return Groups.join(Separator);
    };
    const GroupFractionalDigits = (FractionalDigits) => {
        if (FractionalDigits.length <= 3) {
            return FractionalDigits;
        }
        const Groups = [];
        for (let Index = 0; Index < FractionalDigits.length; Index += 3) {
            Groups.push(FractionalDigits.slice(Index, Index + 3));
        }
        return Groups.join(Separator);
    };
    const ConvertScientificNotationToPlainDecimal = (NumberText) => {
        const ExponentMarkerIndex = NumberText.search(/[eE]/);
        if (ExponentMarkerIndex === -1) {
            return NumberText;
        }
        const MantissaText = NumberText.slice(0, ExponentMarkerIndex);
        const ExponentText = NumberText.slice(ExponentMarkerIndex + 1);
        const ExponentValue = Number(ExponentText);
        let SignText = "";
        let UnsignedMantissaText = MantissaText;
        if (UnsignedMantissaText.startsWith("-")) {
            SignText = "-";
            UnsignedMantissaText = UnsignedMantissaText.slice(1);
        }
        else if (UnsignedMantissaText.startsWith("+")) {
            UnsignedMantissaText = UnsignedMantissaText.slice(1);
        }
        const DecimalPointIndex = UnsignedMantissaText.indexOf(".");
        const DigitsOnly = UnsignedMantissaText.replace(".", "");
        const DigitsBeforeDecimal = (DecimalPointIndex === -1)
            ? DigitsOnly.length
            : DecimalPointIndex;
        const NewDecimalIndex = DigitsBeforeDecimal + ExponentValue;
        if (NewDecimalIndex <= 0) {
            const LeadingZerosCount = -NewDecimalIndex;
            return SignText + "0." + "0".repeat(LeadingZerosCount) + DigitsOnly;
        }
        if (NewDecimalIndex >= DigitsOnly.length) {
            const TrailingZerosCount = NewDecimalIndex - DigitsOnly.length;
            return SignText + DigitsOnly + "0".repeat(TrailingZerosCount);
        }
        return SignText + DigitsOnly.slice(0, NewDecimalIndex) + "." + DigitsOnly.slice(NewDecimalIndex);
    };
    if (typeof Value === "bigint") {
        const IsNegative = Value < 0n;
        const AbsoluteValue = IsNegative ? -Value : Value;
        const IntegralDigits = AbsoluteValue.toString();
        const GroupedIntegralDigits = GroupIntegralDigits(IntegralDigits);
        return (IsNegative ? "-" : "") + GroupedIntegralDigits;
    }
    if (!Number.isFinite(Value)) {
        return String(Value);
    }
    const IsNegative = Value < 0 || Object.is(Value, -0);
    const AbsoluteValue = Math.abs(Value);
    const PlainDecimalText = ConvertScientificNotationToPlainDecimal(AbsoluteValue.toString());
    const Parts = PlainDecimalText.split(".");
    const IntegralDigits = Parts[0] ?? "0";
    const FractionalDigits = Parts[1];
    const GroupedIntegralDigits = GroupIntegralDigits(IntegralDigits);
    if (FractionalDigits === undefined || FractionalDigits.length === 0) {
        return (IsNegative ? "-" : "") + GroupedIntegralDigits;
    }
    const GroupedFractionalDigits = GroupFractionalDigits(FractionalDigits);
    return (IsNegative ? "-" : "") + GroupedIntegralDigits + "." + GroupedFractionalDigits;
};
const FormatNumber = ({ Depth, Value }) => {
    return {
        Depth,
        String: StyleNumber(Value)
    };
};
const FormatNull = ({ Depth }) => {
    return [{
            Depth,
            String: LogSettings.Format.Colors ? chalk_1.default.yellow("null") : "null"
        }];
};
const FormatUndefined = ({ Depth }) => {
    return {
        Depth,
        String: LogSettings.Format.Colors ? chalk_1.default.gray("undefined") : "undefined"
    };
};
const FormatFunction = ({ Depth }) => {
    return {
        Depth,
        String: LogSettings.Format.Colors ? chalk_1.default.red("[ Function ]") : "[ Function ]"
    };
};
const FormatBoolean = ({ Depth, Value }) => {
    const StringBase = Value ? "true" : "false";
    const StyleFunction = LogSettings.Format.Colors
        ? (Value ? chalk_1.default.blue : chalk_1.default.red)
        : Shared_1.Identity;
    const String = StyleFunction(StringBase);
    return {
        Depth,
        String
    };
};
const Delimiters = {
    Array: ["[", "]"],
    KeyValuePair: ["{", "}"],
    Map: ["<", ">"],
    Record: ["{", "}"],
    Set: ["{", "}"]
};
const GetDelimiters = (Depth, ContainerType) => {
    const MakeDelimiterLogString = (String) => ({ Depth, String });
    return Delimiters[ContainerType].map(MakeDelimiterLogString);
};
const FormatArray = (LogArray) => {
    return FormatContainer("Array", LogArray);
};
const FormatMap = ({ Depth, Value }) => {
    const FormatKeyValuePair = ({ Depth, Key, Value }) => {
        const [StartDelimiterLogString, StopDelimiterLogString] = GetDelimiters(Depth, "KeyValuePair");
        const FormatMapKey = ({ Depth, Key }) => {
            const Out = FormatValue({ Depth: Depth + 1, Value: Key })[0];
            Out.String += ",";
            return Out;
        };
        const FormatMapValue = ({ Depth, Value }) => {
            return FormatValue({ Depth: Depth + 1, Value });
        };
        const KeyLogString = FormatMapKey({ Depth, Key });
        const ValueLogStrings = FormatMapValue({ Depth, Value });
        return [StartDelimiterLogString, KeyLogString, ...ValueLogStrings, StopDelimiterLogString];
    };
    const [StartDelimiterLogString, StopDelimiterLogString] = GetDelimiters(Depth, "Map");
    const GetKeyValuePairs = (InMap) => {
        const Out = [];
        InMap.forEach((Value, Key) => {
            Out.push({ Depth: Depth + 1, Key, Value: Value });
        });
        return Out;
    };
    const InnerLogStrings = GetKeyValuePairs(Value).map(FormatKeyValuePair).flat(20);
    return [StartDelimiterLogString, ...InnerLogStrings, StopDelimiterLogString];
};
const FormatRecord = ({ Depth, Value }) => {
    const [StartDelimiterLogString, StopDelimiterLogString] = GetDelimiters(Depth, "Record");
    const GetKeyValuePairs = (InRecord) => {
        const Out = [];
        Object.keys(InRecord).forEach((Key) => {
            Out.push({ Depth, Key, Value: InRecord[Key] });
        });
        return Out;
    };
    const KeyValuePairs = GetKeyValuePairs(Value);
    const FormatKeyValuePair = ({ Depth, Key, Value }, Index) => {
        // const [ StartDelimiterLogString, StopDelimiterLogString ] = GetDelimiters(Depth, "Record");
        const FormatRecordKey = ({ Depth, Key }) => {
            const Out = FormatValue({ Depth: Depth + 1, Value: Key })[0];
            Out.String += ":";
            return Out;
        };
        const FormatRecordValue = ({ Depth, Value }) => {
            const Out = FormatValue({ Depth: Depth + 1, Value });
            if (Index !== KeyValuePairs.length - 1) {
                const Last = Out.at(-1);
                if (Last !== undefined) {
                    Last.String += ",";
                }
            }
            return Out;
        };
        const KeyLogString = FormatRecordKey({ Depth, Key });
        const ValueLogStrings = FormatRecordValue({ Depth, Value });
        if (ValueLogStrings.length === 1) {
            const Out = {
                Depth: Depth + 1,
                String: KeyLogString.String + " " + ValueLogStrings[0].String
            };
            return [Out];
        }
        else {
            return [KeyLogString, ...ValueLogStrings];
        }
    };
    const InnerLogStrings = KeyValuePairs.map(FormatKeyValuePair).flat(20);
    return [StartDelimiterLogString, ...InnerLogStrings, StopDelimiterLogString];
};
const FormatContainer = (ContainerType, { Depth, Value }) => {
    const [StartDelimiterLogString, StopDelimiterLogString] = GetDelimiters(Depth, ContainerType);
    const MakeLogValue = (In) => ({ Depth: Depth + 1, Value: In });
    const ValueArray = Array.isArray(Value)
        ? Value
        : Array.from(Value);
    const AppendComma = ({ Depth, String }, Index) => {
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
    const InnerLogStrings = ValueArray.map(MakeLogValue).map(FormatValue).flat(20).map(AppendComma);
    if (InnerLogStrings.length === 0) {
        return [{
                Depth,
                String: StartDelimiterLogString.String + " " + StopDelimiterLogString.String
            }];
    }
    else {
        return [StartDelimiterLogString, ...InnerLogStrings, StopDelimiterLogString];
    }
};
const FormatSet = (LogSet) => {
    return FormatContainer("Set", LogSet);
};
const FormatObject = ({ Depth, Value }) => {
    let Formatter = FormatRecord;
    if (Value instanceof Map) {
        Formatter = FormatMap;
    }
    else if (Value instanceof Set) {
        Formatter = FormatSet;
    }
    else if (Array.isArray(Value)) {
        Formatter = FormatArray;
    }
    else if (Value === null) {
        Formatter = FormatNull;
    }
    return Formatter({ Depth, Value });
};
const FormatValue = ({ Depth, Value }) => {
    const Formatters = {
        bigint: FormatNumber,
        boolean: FormatBoolean,
        function: FormatFunction,
        number: FormatNumber,
        object: FormatObject,
        string: FormatString,
        symbol: FormatSymbol,
        undefined: FormatUndefined
    };
    const Values = Formatters[typeof Value]({ Depth, Value });
    return Array.isArray(Values)
        ? Values
        : [Values];
};
const Format = (Value) => {
    const InlinedArray = Inline(FormatValue({ Depth: 0, Value }));
    const Out = InlinedArray
        .map(({ Depth, String }, Index) => {
        const StopDelimiters = [">", "]", "}"];
        const StartDelimiters = ["<", "[", "{"];
        const Character = GetWithoutAnsi(String)[GetWithoutAnsi(String).length - 1] || "";
        if (StopDelimiters.includes(Character)) {
            if (Index !== InlinedArray.length - 1) {
                const Next = InlinedArray[Index + 1];
                if (Next !== undefined) {
                    const NextStringStart = Next.String[0];
                    if (NextStringStart !== undefined) {
                        if (StartDelimiters.includes(NextStringStart)) {
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
exports.Format = Format;
const FormatInline = (Value) => {
    return (0, exports.Format)(Value).replaceAll("\n", " ");
};
exports.FormatInline = FormatInline;
const IsBase64String = (In) => {
    // const NormalizedInput: string = In.replace(/\s+/g, "");
    // if (NormalizedInput.length === 0 || NormalizedInput.length % 4 !== 0)
    // {
    //     return false;
    // }
    // return /^[A-Za-z0-9+/]*={0,2}$/.test(NormalizedInput);
    return (In.startsWith("data:") &&
        In.includes(";") &&
        In.length > 20);
};
const FormatBase64String = (In) => {
    if (!LogSettings.Format.TruncateBase64Strings) {
        return In;
    }
    if (IsBase64String(In)) {
        return chalk_1.default.gray(`[ Base64 (${In.slice("data:".length).split(";")[0]}) ]`);
    }
    else {
        return In;
    }
};
exports.FormatBase64String = FormatBase64String;


/***/ },

/***/ "./Source/Renderer/Log.ts"
/*!********************************!*\
  !*** ./Source/Renderer/Log.ts ***!
  \********************************/
(__unused_webpack_module, exports, __webpack_require__) {


/* File:      Log.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetLogger = exports.GetTime = void 0;
const Log_1 = __webpack_require__(/*! ../Shared/Log */ "./Source/Shared/Log.ts");
const GetTime = () => {
    return Log_1.GetTimeToken;
};
exports.GetTime = GetTime;
/** Use this to create a logger within a given module so that the log category is set for that module. */
const GetLogger = (Category) => {
    const MakeLoggerInternal = (Level) => {
        return (...Statements) => {
            const FilteredStatements = Statements.map((Statement) => {
                if (typeof Statement === "object") {
                    return JSON.stringify(Statement, null, 4);
                }
                else {
                    return Statement;
                }
            });
            window.electron.ipcRenderer.Send("Log", Category, Level, ...FilteredStatements);
        };
    };
    const Logger = MakeLoggerInternal("Normal");
    Logger.Error = MakeLoggerInternal("Error");
    Logger.Verbose = MakeLoggerInternal("Verbose");
    Logger.Warn = MakeLoggerInternal("Warn");
    return Logger;
};
exports.GetLogger = GetLogger;


/***/ },

/***/ "./Source/Shared/Event/Common.Types.ts"
/*!*********************************************!*\
  !*** ./Source/Shared/Event/Common.Types.ts ***!
  \*********************************************/
(__unused_webpack_module, exports) {


/* File:      Common.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
;


/***/ },

/***/ "./Source/Shared/Event/Event.Types.ts"
/*!********************************************!*\
  !*** ./Source/Shared/Event/Event.Types.ts ***!
  \********************************************/
(__unused_webpack_module, exports) {


/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
;
;


/***/ },

/***/ "./Source/Shared/Event/Event.ts"
/*!**************************************!*\
  !*** ./Source/Shared/Event/Event.ts ***!
  \**************************************/
(__unused_webpack_module, exports) {


/* File:      Event.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MakeTagBackend = exports.MakeTagFrontend = exports.Tag = exports.GetUntagged = exports.IsTagged = void 0;
const IsTagged = (Channel) => {
    const Split = Channel.split("-");
    if (Split.length === 2) {
        const Tag = Split[0] || "";
        const ChannelName = Split[1] || "";
        return /\d/.test(Tag) && !(/\d/.test(ChannelName));
    }
    else {
        return false;
    }
};
exports.IsTagged = IsTagged;
const GetUntagged = (Channel) => {
    if (typeof Channel === "string") {
        if ((0, exports.IsTagged)(Channel)) {
            return Channel.split("-")[1] || "";
        }
        else {
            return Channel;
        }
    }
    else {
        return "";
    }
};
exports.GetUntagged = GetUntagged;
const Tag = (WindowId, Channel) => {
    return `${WindowId}-${Channel}`;
};
exports.Tag = Tag;
const MakeTagFrontend = (Id) => {
    return (Channel) => {
        if (Id === undefined) {
            return undefined;
        }
        else {
            return `${Id}-${Channel}`;
        }
    };
};
exports.MakeTagFrontend = MakeTagFrontend;
const MakeTagBackend = (Id) => {
    return (Channel) => {
        if (Id === undefined) {
            return undefined;
        }
        else {
            return `${Id}-${Channel}`;
        }
    };
};
exports.MakeTagBackend = MakeTagBackend;


/***/ },

/***/ "./Source/Shared/Event/EventBase.Types.ts"
/*!************************************************!*\
  !*** ./Source/Shared/Event/EventBase.Types.ts ***!
  \************************************************/
(__unused_webpack_module, exports) {


/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Event/EventUtility.Types.ts"
/*!***************************************************!*\
  !*** ./Source/Shared/Event/EventUtility.Types.ts ***!
  \***************************************************/
(__unused_webpack_module, exports) {


/* File:      EventUtility.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Event/Focus.Types.ts"
/*!********************************************!*\
  !*** ./Source/Shared/Event/Focus.Types.ts ***!
  \********************************************/
(__unused_webpack_module, exports) {


/* File:      Transactions.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 * Comment:   Define types used in `Event.Types.ts` that
 *            do not otherwise have a good place to go.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Event/Insert.Types.ts"
/*!*********************************************!*\
  !*** ./Source/Shared/Event/Insert.Types.ts ***!
  \*********************************************/
(__unused_webpack_module, exports) {


/* File:      InsertEvent.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Event/Move.Types.ts"
/*!*******************************************!*\
  !*** ./Source/Shared/Event/Move.Types.ts ***!
  \*******************************************/
(__unused_webpack_module, exports) {


/* File:      Move.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
;


/***/ },

/***/ "./Source/Shared/Event/Navigate.Types.ts"
/*!***********************************************!*\
  !*** ./Source/Shared/Event/Navigate.Types.ts ***!
  \***********************************************/
(__unused_webpack_module, exports) {


/* File:      Navigate.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
;


/***/ },

/***/ "./Source/Shared/Event/Settings.Types.ts"
/*!***********************************************!*\
  !*** ./Source/Shared/Event/Settings.Types.ts ***!
  \***********************************************/
(__unused_webpack_module, exports) {


/* File:      Settings.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
;


/***/ },

/***/ "./Source/Shared/Event/Tile.Types.ts"
/*!*******************************************!*\
  !*** ./Source/Shared/Event/Tile.Types.ts ***!
  \*******************************************/
(__unused_webpack_module, exports) {


/* File:      Tile.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
;


/***/ },

/***/ "./Source/Shared/Event/index.ts"
/*!**************************************!*\
  !*** ./Source/Shared/Event/index.ts ***!
  \**************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/* File:      index.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./Event */ "./Source/Shared/Event/Event.ts"), exports);
__exportStar(__webpack_require__(/*! ./Event.Types */ "./Source/Shared/Event/Event.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./EventBase.Types */ "./Source/Shared/Event/EventBase.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./EventUtility.Types */ "./Source/Shared/Event/EventUtility.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Common.Types */ "./Source/Shared/Event/Common.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Focus.Types */ "./Source/Shared/Event/Focus.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Insert.Types */ "./Source/Shared/Event/Insert.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Move.Types */ "./Source/Shared/Event/Move.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Navigate.Types */ "./Source/Shared/Event/Navigate.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Settings.Types */ "./Source/Shared/Event/Settings.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Tile.Types */ "./Source/Shared/Event/Tile.Types.ts"), exports);


/***/ },

/***/ "./Source/Shared/Keyboard.Types.ts"
/*!*****************************************!*\
  !*** ./Source/Shared/Keyboard.Types.ts ***!
  \*****************************************/
(__unused_webpack_module, exports) {


/* File:      Keyboard.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Keyboard.ts"
/*!***********************************!*\
  !*** ./Source/Shared/Keyboard.ts ***!
  \***********************************/
(__unused_webpack_module, exports) {


/* File:      Keyboard.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IsVirtualKey = exports.VirtualKeys = exports.Vk = exports.GetKeyName = exports.IsKeyId = exports.KeyIds = exports.KeyIdsById = void 0;
/* eslint-disable sort-keys */
/** Developer-friendly names of key codes. */
exports.KeyIdsById = {
    0x05: "MouseX1",
    0x06: "MouseX2",
    0x08: "Backspace",
    0x09: "Tab",
    0x0D: "Enter",
    0x10: "Shift",
    0x11: "Ctrl",
    0x12: "Alt",
    0x13: "Pause",
    0x20: "Space",
    0x21: "PgUp",
    0x22: "PgDown",
    0x23: "End",
    0x24: "Home",
    0x25: "LeftArrow",
    0x26: "UpArrow",
    0x27: "RightArrow",
    0x28: "DownArrow",
    0x2D: "Ins",
    0x2E: "Del",
    0x30: "0",
    0x31: "1",
    0x32: "2",
    0x33: "3",
    0x34: "4",
    0x35: "5",
    0x36: "6",
    0x37: "7",
    0x38: "8",
    0x39: "9",
    0x41: "A",
    0x42: "B",
    0x43: "C",
    0x44: "D",
    0x45: "E",
    0x46: "F",
    0x47: "G",
    0x48: "H",
    0x49: "I",
    0x4A: "J",
    0x4B: "K",
    0x4C: "L",
    0x4D: "M",
    0x4E: "N",
    0x4F: "O",
    0x50: "P",
    0x51: "Q",
    0x52: "R",
    0x53: "S",
    0x54: "T",
    0x55: "U",
    0x56: "V",
    0x57: "W",
    0x58: "X",
    0x59: "Y",
    0x5A: "Z",
    0x5B: "LWin",
    0x5C: "RWin",
    0x5D: "Applications",
    0x60: "Num0",
    0x61: "Num1",
    0x62: "Num2",
    0x63: "Num3",
    0x64: "Num4",
    0x65: "Num5",
    0x66: "Num6",
    0x67: "Num7",
    0x68: "Num8",
    0x69: "Num9",
    0x6A: "Multiply",
    0x6B: "Add",
    0x6D: "Subtract",
    0x6E: "NumDecimal",
    0x6F: "NumDivide",
    0x70: "F1",
    0x71: "F2",
    0x72: "F3",
    0x73: "F4",
    0x74: "F5",
    0x75: "F6",
    0x76: "F7",
    0x77: "F8",
    0x78: "F9",
    0x79: "F10",
    0x7A: "F11",
    0x7B: "F12",
    0x7C: "F13",
    0x7D: "F14",
    0x7E: "F15",
    0x7F: "F16",
    0x80: "F17",
    0x81: "F18",
    0x82: "F19",
    0x83: "F20",
    0x84: "F21",
    0x85: "F22",
    0x86: "F23",
    0x87: "F24",
    0xA0: "LShift",
    0xA1: "RShift",
    0xA2: "LCtrl",
    0xA3: "RCtrl",
    0xA4: "LAlt",
    0xA5: "RAlt",
    0xA6: "BrowserBack",
    0xA7: "BrowserForward",
    0xA8: "BrowserRefresh",
    0xA9: "BrowserStop",
    0xAA: "BrowserSearch",
    0xAB: "BrowserFavorites",
    0xAC: "BrowserStart",
    0xB0: "NextTrack",
    0xB1: "PreviousTrack",
    0xB2: "StopMedia",
    0xB3: "PlayPauseMedia",
    0xB4: "StartMail",
    0xB5: "SelectMedia",
    0xB6: "StartApplicationOne",
    0xB7: "StartApplicationTwo",
    0xBA: ";",
    0xBB: "+",
    0xBC: ",",
    0xBD: "-",
    0xBE: ".",
    0xBF: "/",
    0xC0: "`",
    0xDB: "[",
    0xDC: "\\",
    0xDD: "]",
    0xDE: "'"
};
exports.KeyIds = [
    "MouseX1",
    "MouseX2",
    "Backspace",
    "Tab",
    "Enter",
    "Shift",
    "Ctrl",
    "Alt",
    "Pause",
    "Space",
    "PgUp",
    "PgDown",
    "End",
    "Home",
    "LeftArrow",
    "UpArrow",
    "RightArrow",
    "DownArrow",
    "Ins",
    "Del",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "LWin",
    "RWin",
    "Applications",
    "Num0",
    "Num1",
    "Num2",
    "Num3",
    "Num4",
    "Num5",
    "Num6",
    "Num7",
    "Num8",
    "Num9",
    "Multiply",
    "Add",
    "Subtract",
    "NumDecimal",
    "NumDivide",
    "F1",
    "F2",
    "F3",
    "F4",
    "F5",
    "F6",
    "F7",
    "F8",
    "F9",
    "F10",
    "F11",
    "F12",
    "F13",
    "F14",
    "F15",
    "F16",
    "F17",
    "F18",
    "F19",
    "F20",
    "F21",
    "F22",
    "F23",
    "F24",
    "LShift",
    "RShift",
    "LCtrl",
    "RCtrl",
    "LAlt",
    "RAlt",
    "BrowserBack",
    "BrowserForward",
    "BrowserRefresh",
    "BrowserStop",
    "BrowserSearch",
    "BrowserFavorites",
    "BrowserStart",
    "NextTrack",
    "PreviousTrack",
    "StopMedia",
    "PlayPauseMedia",
    "StartMail",
    "SelectMedia",
    "StartApplicationOne",
    "StartApplicationTwo",
    ";",
    "+",
    ",",
    "-",
    ".",
    "/",
    "`",
    "[",
    "\\",
    "]",
    "'"
];
const IsKeyId = (In) => {
    return exports.KeyIds.includes(In);
};
exports.IsKeyId = IsKeyId;
const GetKeyName = (VkCode) => {
    return exports.KeyIdsById[VkCode];
};
exports.GetKeyName = GetKeyName;
/** Developer-friendly names of key codes. */
exports.Vk = {
    MouseX1: 0x05,
    MouseX2: 0x06,
    Backspace: 0x08,
    Tab: 0x09,
    Enter: 0x0D,
    Shift: 0x10,
    Ctrl: 0x11,
    Alt: 0x12,
    Pause: 0x13,
    Space: 0x20,
    PgUp: 0x21,
    PgDown: 0x22,
    End: 0x23,
    Home: 0x24,
    LeftArrow: 0x25,
    UpArrow: 0x26,
    RightArrow: 0x27,
    DownArrow: 0x28,
    Ins: 0x2D,
    Del: 0x2E,
    0: 0x30,
    1: 0x31,
    2: 0x32,
    3: 0x33,
    4: 0x34,
    5: 0x35,
    6: 0x36,
    7: 0x37,
    8: 0x38,
    9: 0x39,
    A: 0x41,
    B: 0x42,
    C: 0x43,
    D: 0x44,
    E: 0x45,
    F: 0x46,
    G: 0x47,
    H: 0x48,
    I: 0x49,
    J: 0x4A,
    K: 0x4B,
    L: 0x4C,
    M: 0x4D,
    N: 0x4E,
    O: 0x4F,
    P: 0x50,
    Q: 0x51,
    R: 0x52,
    S: 0x53,
    T: 0x54,
    U: 0x55,
    V: 0x56,
    W: 0x57,
    X: 0x58,
    Y: 0x59,
    Z: 0x5A,
    LWin: 0x5B,
    RWin: 0x5C,
    Applications: 0x5D,
    Num0: 0x60,
    Num1: 0x61,
    Num2: 0x62,
    Num3: 0x63,
    Num4: 0x64,
    Num5: 0x65,
    Num6: 0x66,
    Num7: 0x67,
    Num8: 0x68,
    Num9: 0x69,
    Multiply: 0x6A,
    Add: 0x6B,
    Subtract: 0x6D,
    NumDecimal: 0x6E,
    NumDivide: 0x6F,
    F1: 0x70,
    F2: 0x71,
    F3: 0x72,
    F4: 0x73,
    F5: 0x74,
    F6: 0x75,
    F7: 0x76,
    F8: 0x77,
    F9: 0x78,
    F10: 0x79,
    F11: 0x7A,
    F12: 0x7B,
    F13: 0x7C,
    F14: 0x7D,
    F15: 0x7E,
    F16: 0x7F,
    F17: 0x80,
    F18: 0x81,
    F19: 0x82,
    F20: 0x83,
    F21: 0x84,
    F22: 0x85,
    F23: 0x86,
    F24: 0x87,
    LShift: 0xA0,
    RShift: 0xA1,
    LCtrl: 0xA2,
    RCtrl: 0xA3,
    LAlt: 0xA4,
    RAlt: 0xA5,
    BrowserBack: 0xA6,
    BrowserForward: 0xA7,
    BrowserRefresh: 0xA8,
    BrowserStop: 0xA9,
    BrowserSearch: 0xAA,
    BrowserFavorites: 0xAB,
    BrowserStart: 0xAC,
    NextTrack: 0xB0,
    PreviousTrack: 0xB1,
    StopMedia: 0xB2,
    PlayPauseMedia: 0xB3,
    StartMail: 0xB4,
    SelectMedia: 0xB5,
    StartApplicationOne: 0xB6,
    StartApplicationTwo: 0xB7,
    ";": 0xBA,
    "+": 0xBB,
    ",": 0xBC,
    "-": 0xBD,
    ".": 0xBE,
    "/": 0xBF,
    "`": 0xC0,
    "[": 0xDB,
    "\\": 0xDC,
    "]": 0xDD,
    "'": 0xDE
};
exports.VirtualKeys = [
    0x05,
    0x06,
    0x08,
    0x09,
    0x0D,
    0x10,
    0x11,
    0x12,
    0x13,
    0x20,
    0x21,
    0x22,
    0x23,
    0x24,
    0x25,
    0x26,
    0x27,
    0x28,
    0x2D,
    0x2E,
    0x30,
    0x31,
    0x32,
    0x33,
    0x34,
    0x35,
    0x36,
    0x37,
    0x38,
    0x39,
    0x41,
    0x42,
    0x43,
    0x44,
    0x45,
    0x46,
    0x47,
    0x48,
    0x49,
    0x4A,
    0x4B,
    0x4C,
    0x4D,
    0x4E,
    0x4F,
    0x50,
    0x51,
    0x52,
    0x53,
    0x54,
    0x55,
    0x56,
    0x57,
    0x58,
    0x59,
    0x5A,
    0x5B,
    0x5C,
    0x5D,
    0x60,
    0x61,
    0x62,
    0x63,
    0x64,
    0x65,
    0x66,
    0x67,
    0x68,
    0x69,
    0x6A,
    0x6B,
    0x6D,
    0x6E,
    0x6F,
    0x70,
    0x71,
    0x72,
    0x73,
    0x74,
    0x75,
    0x76,
    0x77,
    0x78,
    0x79,
    0x7A,
    0x7B,
    0x7C,
    0x7D,
    0x7E,
    0x7F,
    0x80,
    0x81,
    0x82,
    0x83,
    0x84,
    0x85,
    0x86,
    0x87,
    0xA0,
    0xA1,
    0xA2,
    0xA3,
    0xA4,
    0xA5,
    0xA6,
    0xA7,
    0xA8,
    0xA9,
    0xAA,
    0xAB,
    0xAC,
    0xB0,
    0xB1,
    0xB2,
    0xB3,
    0xB4,
    0xB5,
    0xB6,
    0xB7,
    0xBA,
    0xBB,
    0xBC,
    0xBD,
    0xBE,
    0xBF,
    0xC0,
    0xDB,
    0xDC,
    0xDD,
    0xDE
];
/* eslint-enable sort-keys */
/** Is the `KeyCode` a VK Code **that this app uses?** */
const IsVirtualKey = (KeyCode) => {
    return exports.VirtualKeys.includes(KeyCode);
};
exports.IsVirtualKey = IsVirtualKey;


/***/ },

/***/ "./Source/Shared/Log.Types.ts"
/*!************************************!*\
  !*** ./Source/Shared/Log.Types.ts ***!
  \************************************/
(__unused_webpack_module, exports) {


/* File:      Log.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Log.ts"
/*!******************************!*\
  !*** ./Source/Shared/Log.ts ***!
  \******************************/
(__unused_webpack_module, exports) {


/* File:      Log.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetTimeToken = void 0;
exports.GetTimeToken = "__GetTime__";


/***/ },

/***/ "./Source/Shared/Settings/Keybind.Types.ts"
/*!*************************************************!*\
  !*** ./Source/Shared/Settings/Keybind.Types.ts ***!
  \*************************************************/
(__unused_webpack_module, exports) {


/* File:      Keybind.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Settings/Keybind.ts"
/*!*******************************************!*\
  !*** ./Source/Shared/Settings/Keybind.ts ***!
  \*******************************************/
(__unused_webpack_module, exports) {


/* File:      Keybind.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActionKeys = exports.Keys = void 0;
const WindowsLogo = "\uE782";
const GlobeSymbol = "\uE774";
const NumModifier = "NUM";
const ShiftSymbol = "\uE752";
exports.Keys = {
    0x05: {
        Display: "\uE962",
        Modifier: "1",
        Side: undefined
    },
    0x06: {
        Display: "\uE962",
        Modifier: "2",
        Side: undefined
    },
    0x08: {
        Display: "\uE750",
        Modifier: undefined,
        Side: undefined
    },
    0x09: {
        Display: "\uE7FD",
        Modifier: undefined,
        Side: undefined
    },
    0x0D: {
        Display: "\uE751",
        Modifier: undefined,
        Side: undefined
    },
    0x10: {
        Display: "\uE752",
        Modifier: undefined,
        Side: "Either"
    },
    0x11: {
        Display: "CTRL",
        Modifier: undefined,
        Side: "Either"
    },
    0x12: {
        Display: "ALT",
        Modifier: undefined,
        Side: "Either"
    },
    0x13: {
        Display: "\uE81A",
        Modifier: undefined,
        Side: undefined
    },
    0x20: {
        Display: "\uE75D",
        Modifier: undefined,
        Side: undefined
    },
    0x21: {
        Display: "PgUp",
        Modifier: undefined,
        Side: undefined
    },
    0x22: {
        Display: "PgDown",
        Modifier: undefined,
        Side: undefined
    },
    0x23: {
        Display: "End",
        Modifier: undefined,
        Side: undefined
    },
    0x24: {
        Display: "Home",
        Modifier: undefined,
        Side: undefined
    },
    0x25: {
        Display: "LeftArrow",
        Modifier: undefined,
        Side: undefined
    },
    0x26: {
        Display: "UpArrow",
        Modifier: undefined,
        Side: undefined
    },
    0x27: {
        Display: "RightArrow",
        Modifier: undefined,
        Side: undefined
    },
    0x28: {
        Display: "DownArrow",
        Modifier: undefined,
        Side: undefined
    },
    0x2D: {
        Display: "Ins",
        Modifier: undefined,
        Side: undefined
    },
    0x2E: {
        Display: "Del",
        Modifier: undefined,
        Side: undefined
    },
    0x30: {
        Display: "0",
        Modifier: undefined,
        Side: undefined
    },
    0x31: {
        Display: "1",
        Modifier: undefined,
        Side: undefined
    },
    0x32: {
        Display: "2",
        Modifier: undefined,
        Side: undefined
    },
    0x33: {
        Display: "3",
        Modifier: undefined,
        Side: undefined
    },
    0x34: {
        Display: "4",
        Modifier: undefined,
        Side: undefined
    },
    0x35: {
        Display: "5",
        Modifier: undefined,
        Side: undefined
    },
    0x36: {
        Display: "6",
        Modifier: undefined,
        Side: undefined
    },
    0x37: {
        Display: "7",
        Modifier: undefined,
        Side: undefined
    },
    0x38: {
        Display: "8",
        Modifier: undefined,
        Side: undefined
    },
    0x39: {
        Display: "9",
        Modifier: undefined,
        Side: undefined
    },
    0x41: {
        Display: "A",
        Modifier: undefined,
        Side: undefined
    },
    0x42: {
        Display: "B",
        Modifier: undefined,
        Side: undefined
    },
    0x43: {
        Display: "C",
        Modifier: undefined,
        Side: undefined
    },
    0x44: {
        Display: "D",
        Modifier: undefined,
        Side: undefined
    },
    0x45: {
        Display: "E",
        Modifier: undefined,
        Side: undefined
    },
    0x46: {
        Display: "F",
        Modifier: undefined,
        Side: undefined
    },
    0x47: {
        Display: "G",
        Modifier: undefined,
        Side: undefined
    },
    0x48: {
        Display: "H",
        Modifier: undefined,
        Side: undefined
    },
    0x49: {
        Display: "I",
        Modifier: undefined,
        Side: undefined
    },
    0x4A: {
        Display: "J",
        Modifier: undefined,
        Side: undefined
    },
    0x4B: {
        Display: "K",
        Modifier: undefined,
        Side: undefined
    },
    0x4C: {
        Display: "L",
        Modifier: undefined,
        Side: undefined
    },
    0x4D: {
        Display: "M",
        Modifier: undefined,
        Side: undefined
    },
    0x4E: {
        Display: "N",
        Modifier: undefined,
        Side: undefined
    },
    0x4F: {
        Display: "O",
        Modifier: undefined,
        Side: undefined
    },
    0x50: {
        Display: "P",
        Modifier: undefined,
        Side: undefined
    },
    0x51: {
        Display: "Q",
        Modifier: undefined,
        Side: undefined
    },
    0x52: {
        Display: "R",
        Modifier: undefined,
        Side: undefined
    },
    0x53: {
        Display: "S",
        Modifier: undefined,
        Side: undefined
    },
    0x54: {
        Display: "T",
        Modifier: undefined,
        Side: undefined
    },
    0x55: {
        Display: "U",
        Modifier: undefined,
        Side: undefined
    },
    0x56: {
        Display: "V",
        Modifier: undefined,
        Side: undefined
    },
    0x57: {
        Display: "W",
        Modifier: undefined,
        Side: undefined
    },
    0x58: {
        Display: "X",
        Modifier: undefined,
        Side: undefined
    },
    0x59: {
        Display: "Y",
        Modifier: undefined,
        Side: undefined
    },
    0x5A: {
        Display: "Z",
        Modifier: undefined,
        Side: undefined
    },
    0x5B: {
        Display: WindowsLogo,
        Modifier: undefined,
        Side: "L"
    },
    0x5C: {
        Display: WindowsLogo,
        Modifier: undefined,
        Side: "R"
    },
    0x5D: {
        Display: "\uE700",
        Modifier: undefined,
        Side: undefined
    },
    0x60: {
        Display: "0",
        Modifier: NumModifier,
        Side: undefined
    },
    0x61: {
        Display: "1",
        Modifier: NumModifier,
        Side: undefined
    },
    0x62: {
        Display: "2",
        Modifier: NumModifier,
        Side: undefined
    },
    0x63: {
        Display: "3",
        Modifier: NumModifier,
        Side: undefined
    },
    0x64: {
        Display: "4",
        Modifier: NumModifier,
        Side: undefined
    },
    0x65: {
        Display: "5",
        Modifier: NumModifier,
        Side: undefined
    },
    0x66: {
        Display: "6",
        Modifier: NumModifier,
        Side: undefined
    },
    0x67: {
        Display: "7",
        Modifier: NumModifier,
        Side: undefined
    },
    0x68: {
        Display: "8",
        Modifier: NumModifier,
        Side: undefined
    },
    0x69: {
        Display: "9",
        Modifier: NumModifier,
        Side: undefined
    },
    0x6A: {
        Display: "×",
        Modifier: NumModifier,
        Side: undefined
    },
    0x6B: {
        Display: "+",
        Modifier: NumModifier,
        Side: undefined
    },
    0x6D: {
        Display: "-",
        Modifier: NumModifier,
        Side: undefined
    },
    0x6E: {
        Display: ".",
        Modifier: NumModifier,
        Side: undefined
    },
    0x6F: {
        Display: "/",
        Modifier: NumModifier,
        Side: undefined
    },
    0x70: {
        Display: "F1",
        Modifier: undefined,
        Side: undefined
    },
    0x71: {
        Display: "F2",
        Modifier: undefined,
        Side: undefined
    },
    0x72: {
        Display: "F3",
        Modifier: undefined,
        Side: undefined
    },
    0x73: {
        Display: "F4",
        Modifier: undefined,
        Side: undefined
    },
    0x74: {
        Display: "F5",
        Modifier: undefined,
        Side: undefined
    },
    0x75: {
        Display: "F6",
        Modifier: undefined,
        Side: undefined
    },
    0x76: {
        Display: "F7",
        Modifier: undefined,
        Side: undefined
    },
    0x77: {
        Display: "F8",
        Modifier: undefined,
        Side: undefined
    },
    0x78: {
        Display: "F9",
        Modifier: undefined,
        Side: undefined
    },
    0x79: {
        Display: "F10",
        Modifier: undefined,
        Side: undefined
    },
    0x7A: {
        Display: "F11",
        Modifier: undefined,
        Side: undefined
    },
    0x7B: {
        Display: "F12",
        Modifier: undefined,
        Side: undefined
    },
    0x7C: {
        Display: "F13",
        Modifier: undefined,
        Side: undefined
    },
    0x7D: {
        Display: "F14",
        Modifier: undefined,
        Side: undefined
    },
    0x7E: {
        Display: "F15",
        Modifier: undefined,
        Side: undefined
    },
    0x7F: {
        Display: "F16",
        Modifier: undefined,
        Side: undefined
    },
    0x80: {
        Display: "F17",
        Modifier: undefined,
        Side: undefined
    },
    0x81: {
        Display: "F18",
        Modifier: undefined,
        Side: undefined
    },
    0x82: {
        Display: "F19",
        Modifier: undefined,
        Side: undefined
    },
    0x83: {
        Display: "F20",
        Modifier: undefined,
        Side: undefined
    },
    0x84: {
        Display: "F21",
        Modifier: undefined,
        Side: undefined
    },
    0x85: {
        Display: "F22",
        Modifier: undefined,
        Side: undefined
    },
    0x86: {
        Display: "F23",
        Modifier: undefined,
        Side: undefined
    },
    0x87: {
        Display: "F24",
        Modifier: undefined,
        Side: undefined
    },
    0xA0: {
        Display: ShiftSymbol,
        Modifier: undefined,
        Side: "L"
    },
    0xA1: {
        Display: ShiftSymbol,
        Modifier: undefined,
        Side: "R"
    },
    0xA2: {
        Display: "CTRL",
        Modifier: undefined,
        Side: "L"
    },
    0xA3: {
        Display: "CTRL",
        Modifier: undefined,
        Side: "R"
    },
    0xA4: {
        Display: "ALT",
        Modifier: undefined,
        Side: "L"
    },
    0xA5: {
        Display: "ALT",
        Modifier: undefined,
        Side: "R"
    },
    0xA6: {
        Display: "&#E72B",
        Modifier: GlobeSymbol,
        Side: undefined
    },
    0xA7: {
        Display: "\uE72A",
        Modifier: GlobeSymbol,
        Side: undefined
    },
    0xA8: {
        Display: "\uE72C",
        Modifier: GlobeSymbol,
        Side: undefined
    },
    0xA9: {
        Display: "\uE733",
        Modifier: GlobeSymbol,
        Side: undefined
    },
    0xAA: {
        Display: "\uE721",
        Modifier: GlobeSymbol,
        Side: undefined
    },
    0xAB: {
        Display: "\uE728",
        Modifier: GlobeSymbol,
        Side: undefined
    },
    0xAC: {
        /* @TODO Consider using a different icon. */
        Display: "\uF71C",
        Modifier: GlobeSymbol,
        Side: undefined
    },
    0xB0: {
        Display: "\uEB9D",
        Modifier: undefined,
        Side: undefined
    },
    0xB1: {
        Display: "\uEB9E",
        Modifier: undefined,
        Side: undefined
    },
    0xB2: {
        Display: "\uE71A",
        Modifier: undefined,
        Side: undefined
    },
    0xB3: {
        Display: "\uE768",
        Modifier: undefined,
        Side: undefined
    },
    0xB4: {
        Display: "\uE715",
        Modifier: undefined,
        Side: undefined
    },
    0xB5: {
        Display: "\uEA69",
        Modifier: undefined,
        Side: undefined
    },
    0xB6: {
        Display: "\uEB3B",
        Modifier: undefined,
        Side: undefined
    },
    0xB7: {
        Display: "\uED35",
        Modifier: undefined,
        Side: undefined
    },
    0xBA: {
        Display: ";",
        Modifier: undefined,
        Side: undefined
    },
    0xBB: {
        Display: "+",
        Modifier: undefined,
        Side: undefined
    },
    0xBC: {
        Display: ",",
        Modifier: undefined,
        Side: undefined
    },
    0xBD: {
        Display: "-",
        Modifier: undefined,
        Side: undefined
    },
    0xBE: {
        Display: ".",
        Modifier: undefined,
        Side: undefined
    },
    0xBF: {
        Display: "/",
        Modifier: undefined,
        Side: undefined
    },
    0xC0: {
        Display: "`",
        Modifier: undefined,
        Side: undefined
    },
    0xDB: {
        Display: "[",
        Modifier: undefined,
        Side: undefined
    },
    0xDC: {
        Display: "\\",
        Modifier: undefined,
        Side: undefined
    },
    0xDD: {
        Display: "]",
        Modifier: undefined,
        Side: undefined
    },
    0xDE: {
        Display: "'",
        Modifier: undefined,
        Side: undefined
    }
};
exports.ActionKeys = [
    "Activate",
    "Cancel",
    "Direction.Down",
    "Direction.Left",
    "Direction.Right",
    "Direction.Up",
    "Miscellaneous.FocusList",
    "Miscellaneous.FocusTextInput",
    "Miscellaneous.Peek",
    "Miscellaneous.Settings",
    "Primary[0]",
    "Primary[1]",
    "Primary[2]",
    "Primary[3]",
    "Secondary[0]",
    "Secondary[1]",
    "Secondary[2]",
    "Secondary[3]"
];


/***/ },

/***/ "./Source/Shared/Settings/Settings.Types.ts"
/*!**************************************************!*\
  !*** ./Source/Shared/Settings/Settings.Types.ts ***!
  \**************************************************/
(__unused_webpack_module, exports) {


/* File:      Settings.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExternalSettings = void 0;
/**
 * Some settings regard state that is outside of SorrellWm,
 * for example, for the `RunOnStartup` setting to be honored,
 * a task must be registered via the Task Scheduler.  If this
 * fails, then this external state (*i.e.*, the Task Scheduler)
 * is inconsistent with the value of the setting `RunOnStartup`
 * in SorrellWm.
 */
/* eslint-disable-next-line @typescript-eslint/typedef */
exports.ExternalSettings = ["RunOnStartup"];


/***/ },

/***/ "./Source/Shared/Settings/Settings.ts"
/*!********************************************!*\
  !*** ./Source/Shared/Settings/Settings.ts ***!
  \********************************************/
(__unused_webpack_module, exports) {


/* File:      Settings.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultSettings = void 0;
exports.DefaultSettings = {
    AnimationScalar: 1,
    Gap: 4,
    Keybinds: {
        Activate: ["F20"],
        Cancel: ["Backspace"],
        Direction: {
            /* eslint-disable sort-keys */
            Left: ["D"],
            Up: ["H"],
            Down: ["T"],
            Right: ["N"]
            /* eslint-enable sort-keys */
        },
        Miscellaneous: {
            FocusList: ["`"],
            FocusTextInput: ["Tab"],
            Peek: ["Z"],
            Settings: ["+"]
        },
        Primary: {
            0: ["F"],
            1: ["G"],
            2: ["T"],
            3: ["R"]
        },
        Secondary: {
            0: ["Ctrl", "F"],
            1: ["Ctrl", "G"],
            2: ["Ctrl", "T"],
            3: ["Ctrl", "R"]
        }
    },
    RunOnStartup: false,
    ShowUpdateNotifications: true
};


/***/ },

/***/ "./Source/Shared/Settings/index.ts"
/*!*****************************************!*\
  !*** ./Source/Shared/Settings/index.ts ***!
  \*****************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/* File:      index.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./Keybind */ "./Source/Shared/Settings/Keybind.ts"), exports);
__exportStar(__webpack_require__(/*! ./Keybind.Types */ "./Source/Shared/Settings/Keybind.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Settings */ "./Source/Shared/Settings/Settings.ts"), exports);
__exportStar(__webpack_require__(/*! ./Settings.Types */ "./Source/Shared/Settings/Settings.Types.ts"), exports);


/***/ },

/***/ "./Source/Shared/Shared.Types.ts"
/*!***************************************!*\
  !*** ./Source/Shared/Shared.Types.ts ***!
  \***************************************/
(__unused_webpack_module, exports) {


/* File:      Shared.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Store.Types.ts"
/*!**************************************!*\
  !*** ./Source/Shared/Store.Types.ts ***!
  \**************************************/
(__unused_webpack_module, exports) {


/* File:      Store.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Store.ts"
/*!********************************!*\
  !*** ./Source/Shared/Store.ts ***!
  \********************************/
(__unused_webpack_module, exports) {


/* File:      Store.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetDefaultStore = void 0;
// import { app } from "electron";
const GetDefaultStore = () => {
    return {
        // AppVersion: app.getVersion(),
        AppVersion: "@TODO",
        TimeLastCheckedUpdate: null
    };
};
exports.GetDefaultStore = GetDefaultStore;


/***/ },

/***/ "./Source/Shared/Tokens.ts"
/*!*********************************!*\
  !*** ./Source/Shared/Tokens.ts ***!
  \*********************************/
(__unused_webpack_module, exports) {


/* File:      Tokens.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 * Comment:   This hosts simple values used by `main` and the `renderer`.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Tokens = void 0;
/* eslint-disable-next-line @typescript-eslint/typedef */
exports.Tokens = {
    TitlebarHeight: 48
};


/***/ },

/***/ "./Source/Shared/Tree.Types.ts"
/*!*************************************!*\
  !*** ./Source/Shared/Tree.Types.ts ***!
  \*************************************/
(__unused_webpack_module, exports) {


/* File:      Tree.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Utility/Array.ts"
/*!****************************************!*\
  !*** ./Source/Shared/Utility/Array.ts ***!
  \****************************************/
(__unused_webpack_module, exports) {


/* File:      Array.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Utility/Functional.Types.ts"
/*!***************************************************!*\
  !*** ./Source/Shared/Utility/Functional.Types.ts ***!
  \***************************************************/
(__unused_webpack_module, exports) {


/* File:      Functional.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Utility/Utility.Types.ts"
/*!************************************************!*\
  !*** ./Source/Shared/Utility/Utility.Types.ts ***!
  \************************************************/
(__unused_webpack_module, exports) {


/* File:      Utility.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ },

/***/ "./Source/Shared/Utility/Utility.ts"
/*!******************************************!*\
  !*** ./Source/Shared/Utility/Utility.ts ***!
  \******************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/* File:      Utility.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FlatMapRecord = exports.MapRecord = exports.Identity = exports.MakeRef = exports.GetPropertyFromPath = exports.SetPropertyFromPath = exports.RetryUntilFulfilled = exports.Delay = exports.GetByKey = exports.ExtractFromRecordArray = exports.ZeroBox = exports.CallMaybeAsync = exports.GetEmptyWindow = exports.GetEmptyMonitor = void 0;
exports.IsAsyncFunction = IsAsyncFunction;
const Log_1 = __webpack_require__(/*! @/Log */ "./Source/Renderer/Log.ts");
const Log = (0, Log_1.GetLogger)("Utility");
const GetEmptyMonitor = () => {
    return {
        Handle: -1
    };
};
exports.GetEmptyMonitor = GetEmptyMonitor;
const GetEmptyWindow = () => {
    return {
        Handle: ""
    };
};
exports.GetEmptyWindow = GetEmptyWindow;
/* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, @stylistic/brace-style */
const AsyncFunction = (async function () { }).constructor;
function IsAsyncFunction(Value) {
    return typeof Value === "function" && Value.constructor === AsyncFunction;
}
const CallMaybeAsync = async (Function, ...ArgumentVector) => {
    if (IsAsyncFunction(Function)) {
        return await Function(...ArgumentVector);
    }
    else {
        return Function(...ArgumentVector);
    }
};
exports.CallMaybeAsync = CallMaybeAsync;
exports.ZeroBox = {
    Height: 0,
    Width: 0,
    X: 0,
    Y: 0
};
const ExtractFromRecordArray = (Key, InArray) => {
    return InArray.map((Record) => {
        return Record[Key];
    });
};
exports.ExtractFromRecordArray = ExtractFromRecordArray;
const GetByKey = (Key) => {
    return (Record) => {
        return Record[Key];
    };
};
exports.GetByKey = GetByKey;
const Delay = async (Duration) => {
    return new Promise((Resolve, _Reject) => {
        setTimeout(Resolve, Duration);
    });
};
exports.Delay = Delay;
const RetryUntilFulfilled = async (In, NumTries = undefined, DurationToTry = undefined) => {
    let StartTime = undefined;
    let LastCompletionTime = undefined;
    let NumAttempts = 0;
    const HasExceededLimits = () => {
        const ExceededNumAttempts = (NumTries !== undefined)
            ? NumAttempts === NumTries
            : false;
        const AreDurationVariablesInitialized = (DurationToTry !== undefined &&
            LastCompletionTime !== undefined &&
            StartTime !== undefined);
        if (StartTime !== undefined && LastCompletionTime !== undefined) {
            StartTime = LastCompletionTime;
        }
        const ExceededDurationToTry = AreDurationVariablesInitialized
            ? (LastCompletionTime - StartTime) >= DurationToTry
            : false;
        return ExceededNumAttempts || ExceededDurationToTry;
    };
    while (HasExceededLimits()) {
        try {
            const Out = await In();
            return Out;
        }
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        catch (_Error) {
            LastCompletionTime = new Date().getTime();
            if (NumTries !== undefined) {
                NumAttempts++;
            }
        }
    }
    return undefined;
};
exports.RetryUntilFulfilled = RetryUntilFulfilled;
const SetPropertyFromPath = (ObjectRef, Path, Value) => {
    if (Array.isArray(Path)) {
        throw new Error("SetPropertyFromPath does not support Array-based paths yet.");
    }
    const PathSplit = Path.split(".");
    const Last = PathSplit.pop();
    if (Last === undefined) {
        return;
    }
    if (PathSplit.length === 0) {
        if (!Array.isArray(Path)) {
            (ObjectRef.Ref[Path]) = Value;
        }
    }
    const Recurrence = (In) => {
        const NextPropertyNameBase = PathSplit.shift();
        Log("NextPropertyNameBase", NextPropertyNameBase);
        if (NextPropertyNameBase !== undefined) {
            const NextPropertyName = isNaN(parseInt(NextPropertyNameBase))
                ? NextPropertyNameBase
                : parseInt(NextPropertyNameBase);
            Log("NextPropertyName", NextPropertyName);
            const Out = (0, exports.MakeRef)();
            Out.Ref = In.Ref[NextPropertyName];
            return Recurrence(Out);
        }
        else {
            return In;
        }
    };
    const PropertyRef = Recurrence(ObjectRef);
    const LastTyped = isNaN(parseInt(Last))
        ? Last
        : parseInt(Last);
    PropertyRef.Ref[LastTyped] = Value;
};
exports.SetPropertyFromPath = SetPropertyFromPath;
const GetPropertyFromPath = (Record, Path) => {
    if (Array.isArray(Path)) {
        throw new Error("SetPropertyFromPath does not support Array-based paths yet.");
    }
    const PathSplit = Path.split(".");
    const Recurrence = (In, Index = 0) => {
        const Key = isNaN(parseInt(PathSplit[Index] || ""))
            ? PathSplit[Index]
            : parseInt(PathSplit[Index] || "");
        if (Key !== undefined) {
            const Next = In[Key];
            if (Index !== PathSplit.length - 1) {
                return Recurrence(Next, Index + 1);
            }
            else {
                return Next;
            }
        }
        else {
            return undefined;
        }
    };
    return Recurrence(Record);
};
exports.GetPropertyFromPath = GetPropertyFromPath;
const MakeRef = () => {
    return {
        Ref: undefined
    };
};
exports.MakeRef = MakeRef;
const Identity = (...Arguments) => Arguments;
exports.Identity = Identity;
const MapRecord = (In, Function) => {
    return Object.keys(In).map((InKey, Index) => {
        const Key = InKey;
        return Function(Key, In[Key], Index);
    });
};
exports.MapRecord = MapRecord;
const FlatMapRecord = (In, Function) => {
    return Object.keys(In).flatMap((InKey, Index) => {
        const Key = InKey;
        const Transform = Function(Key, In[Key], Index);
        return Array.isArray(Transform)
            ? Transform
            : [Transform];
    });
};
exports.FlatMapRecord = FlatMapRecord;


/***/ },

/***/ "./Source/Shared/Utility/index.ts"
/*!****************************************!*\
  !*** ./Source/Shared/Utility/index.ts ***!
  \****************************************/
(__unused_webpack_module, exports, __webpack_require__) {


/* File:      index.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./Array */ "./Source/Shared/Utility/Array.ts"), exports);
__exportStar(__webpack_require__(/*! ./Functional.Types */ "./Source/Shared/Utility/Functional.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Utility */ "./Source/Shared/Utility/Utility.ts"), exports);
__exportStar(__webpack_require__(/*! ./Utility.Types */ "./Source/Shared/Utility/Utility.Types.ts"), exports);


/***/ },

/***/ "./Source/Shared/index.ts"
/*!********************************!*\
  !*** ./Source/Shared/index.ts ***!
  \********************************/
(__unused_webpack_module, exports, __webpack_require__) {


/* File:      index.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./Event */ "./Source/Shared/Event/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./Keyboard */ "./Source/Shared/Keyboard.ts"), exports);
__exportStar(__webpack_require__(/*! ./Keyboard.Types */ "./Source/Shared/Keyboard.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Log.Types */ "./Source/Shared/Log.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Settings */ "./Source/Shared/Settings/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./Shared.Types */ "./Source/Shared/Shared.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Store */ "./Source/Shared/Store.ts"), exports);
__exportStar(__webpack_require__(/*! ./Store.Types */ "./Source/Shared/Store.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Tree.Types */ "./Source/Shared/Tree.Types.ts"), exports);
__exportStar(__webpack_require__(/*! ./Tokens */ "./Source/Shared/Tokens.ts"), exports);
__exportStar(__webpack_require__(/*! ./Utility */ "./Source/Shared/Utility/index.ts"), exports);


/***/ },

/***/ "./Configuration/Development/DevSettings.json"
/*!****************************************************!*\
  !*** ./Configuration/Development/DevSettings.json ***!
  \****************************************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"./DevSettings.Schema.json","Log":{"Category":{"DisabledCategories":{"*":["Event"],"Backend":[],"Frontend":[],"Native":[]},"LogDisabledCategoryAttempts":true},"Format":{"AlwaysApplyFormat":true,"Colors":true,"DigitSeparator":"Space","QuoteStyle":"Double","TruncateBase64Strings":true},"Size":{"LimitStatementLength":{"Enabled":false,"MaxLength":256},"MaxTerminalWidth":60,"TabWidth":4}},"SettingsWindow":{"ShowOnLaunch":{"Enabled":false,"Position":{"Height":920,"Width":1080,"X":-1080,"Y":-400}}},"StaticMode":{"Enabled":false,"WindowShape":{"Height":1920,"Width":1080,"X":-1080,"Y":0}},"CreateDummyWindows":{"Enabled":true,"ConfigurationPath":"./Dummy.MainMonitor.Simple.Horizontal.json"}}');

/***/ }

};
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291cmNlX01haW5fRGV2ZWxvcG1lbnRfTG9nX0xvZ190cy5idW5kbGUuZGV2LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILGlLQUFtRjtBQUc1RSxNQUFNLGNBQWMsR0FBRyxHQUFpQixFQUFFO0lBRTdDLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUcsUUFBUSxFQUFFLEdBQUcsV0FBVyxDQUFDO0lBQ2hELE9BQU8sUUFBd0IsQ0FBQztBQUNwQyxDQUFDLENBQUM7QUFKVyxzQkFBYyxrQkFJekI7Ozs7Ozs7Ozs7OztBQ2JGOzs7O0dBSUc7Ozs7O0FBd1VILGtDQXFDQztBQUVELDBCQW9CQztBQXNERCxrREFVQztBQUdELDhCQTZFQztBQXpnQkQseUdBQXVFO0FBQ3ZFLDBHQUEwQjtBQUUxQix1SEFBMkQ7QUFDM0Qsd0VBQXdCO0FBRXhCLGVBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBRWhCLE1BQU0sV0FBVyxHQUFpQixnQ0FBYyxHQUFFLENBQUMsR0FBRyxDQUFDO0FBRXZELFNBQVMsY0FBYyxDQUFDLFFBQWdCO0lBSXBDLE1BQU0sMkJBQTJCLEdBQUcsQ0FBQyxLQUFhLEVBQVUsRUFBRTtRQUUxRCxJQUFJLFNBQVMsR0FBVyxVQUFVLENBQUM7UUFFbkMsS0FBSyxJQUFJLEtBQUssR0FBVyxDQUFDLEVBQUUsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQ3pELENBQUM7WUFDRyxTQUFTLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUVELFNBQVMsTUFBTSxDQUFDLENBQUM7UUFFakIsTUFBTSxHQUFHLEdBQVcsU0FBUyxHQUFHLEdBQUcsQ0FBQztR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QUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxjQUFjO0lBQ3BCLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLFVBQVU7SUFDaEIsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsVUFBVTtJQUNoQixJQUFJLEVBQUUsWUFBWTtJQUNsQixJQUFJLEVBQUUsV0FBVztJQUNqQixJQUFJLEVBQUUsSUFBSTtJQUNWLElB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QUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLFlBQVksRUFBRSxJQUFJO0lBQ2xCLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsUUFBUSxFQUFFLElBQUk7SUFDZCxHQUFHLEVBQUUsSUFBSTtJQUNULFFBQVEsRUFBRSxJQUFJO0lBQ2QsVUFBVSxFQUFFLElBQUk7SUFDaEIsU0FBUyxFQUFFLElBQUk7SUFDZixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsRUFBRSxFQUFFLElBQUk7SUFDUixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsRUFBRSxFQUFFLElBQUk7SUFDUixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsRUFBRSxFQUFFLElBQUk7SUFDUixHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxNQUFNLEVBQUUsSUFBSTtJQUNaLE1BQU0sRUFBRSxJQUFJO0lBQ1osS0FBSyxFQUFFLElBQUk7SUFDWCxLQUFLLEVBQUUsSUFBSTtJQUNYLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixXQUFXLEVBQUUsSUFBSTtJQUNqQixjQUFjLEVBQUUsSUFBSTtJQUNwQixjQUFjLEVBQUUsSUFBSTtJQUNwQixXQUFXLEVBQUUsSUFBSTtJQUNqQixhQUFhLEVBQUUsSUFBSTtJQUNuQixnQkFBZ0IsRUFBRSxJQUFJO0lBQ3RCLFlBQVksRUFBRSxJQUFJO0lBQ2xCLFNBQVMsRUFBRSxJQUFJO0lBQ2YsYUFBYSxFQUFFLElBQUk7SUFDbkIsU0FBUyxFQUFFLElBQUk7SUFDZixjQUFjLEVBQUUsSUFBSTtJQUNwQixTQUFTLEVBQUUsSUFBSTtJQUNmLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLG1CQUFtQixFQUFFLElBQUk7SUFDekIsbUJBQW1CLEVBQUUsSUFBSTtJQUN6QixHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsSUFBSSxFQUFFLElBQUk7SUFDVixHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0NBQ0gsQ0FBQztBQUVFLG1CQUFXLEdBQ3hCO0lBQ0ksSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7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b0dBQStCO0FBQy9CLHNGQUF3QjtBQUN4QixrR0FBOEI7QUFDOUIsZ0dBQTZCO0FBQzdCLHdGQUF5QjtBQUN6QixnR0FBMEIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvTWFpbi9EZXZlbG9wbWVudC9EZXZTZXR0aW5ncy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvTWFpbi9EZXZlbG9wbWVudC9Mb2cvTG9nLnRzIiwid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9NYWluL0RldmVsb3BtZW50L0xvZy9Mb2dGb3JtYXQudHMiLCJ3ZWJwYWNrOi8vc29ycmVsbHdtLy4vU291cmNlL1JlbmRlcmVyL0xvZy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL0V2ZW50L0NvbW1vbi5UeXBlcy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL0V2ZW50L0V2ZW50LlR5cGVzLnRzIiwid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9TaGFyZWQvRXZlbnQvRXZlbnQudHMiLCJ3ZWJwYWNrOi8vc29ycmVsbHdtLy4vU291cmNlL1NoYXJlZC9FdmVudC9FdmVudEJhc2UuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vc29ycmVsbHdtLy4vU291cmNlL1NoYXJlZC9FdmVudC9FdmVudFV0aWxpdHkuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vc29ycmVsbHdtLy4vU291cmNlL1NoYXJlZC9FdmVudC9Gb2N1cy5UeXBlcy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL0V2ZW50L0luc2VydC5UeXBlcy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL0V2ZW50L01vdmUuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vc29ycmVsbHdtLy4vU291cmNlL1NoYXJlZC9FdmVudC9OYXZpZ2F0ZS5UeXBlcy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL0V2ZW50L1NldHRpbmdzLlR5cGVzLnRzIiwid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9TaGFyZWQvRXZlbnQvVGlsZS5UeXBlcy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL0V2ZW50L2luZGV4LnRzIiwid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9TaGFyZWQvS2V5Ym9hcmQuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vc29ycmVsbHdtLy4vU291cmNlL1NoYXJlZC9LZXlib2FyZC50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL0xvZy5UeXBlcy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL0xvZy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL1NldHRpbmdzL0tleWJpbmQuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vc29ycmVsbHdtLy4vU291cmNlL1NoYXJlZC9TZXR0aW5ncy9LZXliaW5kLnRzIiwid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9TaGFyZWQvU2V0dGluZ3MvU2V0dGluZ3MuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vc29ycmVsbHdtLy4vU291cmNlL1NoYXJlZC9TZXR0aW5ncy9TZXR0aW5ncy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL1NldHRpbmdzL2luZGV4LnRzIiwid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9TaGFyZWQvU2hhcmVkLlR5cGVzLnRzIiwid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9TaGFyZWQvU3RvcmUuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vc29ycmVsbHdtLy4vU291cmNlL1NoYXJlZC9TdG9yZS50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL1Rva2Vucy50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL1RyZWUuVHlwZXMudHMiLCJ3ZWJwYWNrOi8vc29ycmVsbHdtLy4vU291cmNlL1NoYXJlZC9VdGlsaXR5L0FycmF5LnRzIiwid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9TaGFyZWQvVXRpbGl0eS9GdW5jdGlvbmFsLlR5cGVzLnRzIiwid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9TaGFyZWQvVXRpbGl0eS9VdGlsaXR5LlR5cGVzLnRzIiwid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9TaGFyZWQvVXRpbGl0eS9VdGlsaXR5LnRzIiwid2VicGFjazovL3NvcnJlbGx3bS8uL1NvdXJjZS9TaGFyZWQvVXRpbGl0eS9pbmRleC50cyIsIndlYnBhY2s6Ly9zb3JyZWxsd20vLi9Tb3VyY2UvU2hhcmVkL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIEZpbGU6ICAgICAgRGV2U2V0dGluZ3MudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgKiBhcyBEZXZTZXR0aW5ncyBmcm9tIFwiLi4vLi4vLi4vQ29uZmlndXJhdGlvbi9EZXZlbG9wbWVudC9EZXZTZXR0aW5ncy5qc29uXCI7XG5pbXBvcnQgdHlwZSB7IEZEZXZTZXR0aW5ncyB9IGZyb20gXCIuL0RldlNldHRpbmdzLlR5cGVzXCI7XG5cbmV4cG9ydCBjb25zdCBHZXREZXZTZXR0aW5ncyA9ICgpOiBGRGV2U2V0dGluZ3MgPT5cbntcbiAgICBjb25zdCB7ICRzY2hlbWE6IF8sIC4uLlNldHRpbmdzIH0gPSBEZXZTZXR0aW5ncztcbiAgICByZXR1cm4gU2V0dGluZ3MgYXMgRkRldlNldHRpbmdzO1xufTtcbiIsIi8qIEZpbGU6ICAgICAgTG9nLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUge1xuICAgIEZMb2dGcm9udGVuZFRva2VucyxcbiAgICBGTG9nRnVuY3Rpb24sXG4gICAgRkxvZ1NldHRpbmdzLFxuICAgIEZMb2dnZXIsXG4gICAgRkxvZ2dlckludGVyaW0gfSBmcm9tIFwiLi4vLi4vLi4vU2hhcmVkXCI7XG5pbXBvcnQgdHlwZSB7IEZMb2dIYW5kbGVyLCBGU2hvcnRUaW1lc3RhbXAgfSBmcm9tIFwiLi9Mb2cuVHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgRkxvZ0xldmVsLCBGTG9nT3JpZ2luSW50ZXJuYWwgfSBmcm9tIFwiQHNvcnJlbGx3bS93aW5kb3dzXCI7XG5pbXBvcnQgeyBGb3JtYXQsIEZvcm1hdEJhc2U2NFN0cmluZywgRm9ybWF0SW5saW5lIH0gZnJvbSBcIi4vTG9nRm9ybWF0XCI7XG5pbXBvcnQgQ2hhbGsgZnJvbSBcImNoYWxrXCI7XG5pbXBvcnQgdHlwZSB7IEZMb2dWYWx1ZVR5cGUgfSBmcm9tIFwiLi9Mb2dGb3JtYXQuVHlwZXNcIjtcbmltcG9ydCB7IEdldERldlNldHRpbmdzIH0gZnJvbSBcIiMvRGV2ZWxvcG1lbnQvRGV2U2V0dGluZ3NcIjtcbmltcG9ydCBVdGlsIGZyb20gXCJ1dGlsXCI7XG5cbkNoYWxrLmxldmVsID0gMztcblxuY29uc3QgTG9nU2V0dGluZ3M6IEZMb2dTZXR0aW5ncyA9IEdldERldlNldHRpbmdzKCkuTG9nO1xuXG5mdW5jdGlvbiBGb3JtYXRDYXRlZ29yeShDYXRlZ29yeTogc3RyaW5nKTogc3RyaW5nXG57XG4gICAgdHlwZSBGUmdiID0gUmVjb3JkPFwiUmVkXCIgfCBcIkdyZWVuXCIgfCBcIkJsdWVcIiwgbnVtYmVyPjtcblxuICAgIGNvbnN0IEhhc2hTdHJpbmdUb0JhY2tncm91bmRDb2xvciA9IChJbnB1dDogc3RyaW5nKTogc3RyaW5nID0+XG4gICAge1xuICAgICAgICBsZXQgSGFzaFZhbHVlOiBudW1iZXIgPSAyMTY2MTM2MjYxO1xuXG4gICAgICAgIGZvciAobGV0IEluZGV4OiBudW1iZXIgPSAwOyBJbmRleCA8IElucHV0Lmxlbmd0aDsgSW5kZXgrKylcbiAgICAgICAge1xuICAgICAgICAgICAgSGFzaFZhbHVlIF49IElucHV0LmNoYXJDb2RlQXQoSW5kZXgpO1xuICAgICAgICAgICAgSGFzaFZhbHVlID0gTWF0aC5pbXVsKEhhc2hWYWx1ZSwgMTY3Nzc2MTkpO1xuICAgICAgICB9XG5cbiAgICAgICAgSGFzaFZhbHVlID4+Pj0gMDtcblxuICAgICAgICBjb25zdCBIdWU6IG51bWJlciA9IEhhc2hWYWx1ZSAlIDM2MDtcbiAgICAgICAgY29uc3QgU2F0dXJhdGlvbjogbnVtYmVyID0gNTggKyAoKEhhc2hWYWx1ZSA+Pj4gOCkgJSAyMyk7XG5cbiAgICAgICAgbGV0IExpZ2h0bmVzczogbnVtYmVyID0gMjYgKyAoKEhhc2hWYWx1ZSA+Pj4gMTYpICUgMTIpO1xuXG4gICAgICAgIGxldCBSZ2JDb2xvcjogRlJnYiA9IENvbnZlcnRIc2xUb1JnYihIdWUsIFNhdHVyYXRpb24gLyAxMDAsIExpZ2h0bmVzcyAvIDEwMCk7XG5cbiAgICAgICAgY29uc3QgU2hvdWxkQWRqdXN0UmdiQ29sb3IgPSAoKTogYm9vbGVhbiA9PlxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIENhbGN1bGF0ZUNvbnRyYXN0UmF0aW9XaXRoV2hpdGUoUmdiQ29sb3IuUmVkLCBSZ2JDb2xvci5HcmVlbiwgUmdiQ29sb3IuQmx1ZSkgPCA0LjUgJiZcbiAgICAgICAgICAgICAgICBMaWdodG5lc3MgPiAxMlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfTtcblxuICAgICAgICB3aGlsZSAoU2hvdWxkQWRqdXN0UmdiQ29sb3IoKSlcbiAgICAgICAge1xuICAgICAgICAgICAgTGlnaHRuZXNzLS07XG4gICAgICAgICAgICBSZ2JDb2xvciA9IENvbnZlcnRIc2xUb1JnYihIdWUsIFNhdHVyYXRpb24gLyAxMDAsIExpZ2h0bmVzcyAvIDEwMCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gQ29udmVydFJnYlRvSGV4Q29sb3IoUmdiQ29sb3IuUmVkLCBSZ2JDb2xvci5HcmVlbiwgUmdiQ29sb3IuQmx1ZSk7XG4gICAgfTtcblxuICAgIGNvbnN0IENvbnZlcnRIc2xUb1JnYiA9IChIdWU6IG51bWJlciwgU2F0dXJhdGlvbjogbnVtYmVyLCBMaWdodG5lc3M6IG51bWJlcik6IEZSZ2IgPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IENocm9tYTogbnVtYmVyID0gKDEgLSBNYXRoLmFicygyICogTGlnaHRuZXNzIC0gMSkpICogU2F0dXJhdGlvbjtcbiAgICAgICAgY29uc3QgSHVlUHJpbWU6IG51bWJlciA9IEh1ZSAvIDYwO1xuICAgICAgICBjb25zdCBTZWNvbmRDb21wb25lbnQ6IG51bWJlciA9IENocm9tYSAqICgxIC0gTWF0aC5hYnMoKEh1ZVByaW1lICUgMikgLSAxKSk7XG4gICAgICAgIGNvbnN0IE1hdGNoVmFsdWU6IG51bWJlciA9IExpZ2h0bmVzcyAtIENocm9tYSAvIDI7XG5cbiAgICAgICAgbGV0IFJlZFByaW1lOiBudW1iZXIgPSAwO1xuICAgICAgICBsZXQgR3JlZW5QcmltZTogbnVtYmVyID0gMDtcbiAgICAgICAgbGV0IEJsdWVQcmltZTogbnVtYmVyID0gMDtcblxuICAgICAgICBpZiAoSHVlUHJpbWUgPj0gMCAmJiBIdWVQcmltZSA8IDEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIFJlZFByaW1lID0gQ2hyb21hO1xuICAgICAgICAgICAgR3JlZW5QcmltZSA9IFNlY29uZENvbXBvbmVudDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChIdWVQcmltZSA+PSAxICYmIEh1ZVByaW1lIDwgMilcbiAgICAgICAge1xuICAgICAgICAgICAgUmVkUHJpbWUgPSBTZWNvbmRDb21wb25lbnQ7XG4gICAgICAgICAgICBHcmVlblByaW1lID0gQ2hyb21hO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKEh1ZVByaW1lID49IDIgJiYgSHVlUHJpbWUgPCAzKVxuICAgICAgICB7XG4gICAgICAgICAgICBHcmVlblByaW1lID0gQ2hyb21hO1xuICAgICAgICAgICAgQmx1ZVByaW1lID0gU2Vjb25kQ29tcG9uZW50O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKEh1ZVByaW1lID49IDMgJiYgSHVlUHJpbWUgPCA0KVxuICAgICAgICB7XG4gICAgICAgICAgICBHcmVlblByaW1lID0gU2Vjb25kQ29tcG9uZW50O1xuICAgICAgICAgICAgQmx1ZVByaW1lID0gQ2hyb21hO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKEh1ZVByaW1lID49IDQgJiYgSHVlUHJpbWUgPCA1KVxuICAgICAgICB7XG4gICAgICAgICAgICBSZWRQcmltZSA9IFNlY29uZENvbXBvbmVudDtcbiAgICAgICAgICAgIEJsdWVQcmltZSA9IENocm9tYTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIFJlZFByaW1lID0gQ2hyb21hO1xuICAgICAgICAgICAgQmx1ZVByaW1lID0gU2Vjb25kQ29tcG9uZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIEJsdWU6IE1hdGgucm91bmQoKEJsdWVQcmltZSArIE1hdGNoVmFsdWUpICogMjU1KSxcbiAgICAgICAgICAgIEdyZWVuOiBNYXRoLnJvdW5kKChHcmVlblByaW1lICsgTWF0Y2hWYWx1ZSkgKiAyNTUpLFxuICAgICAgICAgICAgUmVkOiBNYXRoLnJvdW5kKChSZWRQcmltZSArIE1hdGNoVmFsdWUpICogMjU1KVxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBjb25zdCBDYWxjdWxhdGVDb250cmFzdFJhdGlvV2l0aFdoaXRlID0gKFJlZDogbnVtYmVyLCBHcmVlbjogbnVtYmVyLCBCbHVlOiBudW1iZXIpOiBudW1iZXIgPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IFJlbGF0aXZlTHVtaW5hbmNlOiBudW1iZXIgPSBDYWxjdWxhdGVTcmdiUmVsYXRpdmVMdW1pbmFuY2UoUmVkLCBHcmVlbiwgQmx1ZSk7XG5cbiAgICAgICAgcmV0dXJuICgxLjAgKyAwLjA1KSAvIChSZWxhdGl2ZUx1bWluYW5jZSArIDAuMDUpO1xuICAgIH07XG5cbiAgICBjb25zdCBDYWxjdWxhdGVTcmdiUmVsYXRpdmVMdW1pbmFuY2UgPSAoUmVkOiBudW1iZXIsIEdyZWVuOiBudW1iZXIsIEJsdWU6IG51bWJlcik6IG51bWJlciA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgUmVkQ2hhbm5lbDogbnVtYmVyID0gQ29udmVydFNyZ2JDaGFubmVsVG9MaW5lYXIoUmVkIC8gMjU1KTtcbiAgICAgICAgY29uc3QgR3JlZW5DaGFubmVsOiBudW1iZXIgPSBDb252ZXJ0U3JnYkNoYW5uZWxUb0xpbmVhcihHcmVlbiAvIDI1NSk7XG4gICAgICAgIGNvbnN0IEJsdWVDaGFubmVsOiBudW1iZXIgPSBDb252ZXJ0U3JnYkNoYW5uZWxUb0xpbmVhcihCbHVlIC8gMjU1KTtcblxuICAgICAgICByZXR1cm4gMC4yMTI2ICogUmVkQ2hhbm5lbCArIDAuNzE1MiAqIEdyZWVuQ2hhbm5lbCArIDAuMDcyMiAqIEJsdWVDaGFubmVsO1xuICAgIH07XG5cbiAgICBjb25zdCBDb252ZXJ0U3JnYkNoYW5uZWxUb0xpbmVhciA9IChDaGFubmVsOiBudW1iZXIpOiBudW1iZXIgPT5cbiAgICB7XG4gICAgICAgIGlmIChDaGFubmVsIDw9IDAuMDQwNDUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBDaGFubmVsIC8gMTIuOTI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gTWF0aC5wb3coKENoYW5uZWwgKyAwLjA1NSkgLyAxLjA1NSwgMi40KTtcbiAgICB9O1xuXG4gICAgY29uc3QgQ29udmVydFJnYlRvSGV4Q29sb3IgPSAoUmVkOiBudW1iZXIsIEdyZWVuOiBudW1iZXIsIEJsdWU6IG51bWJlcik6IHN0cmluZyA9PlxuICAgIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIFwiI1wiICtcbiAgICAgICAgICAgIENvbnZlcnRCeXRlVG9IZXgoUmVkKSArXG4gICAgICAgICAgICBDb252ZXJ0Qnl0ZVRvSGV4KEdyZWVuKSArXG4gICAgICAgICAgICBDb252ZXJ0Qnl0ZVRvSGV4KEJsdWUpXG4gICAgICAgICk7XG4gICAgfTtcblxuICAgIGNvbnN0IENvbnZlcnRCeXRlVG9IZXggPSAoVmFsdWU6IG51bWJlcik6IHN0cmluZyA9PlxuICAgIHtcbiAgICAgICAgcmV0dXJuIFZhbHVlLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCBcIjBcIikudG9VcHBlckNhc2UoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIENoYWxrLmhleChcIiNGRkZGRkZcIikuYmdIZXgoSGFzaFN0cmluZ1RvQmFja2dyb3VuZENvbG9yKENhdGVnb3J5KSkoYCAkeyBDYXRlZ29yeSB9IGApO1xufTtcblxuLy8gY29uc3QgRm9ybWF0Q2F0ZWdvcnlCYXNpYyA9IChDYXRlZ29yeTogc3RyaW5nKTogc3RyaW5nID0+XG4vLyB7XG4vLyAgICAgY29uc3QgUGFkZGVkQ2F0ZWdvcnk6IHN0cmluZyA9IGAgJHsgQ2F0ZWdvcnkgfSBgO1xuLy8gICAgIGxldCBIYXNoVmFsdWU6IG51bWJlciA9IDA7XG4vLyAgICAgZm9yIChsZXQgSW5kZXg6IG51bWJlciA9IDA7IEluZGV4IDwgQ2F0ZWdvcnkubGVuZ3RoOyBJbmRleCsrKVxuLy8gICAgIHtcbi8vICAgICAgICAgSGFzaFZhbHVlID0gKEhhc2hWYWx1ZSA8PCA1KSAtIEhhc2hWYWx1ZSArIFBhZGRlZENhdGVnb3J5LmNoYXJDb2RlQXQoSW5kZXgpO1xuLy8gICAgICAgICBIYXNoVmFsdWUgfD0gMDtcbi8vICAgICB9XG5cbi8vICAgICBjb25zdCBCYWNrZ3JvdW5kQ29sb3JzOiBUQXJyYXk8RkNoYWxrQmFja2dyb3VuZD4gPVxuLy8gICAgIFtcbi8vICAgICAgICAgXCJiZ0JsYWNrXCIsXG4vLyAgICAgICAgIFwiYmdSZWRcIixcbi8vICAgICAgICAgXCJiZ0dyZWVuXCIsXG4vLyAgICAgICAgIFwiYmdZZWxsb3dcIixcbi8vICAgICAgICAgXCJiZ0JsdWVcIixcbi8vICAgICAgICAgXCJiZ01hZ2VudGFcIixcbi8vICAgICAgICAgXCJiZ0N5YW5cIixcbi8vICAgICAgICAgXCJiZ1doaXRlXCIsXG4vLyAgICAgICAgIFwiYmdHcmF5XCIsXG4vLyAgICAgICAgIFwiYmdHcmV5XCJcbi8vICAgICBdO1xuXG4vLyAgICAgY29uc3QgSGFzaGVkSW5kZXg6IG51bWJlciA9IE1hdGguYWJzKEhhc2hWYWx1ZSkgJSBCYWNrZ3JvdW5kQ29sb3JzLmxlbmd0aDtcblxuLy8gICAgIGNvbnN0IFNlbGVjdGVkQmFja2dyb3VuZDogRkNoYWxrQmFja2dyb3VuZCA9IEJhY2tncm91bmRDb2xvcnNbSGFzaGVkSW5kZXhdO1xuXG4vLyAgICAgY29uc3QgQnJpZ2h0QmFja2dyb3VuZHM6IFRBcnJheTxGQ2hhbGtCYWNrZ3JvdW5kPiA9XG4vLyAgICAgW1xuLy8gICAgICAgICBcImJnV2hpdGVcIixcbi8vICAgICAgICAgXCJiZ1llbGxvd1wiLFxuLy8gICAgICAgICBcImJnQ3lhblwiLFxuLy8gICAgICAgICBcImJnR3JheVwiLFxuLy8gICAgICAgICBcImJnR3JleVwiXG4vLyAgICAgXTtcblxuLy8gICAgIGNvbnN0IElzQnJpZ2h0OiBib29sZWFuID0gQnJpZ2h0QmFja2dyb3VuZHMuaW5jbHVkZXMoU2VsZWN0ZWRCYWNrZ3JvdW5kKTtcblxuLy8gICAgIGNvbnN0IEZvcmVncm91bmRDb2xvcjogRkNoYWxrRm9yZWdyb3VuZCA9IElzQnJpZ2h0ID8gXCJibGFja1wiIDogXCJ3aGl0ZUJyaWdodFwiO1xuXG4vLyAgICAgLyogQHRzLWV4cGVjdC1lcnJvciBUeXBlIHNhZmV0eSBoZWxsLCB1c2luZyB1bmlvbiB0eXBlcyB0aGF0IG1peCBmdW5jdGlvbnMgd2l0aCBvYmplY3RzLiAqL1xuLy8gICAgIHJldHVybiBDaGFsa1tTZWxlY3RlZEJhY2tncm91bmRdW0ZvcmVncm91bmRDb2xvcl0oUGFkZGVkQ2F0ZWdvcnkpO1xuLy8gfTtcblxuZnVuY3Rpb24gRm9ybWF0TGV2ZWwoTGV2ZWw6IEZMb2dMZXZlbCk6IHN0cmluZ1xue1xuICAgIGNvbnN0IENvbG9yczogUmVjb3JkPEZMb2dMZXZlbCwgKFRleHQ6IHN0cmluZykgPT4gc3RyaW5nPiA9XG4gICAge1xuICAgICAgICBFcnJvcjogQ2hhbGsuYmdSZWRCcmlnaHQud2hpdGVCcmlnaHQsXG4gICAgICAgIE5vcm1hbDogQ2hhbGsuYmdHcmF5LFxuICAgICAgICBWZXJib3NlOiBDaGFsay5iZ0N5YW4ud2hpdGVCcmlnaHQsXG4gICAgICAgIFdhcm46IENoYWxrLmJnWWVsbG93LndoaXRlQnJpZ2h0XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgQ29sb3JzW0xldmVsXSAhPT0gXCJmdW5jdGlvblwiKVxuICAgIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb2xvcnNbTGV2ZWxdIGlzICR7IExldmVsIH0uYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIENvbG9yc1tMZXZlbF0oYCAkeyBMZXZlbCB9IGApO1xufTtcblxuY29uc3QgRGlzYWJsZWRDYXRlZ29yaWVzQXR0ZW1wdGVkOiB0eXBlb2YgTG9nU2V0dGluZ3MuQ2F0ZWdvcnkuRGlzYWJsZWRDYXRlZ29yaWVzID1cbntcbiAgICBcIipcIjogWyBdLFxuICAgIEJhY2tlbmQ6IFsgXSxcbiAgICBGcm9udGVuZDogWyBdLFxuICAgIE5hdGl2ZTogWyBdXG59O1xuXG5mdW5jdGlvbiBMb2dJbnRlcm5hbChcbiAgICBPcmlnaW46IEZMb2dPcmlnaW5JbnRlcm5hbCxcbiAgICBDYXRlZ29yeTogc3RyaW5nLFxuICAgIExldmVsOiBGTG9nTGV2ZWwsXG4gICAgLi4uQXJndW1lbnRzOiBUQXJyYXk8dW5rbm93bj5cbik6IHZvaWRcbntcblxuICAgIGlmIChPcmlnaW4gIT09IFwiTWV0YVwiKVxuICAgIHtcbiAgICAgICAgY29uc3QgRGlzYWJsZWRDYXRlZ29yaWVzOiBUQXJyYXk8c3RyaW5nPiA9XG4gICAgICAgIFtcbiAgICAgICAgICAgIC4uLkxvZ1NldHRpbmdzLkNhdGVnb3J5LkRpc2FibGVkQ2F0ZWdvcmllc1tPcmlnaW5dLFxuICAgICAgICAgICAgLi4uTG9nU2V0dGluZ3MuQ2F0ZWdvcnkuRGlzYWJsZWRDYXRlZ29yaWVzW1wiKlwiXVxuICAgICAgICBdO1xuXG4gICAgICAgIGNvbnN0IFNob3VsZExvZ0dpdmVuU3RhdGVtZW50czogYm9vbGVhbiA9ICEoQ2F0ZWdvcnkgaW4gRGlzYWJsZWRDYXRlZ29yaWVzKTtcbiAgICAgICAgaWYgKCFTaG91bGRMb2dHaXZlblN0YXRlbWVudHMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IElzQ2F0ZWdvcnlEaXNhYmxlZFVuaXZlcnNhbGx5OiBib29sZWFuID1cbiAgICAgICAgICAgICAgICBDYXRlZ29yeSBpbiBMb2dTZXR0aW5ncy5DYXRlZ29yeS5EaXNhYmxlZENhdGVnb3JpZXNbXCIqXCJdO1xuXG4gICAgICAgICAgICBjb25zdCBBdHRlbXB0ZWRDYXRlZ29yaWVzOiBUQXJyYXk8c3RyaW5nPiA9IElzQ2F0ZWdvcnlEaXNhYmxlZFVuaXZlcnNhbGx5XG4gICAgICAgICAgICAgICAgPyBbXG4gICAgICAgICAgICAgICAgICAgIC4uLkRpc2FibGVkQ2F0ZWdvcmllc0F0dGVtcHRlZFtPcmlnaW5dLFxuICAgICAgICAgICAgICAgICAgICAuLi5EaXNhYmxlZENhdGVnb3JpZXNBdHRlbXB0ZWRbXCIqXCJdXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIDogRGlzYWJsZWRDYXRlZ29yaWVzQXR0ZW1wdGVkW09yaWdpbl07XG5cbiAgICAgICAgICAgIGNvbnN0IFNob3VsZExvZ0Rpc2FibGVkQ2F0ZWdvcnk6IGJvb2xlYW4gPSAoXG4gICAgICAgICAgICAgICAgTG9nU2V0dGluZ3MuQ2F0ZWdvcnkuTG9nRGlzYWJsZWRDYXRlZ29yeUF0dGVtcHRzICYmXG4gICAgICAgICAgICAgICAgIUF0dGVtcHRlZENhdGVnb3JpZXMuaW5jbHVkZXMoQ2F0ZWdvcnkpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAoU2hvdWxkTG9nRGlzYWJsZWRDYXRlZ29yeSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBEaXNhYmxlZENhdGVnb3JpZXNBdHRlbXB0ZWRbSXNDYXRlZ29yeURpc2FibGVkVW5pdmVyc2FsbHkgPyBcIipcIiA6IE9yaWdpbl0ucHVzaChDYXRlZ29yeSk7XG4gICAgICAgICAgICAgICAgTG9nSW50ZXJuYWwoXG4gICAgICAgICAgICAgICAgICAgIFwiTWV0YVwiLFxuICAgICAgICAgICAgICAgICAgICBcIkxvZ1wiLFxuICAgICAgICAgICAgICAgICAgICBcIk5vcm1hbFwiLFxuICAgICAgICAgICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHN0eWxpc3RpYy9tYXgtbGVuICovXG4gICAgICAgICAgICAgICAgICAgIGBUaGUgY2F0ZWdvcnkgXCIkeyBDYXRlZ29yeSB9XCIgd2FzIGxvZ2dlZCBhYm91dCwgZnJvbSAkeyBPcmlnaW4gfSBjb2RlLiAgRnVydGhlciBhdHRlbXB0cyB0byBsb2cgdGhpcyBjYXRlZ29yeSBmcm9tIHRoaXMgb3JpZ2luIHdpbGwgbm90IGJlIHJlcG9ydGVkLmBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBPcmlnaW5FbW9qaU1hcDogUmVjb3JkPEZMb2dPcmlnaW5JbnRlcm5hbCwgc3RyaW5nPiA9XG4gICAge1xuICAgICAgICBCYWNrZW5kOiBcIs67XCIsXG4gICAgICAgIEZyb250ZW5kOiBcIsaSXCIsXG4gICAgICAgIE1ldGE6IFwi4peIXCIsXG4gICAgICAgIE5hdGl2ZTogXCLPkVwiXG4gICAgfTtcblxuICAgIGNvbnN0IE9yaWdpbkVtb2ppOiBzdHJpbmcgPSBPcmlnaW5FbW9qaU1hcFtPcmlnaW5dO1xuXG4gICAgY29uc3QgRm9ybWF0dGVkQXJndW1lbnRzOiBUQXJyYXk8c3RyaW5nPiA9IEFyZ3VtZW50cy5tYXAoKEFyZ3VtZW50OiB1bmtub3duKTogc3RyaW5nID0+XG4gICAge1xuICAgICAgICByZXR1cm4gVXRpbC5mb3JtYXQoQXJndW1lbnQpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgR2V0T3V0U3RhdGVtZW50cyA9ICgpOiBzdHJpbmcgPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IE91dFN0YXRlbWVudHNBcnJheTogVEFycmF5PHN0cmluZz4gPVxuICAgICAgICBbXG4gICAgICAgICAgICBDaGFsay5iZ0hleChcIiNBQUFBQUFcIikud2hpdGUoYCAkeyBPcmlnaW5FbW9qaSB9IGApLFxuICAgICAgICAgICAgRm9ybWF0TGV2ZWwoTGV2ZWwpLFxuICAgICAgICAgICAgRm9ybWF0Q2F0ZWdvcnkoQ2F0ZWdvcnkpLFxuICAgICAgICAgICAgXCIgXCIsXG4gICAgICAgICAgICAuLi5Gb3JtYXR0ZWRBcmd1bWVudHNcbiAgICAgICAgXTtcblxuICAgICAgICBjb25zdCBPdXRTdGF0ZW1lbnRzQmFzZTogc3RyaW5nID0gT3V0U3RhdGVtZW50c0FycmF5LmpvaW4oXCJcIik7XG5cbiAgICAgICAgaWYgKExvZ1NldHRpbmdzLlNpemUuTGltaXRTdGF0ZW1lbnRMZW5ndGguRW5hYmxlZClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgUHJlZml4TGVuZ3RoOiBudW1iZXIgPSBPdXRTdGF0ZW1lbnRzQXJyYXkuc2xpY2UoMCwgNCkucmVkdWNlKFxuICAgICAgICAgICAgICAgIChUb3RhbExlbmd0aDogbnVtYmVyLCBTdGF0ZW1lbnQ6IHN0cmluZyk6IG51bWJlciA9PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFRvdGFsTGVuZ3RoICsgKFN0YXRlbWVudD8ubGVuZ3RoID8/IDApO1xuICAgICAgICAgICAgICAgIH0sIDApO1xuXG4gICAgICAgICAgICBjb25zdCBUb3RhbExlbmd0aDogbnVtYmVyID0gUHJlZml4TGVuZ3RoICsgTG9nU2V0dGluZ3MuU2l6ZS5MaW1pdFN0YXRlbWVudExlbmd0aC5NYXhMZW5ndGg7XG5cbiAgICAgICAgICAgIHJldHVybiBPdXRTdGF0ZW1lbnRzQmFzZS5zbGljZSgwLCBUb3RhbExlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gT3V0U3RhdGVtZW50c0Jhc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgU3RyZWFtOiBOb2RlSlMuV3JpdGVTdHJlYW0gPSBMZXZlbCA9PT0gXCJFcnJvclwiXG4gICAgICAgID8gcHJvY2Vzcy5zdGRlcnJcbiAgICAgICAgOiBwcm9jZXNzLnN0ZG91dDtcblxuICAgIFN0cmVhbS53cml0ZShHZXRPdXRTdGF0ZW1lbnRzKCkgKyBcIlxcblwiKTtcbn1cblxuLyoqIFRoaXMgc2hvdWxkIG9ubHkgYmUgdXNlZCB3aGVuIHJlZ2lzdGVyaW5nIHRoZSBMb2cgZXZlbnQuICovXG5leHBvcnQgZnVuY3Rpb24gTG9nRnJvbnRlbmQoXG4gICAgQ2F0ZWdvcnk6IHN0cmluZyxcbiAgICBMZXZlbDogRkxvZ0xldmVsLFxuICAgIC4uLlN0YXRlbWVudHM6IFRBcnJheTx1bmtub3duPlxuKTogdm9pZFxue1xuICAgIGNvbnN0IFBhcnNlID0gKFN0YXRlbWVudDogdW5rbm93bik6IHVua25vd24gPT5cbiAgICB7XG4gICAgICAgIGlmICh0eXBlb2YgU3RhdGVtZW50ID09PSBcInN0cmluZ1wiKVxuICAgICAgICB7XG4gICAgICAgICAgICB0cnlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBQYXJzZWRPYmplY3Q6IHVua25vd24gPSBKU09OLnBhcnNlKFN0YXRlbWVudCk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBQYXJzZWRPYmplY3QgPT09IFwib2JqZWN0XCIpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUGFyc2VkT2JqZWN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gU3RhdGVtZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnMgKi9cbiAgICAgICAgICAgIGNhdGNoIChfRXJyb3I6IHVua25vd24pXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0YXRlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBTdGF0ZW1lbnQ7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgU3RhdGVtZW50c1VudG9rZW5pemVkOiBUQXJyYXk8dW5rbm93bj4gPSBTdGF0ZW1lbnRzLm1hcChQYXJzZSkubWFwKEhhbmRsZUZyb250ZW5kVG9rZW5zKTtcblxuICAgIExvZ0ludGVybmFsKFwiRnJvbnRlbmRcIiwgQ2F0ZWdvcnksIExldmVsLCAuLi5TdGF0ZW1lbnRzVW50b2tlbml6ZWQpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIEdldFRpbWUoKTogRlNob3J0VGltZXN0YW1wXG57XG4gICAgY29uc3QgTm93OiBEYXRlID0gbmV3IERhdGUoKTtcblxuICAgIGNvbnN0IE1pbnV0ZXM6IHN0cmluZyA9IE5vd1xuICAgICAgICAuZ2V0TWludXRlcygpXG4gICAgICAgIC50b1N0cmluZygpXG4gICAgICAgIC5wYWRTdGFydCgyLCBcIjBcIik7XG5cbiAgICBjb25zdCBTZWNvbmRzOiBzdHJpbmcgPSBOb3dcbiAgICAgICAgLmdldFNlY29uZHMoKVxuICAgICAgICAudG9TdHJpbmcoKVxuICAgICAgICAucGFkU3RhcnQoMiwgXCIwXCIpO1xuXG4gICAgY29uc3QgTWlsbGlzZWNvbmRzOiBzdHJpbmcgPSBOb3dcbiAgICAgICAgLmdldE1pbGxpc2Vjb25kcygpXG4gICAgICAgIC50b1N0cmluZygpXG4gICAgICAgIC5wYWRTdGFydCgzLCBcIjBcIik7XG5cbiAgICByZXR1cm4gYCR7IE1pbnV0ZXMgfTokeyBTZWNvbmRzIH0uJHsgTWlsbGlzZWNvbmRzIH1gO1xufTtcblxuY29uc3QgRnJvbnRlbmRUb2tlbnM6IFJlYWRvbmx5PFJlY29yZDxGTG9nRnJvbnRlbmRUb2tlbnMsICgpID0+IHN0cmluZz4+ID1cbntcbiAgICBfX0dldFRpbWVfXzogR2V0VGltZVxufSBhcyBjb25zdDtcblxuZnVuY3Rpb24gSGFuZGxlRnJvbnRlbmRUb2tlbnMoU3RhdGVtZW50OiB1bmtub3duKTogdW5rbm93blxue1xuICAgIGNvbnN0IElzRnJvbnRlbmRUb2tlbiA9IChJbjogdW5rbm93bik6IEluIGlzIEZMb2dGcm9udGVuZFRva2VucyA9PlxuICAgIHtcbiAgICAgICAgaWYgKHR5cGVvZiBJbiA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKEZyb250ZW5kVG9rZW5zKS5pbmNsdWRlcyhJbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKElzRnJvbnRlbmRUb2tlbihTdGF0ZW1lbnQpKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIEZyb250ZW5kVG9rZW5zW1N0YXRlbWVudF0oKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgcmV0dXJuIFN0YXRlbWVudDtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBIYW5kbGVBbHdheXNBcHBseUZvcm1hdChTdGF0ZW1lbnQ6IHVua25vd24sIFN0YXRlbWVudHM6IFRBcnJheTx1bmtub3duPik6IHVua25vd25cbntcbiAgICBpZiAoTG9nU2V0dGluZ3MuRm9ybWF0LkFsd2F5c0FwcGx5Rm9ybWF0KVxuICAgIHtcbiAgICAgICAgaWYgKHR5cGVvZiBTdGF0ZW1lbnQgPT09IFwic3RyaW5nXCIgJiYgU3RhdGVtZW50cy5sZW5ndGggPT09IDEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBTdGF0ZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIFN0YXRlbWVudCA9PT0gXCJvYmplY3RcIilcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIEZvcm1hdChTdGF0ZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIEZvcm1hdElubGluZShTdGF0ZW1lbnQgYXMgRkxvZ1ZhbHVlVHlwZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgcmV0dXJuIFN0YXRlbWVudDtcbiAgICB9XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gSGFuZGxlQmFzZTY0U3RyaW5ncyhTdGF0ZW1lbnQ6IHVua25vd24sIF9TdGF0ZW1lbnRzOiBUQXJyYXk8dW5rbm93bj4pOiB1bmtub3duXG57XG4gICAgaWYgKHR5cGVvZiBTdGF0ZW1lbnQgPT09IFwic3RyaW5nXCIgJiYgIUxvZ1NldHRpbmdzLkZvcm1hdC5BbHdheXNBcHBseUZvcm1hdClcbiAgICB7XG4gICAgICAgIHJldHVybiBGb3JtYXRCYXNlNjRTdHJpbmcoU3RhdGVtZW50KTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgcmV0dXJuIFN0YXRlbWVudDtcbiAgICB9XG59O1xuXG4vKiogVXNlIHRoaXMgdG8gY3JlYXRlIGEgbG9nZ2VyIHdpdGhpbiBhIGdpdmVuIG1vZHVsZSBzbyB0aGF0IHRoZSBsb2cgY2F0ZWdvcnkgaXMgc2V0IGZvciB0aGF0IG1vZHVsZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBHZXRMb2dnZXIoQ2F0ZWdvcnk6IHN0cmluZyk6IEZMb2dnZXJcbntcbiAgICBjb25zdCBNYWtlTG9nZ2VySW50ZXJuYWwgPSAoTGV2ZWw6IEZMb2dMZXZlbCk6IEZMb2dGdW5jdGlvbiA9PlxuICAgIHtcbiAgICAgICAgcmV0dXJuICguLi5TdGF0ZW1lbnRzOiBUQXJyYXk8dW5rbm93bj4pOiB2b2lkID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIGNvbnN0IElzU2ltcGxlOiBib29sZWFuID0gU3RhdGVtZW50cy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIFN0YXRlbWVudHNbMV0gPT09IFwic3RyaW5nXCI7XG4gICAgICAgICAgICB0eXBlIEZTdGF0ZW1lbnRUdXBsZSA9IFsgdW5rbm93biwgVEFycmF5PHVua25vd24+IF07XG5cbiAgICAgICAgICAgIGNvbnN0IE11bHRpTWFwID0gKFxuICAgICAgICAgICAgICAgIEluQXJyYXk6IFRBcnJheTx1bmtub3duPixcbiAgICAgICAgICAgICAgICAuLi5IYW5kbGVyczogVEFycmF5PEZMb2dIYW5kbGVyPlxuICAgICAgICAgICAgKTogVEFycmF5PHVua25vd24+ID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGV0IE91dDogVEFycmF5PEZTdGF0ZW1lbnRUdXBsZT4gPSBJbkFycmF5Lm1hcCgoU3RhdGVtZW50OiB1bmtub3duKTogRlN0YXRlbWVudFR1cGxlID0+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyBTdGF0ZW1lbnQsIFN0YXRlbWVudHMgXTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIEhhbmRsZXJzLmZvckVhY2goKEhhbmRsZXI6IEZMb2dIYW5kbGVyKTogdm9pZCA9PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgT3V0ID0gT3V0Lm1hcCgoWyBTdGF0ZW1lbnQsIFN0YXRlbWVudHMgXTogRlN0YXRlbWVudFR1cGxlKTogRlN0YXRlbWVudFR1cGxlID0+XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbIEhhbmRsZXIoU3RhdGVtZW50LCBTdGF0ZW1lbnRzKSwgU3RhdGVtZW50cyBdO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBPdXQubWFwKChbIFN0YXRlbWVudCBdOiBGU3RhdGVtZW50VHVwbGUpOiB1bmtub3duID0+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gU3RhdGVtZW50O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gY29uc3QgRm9ybWF0dGVkU3RhdGVtZW50czogVEFycmF5PHVua25vd24+ID0gU3RhdGVtZW50cztcbiAgICAgICAgICAgIGNvbnN0IEZvcm1hdHRlZFN0YXRlbWVudHM6IFRBcnJheTx1bmtub3duPiA9IE11bHRpTWFwKFxuICAgICAgICAgICAgICAgIFN0YXRlbWVudHMsXG4gICAgICAgICAgICAgICAgSGFuZGxlQmFzZTY0U3RyaW5ncyxcbiAgICAgICAgICAgICAgICBIYW5kbGVBbHdheXNBcHBseUZvcm1hdFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gY29uc3QgRm9ybWF0dGVkU3RhdGVtZW50czogVEFycmF5PHVua25vd24+ID1cbiAgICAgICAgICAgIC8vICAgICBJc1NpbXBsZVxuICAgICAgICAgICAgLy8gICAgICAgICA/IFN0YXRlbWVudHNcbiAgICAgICAgICAgIC8vICAgICAgICAgOiBMb2dTZXR0aW5ncy5Gb3JtYXQuQWx3YXlzQXBwbHlGb3JtYXRcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgID8gKFN0YXRlbWVudHMgYXMgVEFycmF5PEZMb2dWYWx1ZVR5cGU+KS5tYXAoKFN0YXRlbWVudDogRkxvZ1ZhbHVlVHlwZSk6IHN0cmluZyA9PlxuICAgICAgICAgICAgLy8gICAgICAgICAgICAge1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgU3RhdGVtZW50ID09PSBcIm9iamVjdFwiKVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZvcm1hdChTdGF0ZW1lbnQpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICByZXR1cm4gRm9ybWF0SW5saW5lKFN0YXRlbWVudCk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIDogU3RhdGVtZW50cztcbiAgICAgICAgICAgIC8vICAgICAvLyA6IEZvcm1hdHRlcnMubWFwKChGb3JtYXR0ZXI6IEZMb2dGb3JtYXRGdW5jdGlvbik6IHVua25vd24gPT5cbiAgICAgICAgICAgIC8vICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgICAgLy8gICAgIHJldHVybiBTdGF0ZW1lbnRzLm1hcChGb3JtYXR0ZXIpO1xuICAgICAgICAgICAgLy8gICAgIC8vIH0pLmZsYXQoMjApO1xuXG4gICAgICAgICAgICBjb25zdCBTcGFjZWRPdXRTdGF0ZW1lbnRzOiBUQXJyYXk8dW5rbm93bj4gPVxuICAgICAgICAgICAgICAgIEZvcm1hdHRlZFN0YXRlbWVudHMuZmxhdE1hcCgoU3RhdGVtZW50OiB1bmtub3duKTogVEFycmF5PHVua25vd24+ID0+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyBTdGF0ZW1lbnQsIFwiIFwiIF07XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIExvZ0ludGVybmFsKFwiQmFja2VuZFwiLCBDYXRlZ29yeSwgTGV2ZWwsIC4uLlNwYWNlZE91dFN0YXRlbWVudHMpO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBjb25zdCBMb2dnZXI6IEZMb2dnZXJJbnRlcmltID0gTWFrZUxvZ2dlckludGVybmFsKFwiTm9ybWFsXCIpO1xuICAgIExvZ2dlci5FcnJvciA9IE1ha2VMb2dnZXJJbnRlcm5hbChcIkVycm9yXCIpO1xuICAgIExvZ2dlci5WZXJib3NlID0gTWFrZUxvZ2dlckludGVybmFsKFwiVmVyYm9zZVwiKTtcbiAgICBMb2dnZXIuV2FybiA9IE1ha2VMb2dnZXJJbnRlcm5hbChcIldhcm5cIik7XG5cbiAgICByZXR1cm4gTG9nZ2VyIGFzIEZMb2dnZXI7XG59XG4iLCIvKiBGaWxlOiAgICAgIExvZ1V0aWxpdHkudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7XG4gICAgRkFycmF5VHlwZU5hbWUsXG4gICAgRkNvbnRhaW5lclR5cGUsXG4gICAgRkRlbGltaXRlclN0YXJ0U3RyaW5nLFxuICAgIEZEZWxpbWl0ZXJzLFxuICAgIEZLZXlWYWx1ZVBhaXIsXG4gICAgRkxvZ0FycmF5LFxuICAgIEZMb2dNYXAsXG4gICAgRkxvZ1JlY29yZCxcbiAgICBGTG9nU2V0LFxuICAgIEZMb2dTdHJpbmcsXG4gICAgRkxvZ1N0cmluZ0FycmF5LFxuICAgIEZMb2dWYWx1ZVR5cGUsXG4gICAgRk1hcCxcbiAgICBGUHJpbWl0aXZlLFxuICAgIEZSZWNvcmQsXG4gICAgRlNldFR5cGVOYW1lLFxuICAgIFRMb2dDb250YWluZXIsXG4gICAgVExvZ1ByaW1pdGl2ZSxcbiAgICBUTG9nVmFsdWUgfSBmcm9tIFwiLi9Mb2dGb3JtYXQuVHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgRkxvZ0RpZ2l0U2VwYXJhdG9yLCBGTG9nUXVvdGVTdHlsZSwgRkxvZ1NldHRpbmdzLCBGVHlwZW9mIH0gZnJvbSBcIi4uLy4uLy4uL1NoYXJlZFwiO1xuaW1wb3J0IENoYWxrIGZyb20gXCJjaGFsa1wiO1xuaW1wb3J0IHsgR2V0RGV2U2V0dGluZ3MgfSBmcm9tIFwiIy9EZXZlbG9wbWVudC9EZXZTZXR0aW5nc1wiO1xuaW1wb3J0IHsgSWRlbnRpdHkgfSBmcm9tIFwiLi4vLi4vLi4vU2hhcmVkXCI7XG5cbkNoYWxrLmxldmVsID0gMztcblxuY29uc3QgTG9nU2V0dGluZ3M6IEZMb2dTZXR0aW5ncyA9IEdldERldlNldHRpbmdzKCkuTG9nO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLWZ1bmN0aW9uLXR5cGUgKi9cblxuY29uc3QgR2V0V2l0aG91dEFuc2kgPSAoSW46IHN0cmluZyk6IHN0cmluZyA9Plxue1xuICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAc3R5bGlzdGljL21heC1sZW4sIG5vLWNvbnRyb2wtcmVnZXggKi9cbiAgICBjb25zdCBBbnNpRXNjYXBlU2VxdWVuY2VQYXR0ZXJuOiBSZWdFeHAgPSAvW1xcdTAwMUJcXHUwMDlCXVtbXFxdKCkjOz9dKig/Oig/Oig/OlthLXpBLVpcXGRdKig/OjtbYS16QS1aXFxkXSopKik/XFx1MDAwNyl8KD86KD86XFxkezEsNH0oPzo7XFxkezAsNH0pKik/W1xcZEEtUFItVFpjZi1ucS11eT0+PH5dKSkvZztcblxuICAgIHJldHVybiBJbi5yZXBsYWNlKEFuc2lFc2NhcGVTZXF1ZW5jZVBhdHRlcm4sIFwiXCIpO1xufTtcblxuY29uc3QgR2V0TGVuZ3RoID0gKEluOiBzdHJpbmcpOiBudW1iZXIgPT5cbntcbiAgICByZXR1cm4gR2V0V2l0aG91dEFuc2koSW4pLmxlbmd0aDtcbn07XG5cbmNvbnN0IFN0eWxlU3RyaW5nID0gKEluOiBzdHJpbmcpOiBzdHJpbmcgPT5cbntcbiAgICBjb25zdCBTdHlsZTogUmVjb3JkPEZMb2dRdW90ZVN0eWxlLCBzdHJpbmc+ID1cbiAgICB7XG4gICAgICAgIERvdWJsZTogYFwiJHsgSW4gfVwiYCxcbiAgICAgICAgTm9uZTogSW4sXG4gICAgICAgIFNpbmdsZTogYCckeyBJbiB9J2BcbiAgICB9O1xuXG4gICAgY29uc3QgQmFzZVN0cmluZzogc3RyaW5nID0gU3R5bGVbTG9nU2V0dGluZ3MuRm9ybWF0LlF1b3RlU3R5bGVdO1xuXG4gICAgcmV0dXJuIExvZ1NldHRpbmdzLkZvcm1hdC5Db2xvcnNcbiAgICAgICAgPyBDaGFsay5oZXgoXCIjQ0E1MDEwXCIpKEJhc2VTdHJpbmcpXG4gICAgICAgIDogQmFzZVN0cmluZztcbn07XG5cbmNvbnN0IFN0eWxlU3ltYm9sID0gKEluOiBzeW1ib2wpOiBzdHJpbmcgPT5cbntcbiAgICByZXR1cm4gTG9nU2V0dGluZ3MuRm9ybWF0LkNvbG9yc1xuICAgICAgICA/IENoYWxrLmhleChcIiMwMEI3QzNcIikoSW4udG9TdHJpbmcoKSlcbiAgICAgICAgOiBJbi50b1N0cmluZygpO1xufTtcblxuY29uc3QgU3R5bGVOdW1iZXIgPSAoSW46IGJpZ2ludCB8IG51bWJlcik6IHN0cmluZyA9Plxue1xuICAgIHJldHVybiBMb2dTZXR0aW5ncy5Gb3JtYXQuQ29sb3JzXG4gICAgICAgID8gQ2hhbGsuZ3JlZW4oRm9ybWF0RGlnaXRzKEluKSlcbiAgICAgICAgOiBGb3JtYXREaWdpdHMoSW4pO1xufTtcblxuY29uc3QgRm9ybWF0U3RyaW5nID0gKHsgRGVwdGgsIFZhbHVlIH06IFRMb2dQcmltaXRpdmU8c3RyaW5nPik6IEZMb2dTdHJpbmcgPT5cbntcbiAgICByZXR1cm4ge1xuICAgICAgICBEZXB0aCxcbiAgICAgICAgU3RyaW5nOiAoSXNCYXNlNjRTdHJpbmcoVmFsdWUpICYmIExvZ1NldHRpbmdzLkZvcm1hdC5UcnVuY2F0ZUJhc2U2NFN0cmluZ3MpXG4gICAgICAgICAgICA/IEZvcm1hdEJhc2U2NFN0cmluZyhWYWx1ZSlcbiAgICAgICAgICAgIDogU3R5bGVTdHJpbmcoVmFsdWUpXG4gICAgfTtcbn07XG5cbmNvbnN0IEZvcm1hdFN5bWJvbCA9ICh7IERlcHRoLCBWYWx1ZSB9OiBUTG9nUHJpbWl0aXZlPHN5bWJvbD4pOiBGTG9nU3RyaW5nID0+XG57XG4gICAgcmV0dXJuIHtcbiAgICAgICAgRGVwdGgsXG4gICAgICAgIFN0cmluZzogU3R5bGVTeW1ib2woVmFsdWUpXG4gICAgfTtcbn07XG5cbmNvbnN0IElubGluZSA9IChJbjogRkxvZ1N0cmluZ0FycmF5KTogRkxvZ1N0cmluZ0FycmF5ID0+XG57XG4gICAgY29uc3QgU2VhcmNoZWRJbmRpY2VzOiBSZWNvcmQ8RkRlbGltaXRlclN0YXJ0U3RyaW5nLCBUQXJyYXk8bnVtYmVyPj4gPVxuICAgIHtcbiAgICAgICAgXCI8XCI6IFsgXSxcbiAgICAgICAgXCJbXCI6IFsgXSxcbiAgICAgICAgXCJ7XCI6IFsgXVxuICAgIH07XG5cbiAgICBjb25zdCBSZWN1cnJlbmNlID0gKExvZ1N0cmluZ3M6IEZMb2dTdHJpbmdBcnJheSk6IEZMb2dTdHJpbmdBcnJheSA9PlxuICAgIHtcbiAgICAgICAgdHlwZSBGR2V0SW5uZXJtb3N0Q29udGFpbmVyUmV0dXJuVHlwZSA9XG4gICAgICAgICAgICB8IHVuZGVmaW5lZFxuICAgICAgICAgICAgfCB7XG4gICAgICAgICAgICAgICAgQ29udGFpbmVyOiBGTG9nU3RyaW5nQXJyYXk7XG4gICAgICAgICAgICAgICAgU3RhcnRTdWJBcnJheTogVEFycmF5PEZMb2dTdHJpbmc+O1xuICAgICAgICAgICAgICAgIFN0b3BTdWJBcnJheTogVEFycmF5PEZMb2dTdHJpbmc+O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBHZXRTdHJpbmcgPSAoSW5Mb2dTdHJpbmc6IEZMb2dTdHJpbmcpOiBzdHJpbmcgPT4gSW5Mb2dTdHJpbmcuU3RyaW5nO1xuICAgICAgICBjb25zdCBHZXRJbm5lcm1vc3RDb250YWluZXIgPSAoSW5Mb2dTdHJpbmdzOiBGTG9nU3RyaW5nQXJyYXkpOiBGR2V0SW5uZXJtb3N0Q29udGFpbmVyUmV0dXJuVHlwZSA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBTdHJpbmdzOiBUQXJyYXk8c3RyaW5nPiA9IEluTG9nU3RyaW5ncy5tYXAoR2V0U3RyaW5nKTtcbiAgICAgICAgICAgIGNvbnN0IFN0YXJ0RGVsaW1pdGVyczogVEFycmF5PEZEZWxpbWl0ZXJTdGFydFN0cmluZz4gPSBbIFwiPFwiLCBcIltcIiwgXCJ7XCIgXTtcbiAgICAgICAgICAgIGNvbnN0IElubmVybW9zdFN0YXJ0SW5kZXg6IG51bWJlciA9IE1hdGgubWF4KC4uLlN0YXJ0RGVsaW1pdGVyc1xuICAgICAgICAgICAgICAgIC5tYXAoKFN0YXJ0RGVsaW1pdGVyOiBGRGVsaW1pdGVyU3RhcnRTdHJpbmcpOiBudW1iZXIgPT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChTZWFyY2hlZEluZGljZXNbU3RhcnREZWxpbWl0ZXJdLmluY2x1ZGVzKC0xKSlcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgU3RvcFNlYXJjaEluZGV4OiBudW1iZXIgPSBNYXRoLm1pbiguLi5TZWFyY2hlZEluZGljZXNbU3RhcnREZWxpbWl0ZXJdKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBPdXQ6IG51bWJlciA9IFN0cmluZ3NcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zbGljZSgwLCBTdG9wU2VhcmNoSW5kZXgpXG4gICAgICAgICAgICAgICAgICAgICAgICAubGFzdEluZGV4T2YoU3RhcnREZWxpbWl0ZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChPdXQgPT09IC0xKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBTZWFyY2hlZEluZGljZXNbU3RhcnREZWxpbWl0ZXJdLnB1c2goLTEpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE91dDtcbiAgICAgICAgICAgICAgICB9KS5mbGF0KDIwKSk7XG5cbiAgICAgICAgICAgIGlmIChJbm5lcm1vc3RTdGFydEluZGV4ID09PSAtMSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBTZWFyY2hlZEluZGljZXNbU3RyaW5nc1tJbm5lcm1vc3RTdGFydEluZGV4XSBhcyBGRGVsaW1pdGVyU3RhcnRTdHJpbmddLnB1c2goSW5uZXJtb3N0U3RhcnRJbmRleCk7XG5cbiAgICAgICAgICAgIGNvbnN0IEdldEZpcnN0SW5kZXhPZlZhbHVlQWZ0ZXJJbmRleCA9IDxUeXBlPihcbiAgICAgICAgICAgICAgICBWYWx1ZXM6IFJlYWRvbmx5PFRBcnJheTxUeXBlPj4sXG4gICAgICAgICAgICAgICAgVGFyZ2V0VmFsdWU6IFR5cGUsXG4gICAgICAgICAgICAgICAgQWZ0ZXJJbmRleDogbnVtYmVyXG4gICAgICAgICAgICApOiBudW1iZXIgfCB1bmRlZmluZWQgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBTdGFydEluZGV4OiBudW1iZXIgPSBNYXRoLm1pbihNYXRoLm1heChBZnRlckluZGV4ICsgMSwgMCksIFZhbHVlcy5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgSW5kZXg6IG51bWJlciA9IFN0YXJ0SW5kZXg7IEluZGV4IDwgVmFsdWVzLmxlbmd0aDsgSW5kZXgrKylcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3QuaXMoVmFsdWVzW0luZGV4XSwgVGFyZ2V0VmFsdWUpKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgSW5uZXJtb3N0TG9nU3RyaW5nOiBGTG9nU3RyaW5nIHwgdW5kZWZpbmVkID0gSW5Mb2dTdHJpbmdzW0lubmVybW9zdFN0YXJ0SW5kZXhdO1xuICAgICAgICAgICAgaWYgKElubmVybW9zdExvZ1N0cmluZyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IElubmVybW9zdFN0YXJ0RGVsaW1pdGVyOiBzdHJpbmcgPSBJbm5lcm1vc3RMb2dTdHJpbmcuU3RyaW5nO1xuICAgICAgICAgICAgY29uc3QgSW5uZXJtb3N0U3RvcERlbGltaXRlcjogc3RyaW5nID1cbiAgICAgICAgICAgICAgICBJbm5lcm1vc3RTdGFydERlbGltaXRlciA9PT0gXCJ7XCJcbiAgICAgICAgICAgICAgICAgICAgPyBcIn1cIlxuICAgICAgICAgICAgICAgICAgICA6IElubmVybW9zdFN0YXJ0RGVsaW1pdGVyID09PSBcIjxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgPyBcIj5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgOiBcIl1cIjtcblxuICAgICAgICAgICAgY29uc3QgSW5uZXJtb3N0U3RvcEluZGV4OiBudW1iZXIgfCB1bmRlZmluZWQgPSBHZXRGaXJzdEluZGV4T2ZWYWx1ZUFmdGVySW5kZXgoXG4gICAgICAgICAgICAgICAgU3RyaW5ncyxcbiAgICAgICAgICAgICAgICBJbm5lcm1vc3RTdG9wRGVsaW1pdGVyLFxuICAgICAgICAgICAgICAgIElubmVybW9zdFN0YXJ0SW5kZXhcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmIChJbm5lcm1vc3RTdG9wSW5kZXggPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBJbm5lcm1vc3RDb250YWluZXI6IEZMb2dTdHJpbmdBcnJheSA9XG4gICAgICAgICAgICAgICAgSW5Mb2dTdHJpbmdzLnNsaWNlKElubmVybW9zdFN0YXJ0SW5kZXgsIElubmVybW9zdFN0b3BJbmRleCArIDEpIGFzIEZMb2dTdHJpbmdBcnJheTtcbiAgICAgICAgICAgIGNvbnN0IFN0b3BTdWJBcnJheTogVEFycmF5PEZMb2dTdHJpbmc+ID0gSW5Mb2dTdHJpbmdzLmxlbmd0aCA+PSBJbm5lcm1vc3RTdG9wSW5kZXggKyAxXG4gICAgICAgICAgICAgICAgPyBJbkxvZ1N0cmluZ3Muc2xpY2UoSW5uZXJtb3N0U3RvcEluZGV4ICsgMSwgdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIDogWyBdO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIENvbnRhaW5lcjogSW5uZXJtb3N0Q29udGFpbmVyLFxuICAgICAgICAgICAgICAgIFN0YXJ0U3ViQXJyYXk6IEluTG9nU3RyaW5ncy5zbGljZSgwLCBJbm5lcm1vc3RTdGFydEluZGV4KSxcbiAgICAgICAgICAgICAgICBTdG9wU3ViQXJyYXlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgU2hvdWxkSW5saW5lID0gKENvbnRhaW5lckxvZ1N0cmluZ3M6IEZMb2dTdHJpbmdBcnJheSk6IGJvb2xlYW4gPT5cbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgVG90YWxXaWR0aDogbnVtYmVyID1cbiAgICAgICAgICAgICAgICBDb250YWluZXJMb2dTdHJpbmdzWzBdLkRlcHRoICogTG9nU2V0dGluZ3MuU2l6ZS5UYWJXaWR0aCArXG4gICAgICAgICAgICAgICAgQ29udGFpbmVyTG9nU3RyaW5ncy5yZWR1Y2UoKEFjY3VtdWxhdG9yOiBudW1iZXIsIEN1cnJlbnRWYWx1ZTogRkxvZ1N0cmluZyk6IG51bWJlciA9PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEFjY3VtdWxhdG9yICsgR2V0TGVuZ3RoKEN1cnJlbnRWYWx1ZS5TdHJpbmcpO1xuICAgICAgICAgICAgICAgIH0sIDApO1xuXG4gICAgICAgICAgICByZXR1cm4gVG90YWxXaWR0aCA8PSBMb2dTZXR0aW5ncy5TaXplLk1heFRlcm1pbmFsV2lkdGg7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgSW5uZXJtb3N0Q29udGFpbmVyOiBGR2V0SW5uZXJtb3N0Q29udGFpbmVyUmV0dXJuVHlwZSA9IEdldElubmVybW9zdENvbnRhaW5lcihMb2dTdHJpbmdzKTtcbiAgICAgICAgaWYgKElubmVybW9zdENvbnRhaW5lciAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCB7IENvbnRhaW5lciwgU3RhcnRTdWJBcnJheSwgU3RvcFN1YkFycmF5IH0gPSBJbm5lcm1vc3RDb250YWluZXI7XG4gICAgICAgICAgICBpZiAoU2hvdWxkSW5saW5lKElubmVybW9zdENvbnRhaW5lci5Db250YWluZXIpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IElubGluZWQ6IEZMb2dTdHJpbmcgPVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgRGVwdGg6IENvbnRhaW5lclswXS5EZXB0aCxcbiAgICAgICAgICAgICAgICAgICAgU3RyaW5nOiBDb250YWluZXIubWFwKEdldFN0cmluZykuam9pbihcIiBcIilcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBbIC4uLlN0YXJ0U3ViQXJyYXksIElubGluZWQsIC4uLlN0b3BTdWJBcnJheSBdIGFzIEZMb2dTdHJpbmdBcnJheTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBMb2dTdHJpbmdzO1xuICAgIH07XG5cbiAgICBjb25zdCBTaG91bGRSZWN1ciA9ICgpOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgIVNlYXJjaGVkSW5kaWNlc1tcIjxcIl0uaW5jbHVkZXMoLTEpIHx8XG4gICAgICAgICAgICAhU2VhcmNoZWRJbmRpY2VzW1wie1wiXS5pbmNsdWRlcygtMSkgfHxcbiAgICAgICAgICAgICFTZWFyY2hlZEluZGljZXNbXCJbXCJdLmluY2x1ZGVzKC0xKVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICBsZXQgT3V0OiBGTG9nU3RyaW5nQXJyYXkgPSBbIC4uLkluIF07XG5cbiAgICB3aGlsZSAoU2hvdWxkUmVjdXIoKSlcbiAgICB7XG4gICAgICAgIE91dCA9IFJlY3VycmVuY2UoWyAuLi5PdXQgXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIE91dDtcbn07XG5cbmNvbnN0IEZvcm1hdERpZ2l0cyA9IChWYWx1ZTogbnVtYmVyIHwgYmlnaW50KTogc3RyaW5nID0+XG57XG4gICAgY29uc3QgU2VwYXJhdG9yczogUmVjb3JkPEZMb2dEaWdpdFNlcGFyYXRvciwgc3RyaW5nPiA9XG4gICAge1xuICAgICAgICBDb21tYTogXCIsXCIsXG4gICAgICAgIE5vbmU6IFwiXCIsXG4gICAgICAgIFNwYWNlOiBcIiBcIixcbiAgICAgICAgVW5kZXJzY29yZTogXCJfXCJcbiAgICB9O1xuXG4gICAgY29uc3QgU2VwYXJhdG9yOiBzdHJpbmcgPSBTZXBhcmF0b3JzW0xvZ1NldHRpbmdzLkZvcm1hdC5EaWdpdFNlcGFyYXRvcl07XG5cbiAgICBjb25zdCBHcm91cEludGVncmFsRGlnaXRzID0gKEludGVncmFsRGlnaXRzOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICB7XG4gICAgICAgIGlmIChJbnRlZ3JhbERpZ2l0cy5sZW5ndGggPD0gMylcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIEludGVncmFsRGlnaXRzO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgR3JvdXBzOiBUQXJyYXk8c3RyaW5nPiA9IFsgXTtcbiAgICAgICAgZm9yIChsZXQgSW5kZXg6IG51bWJlciA9IEludGVncmFsRGlnaXRzLmxlbmd0aDsgSW5kZXggPiAwOyBJbmRleCAtPSAzKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBTdGFydEluZGV4OiBudW1iZXIgPSBNYXRoLm1heCgwLCBJbmRleCAtIDMpO1xuICAgICAgICAgICAgR3JvdXBzLnB1c2goSW50ZWdyYWxEaWdpdHMuc2xpY2UoU3RhcnRJbmRleCwgSW5kZXgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIEdyb3Vwcy5yZXZlcnNlKCk7XG4gICAgICAgIHJldHVybiBHcm91cHMuam9pbihTZXBhcmF0b3IpO1xuICAgIH07XG5cbiAgICBjb25zdCBHcm91cEZyYWN0aW9uYWxEaWdpdHMgPSAoRnJhY3Rpb25hbERpZ2l0czogc3RyaW5nKTogc3RyaW5nID0+XG4gICAge1xuICAgICAgICBpZiAoRnJhY3Rpb25hbERpZ2l0cy5sZW5ndGggPD0gMylcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIEZyYWN0aW9uYWxEaWdpdHM7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBHcm91cHM6IFRBcnJheTxzdHJpbmc+ID0gW107XG4gICAgICAgIGZvciAobGV0IEluZGV4OiBudW1iZXIgPSAwOyBJbmRleCA8IEZyYWN0aW9uYWxEaWdpdHMubGVuZ3RoOyBJbmRleCArPSAzKVxuICAgICAgICB7XG4gICAgICAgICAgICBHcm91cHMucHVzaChGcmFjdGlvbmFsRGlnaXRzLnNsaWNlKEluZGV4LCBJbmRleCArIDMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBHcm91cHMuam9pbihTZXBhcmF0b3IpO1xuICAgIH07XG5cbiAgICBjb25zdCBDb252ZXJ0U2NpZW50aWZpY05vdGF0aW9uVG9QbGFpbkRlY2ltYWwgPSAoTnVtYmVyVGV4dDogc3RyaW5nKTogc3RyaW5nID0+XG4gICAge1xuICAgICAgICBjb25zdCBFeHBvbmVudE1hcmtlckluZGV4OiBudW1iZXIgPSBOdW1iZXJUZXh0LnNlYXJjaCgvW2VFXS8pO1xuICAgICAgICBpZiAoRXhwb25lbnRNYXJrZXJJbmRleCA9PT0gLTEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXJUZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgTWFudGlzc2FUZXh0OiBzdHJpbmcgPSBOdW1iZXJUZXh0LnNsaWNlKDAsIEV4cG9uZW50TWFya2VySW5kZXgpO1xuICAgICAgICBjb25zdCBFeHBvbmVudFRleHQ6IHN0cmluZyA9IE51bWJlclRleHQuc2xpY2UoRXhwb25lbnRNYXJrZXJJbmRleCArIDEpO1xuICAgICAgICBjb25zdCBFeHBvbmVudFZhbHVlOiBudW1iZXIgPSBOdW1iZXIoRXhwb25lbnRUZXh0KTtcblxuICAgICAgICBsZXQgU2lnblRleHQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIGxldCBVbnNpZ25lZE1hbnRpc3NhVGV4dDogc3RyaW5nID0gTWFudGlzc2FUZXh0O1xuXG4gICAgICAgIGlmIChVbnNpZ25lZE1hbnRpc3NhVGV4dC5zdGFydHNXaXRoKFwiLVwiKSlcbiAgICAgICAge1xuICAgICAgICAgICAgU2lnblRleHQgPSBcIi1cIjtcbiAgICAgICAgICAgIFVuc2lnbmVkTWFudGlzc2FUZXh0ID0gVW5zaWduZWRNYW50aXNzYVRleHQuc2xpY2UoMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoVW5zaWduZWRNYW50aXNzYVRleHQuc3RhcnRzV2l0aChcIitcIikpXG4gICAgICAgIHtcbiAgICAgICAgICAgIFVuc2lnbmVkTWFudGlzc2FUZXh0ID0gVW5zaWduZWRNYW50aXNzYVRleHQuc2xpY2UoMSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBEZWNpbWFsUG9pbnRJbmRleDogbnVtYmVyID0gVW5zaWduZWRNYW50aXNzYVRleHQuaW5kZXhPZihcIi5cIik7XG4gICAgICAgIGNvbnN0IERpZ2l0c09ubHk6IHN0cmluZyA9IFVuc2lnbmVkTWFudGlzc2FUZXh0LnJlcGxhY2UoXCIuXCIsIFwiXCIpO1xuICAgICAgICBjb25zdCBEaWdpdHNCZWZvcmVEZWNpbWFsOiBudW1iZXIgPSAoRGVjaW1hbFBvaW50SW5kZXggPT09IC0xKVxuICAgICAgICAgICAgPyBEaWdpdHNPbmx5Lmxlbmd0aFxuICAgICAgICAgICAgOiBEZWNpbWFsUG9pbnRJbmRleDtcblxuICAgICAgICBjb25zdCBOZXdEZWNpbWFsSW5kZXg6IG51bWJlciA9IERpZ2l0c0JlZm9yZURlY2ltYWwgKyBFeHBvbmVudFZhbHVlO1xuXG4gICAgICAgIGlmIChOZXdEZWNpbWFsSW5kZXggPD0gMClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgTGVhZGluZ1plcm9zQ291bnQ6IG51bWJlciA9IC1OZXdEZWNpbWFsSW5kZXg7XG4gICAgICAgICAgICByZXR1cm4gU2lnblRleHQgKyBcIjAuXCIgKyBcIjBcIi5yZXBlYXQoTGVhZGluZ1plcm9zQ291bnQpICsgRGlnaXRzT25seTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChOZXdEZWNpbWFsSW5kZXggPj0gRGlnaXRzT25seS5sZW5ndGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IFRyYWlsaW5nWmVyb3NDb3VudDogbnVtYmVyID0gTmV3RGVjaW1hbEluZGV4IC0gRGlnaXRzT25seS5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm4gU2lnblRleHQgKyBEaWdpdHNPbmx5ICsgXCIwXCIucmVwZWF0KFRyYWlsaW5nWmVyb3NDb3VudCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gU2lnblRleHQgKyBEaWdpdHNPbmx5LnNsaWNlKDAsIE5ld0RlY2ltYWxJbmRleCkgKyBcIi5cIiArIERpZ2l0c09ubHkuc2xpY2UoTmV3RGVjaW1hbEluZGV4KTtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBWYWx1ZSA9PT0gXCJiaWdpbnRcIilcbiAgICB7XG4gICAgICAgIGNvbnN0IElzTmVnYXRpdmU6IGJvb2xlYW4gPSBWYWx1ZSA8IDBuO1xuICAgICAgICBjb25zdCBBYnNvbHV0ZVZhbHVlOiBiaWdpbnQgPSBJc05lZ2F0aXZlID8gLVZhbHVlIDogVmFsdWU7XG5cbiAgICAgICAgY29uc3QgSW50ZWdyYWxEaWdpdHM6IHN0cmluZyA9IEFic29sdXRlVmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgY29uc3QgR3JvdXBlZEludGVncmFsRGlnaXRzOiBzdHJpbmcgPSBHcm91cEludGVncmFsRGlnaXRzKEludGVncmFsRGlnaXRzKTtcblxuICAgICAgICByZXR1cm4gKElzTmVnYXRpdmUgPyBcIi1cIiA6IFwiXCIpICsgR3JvdXBlZEludGVncmFsRGlnaXRzO1xuICAgIH1cblxuICAgIGlmICghTnVtYmVyLmlzRmluaXRlKFZhbHVlKSlcbiAgICB7XG4gICAgICAgIHJldHVybiBTdHJpbmcoVmFsdWUpO1xuICAgIH1cblxuICAgIGNvbnN0IElzTmVnYXRpdmU6IGJvb2xlYW4gPSBWYWx1ZSA8IDAgfHwgT2JqZWN0LmlzKFZhbHVlLCAtMCk7XG4gICAgY29uc3QgQWJzb2x1dGVWYWx1ZTogbnVtYmVyID0gTWF0aC5hYnMoVmFsdWUpO1xuXG4gICAgY29uc3QgUGxhaW5EZWNpbWFsVGV4dDogc3RyaW5nID0gQ29udmVydFNjaWVudGlmaWNOb3RhdGlvblRvUGxhaW5EZWNpbWFsKEFic29sdXRlVmFsdWUudG9TdHJpbmcoKSk7XG4gICAgY29uc3QgUGFydHM6IFRBcnJheTxzdHJpbmc+ID0gUGxhaW5EZWNpbWFsVGV4dC5zcGxpdChcIi5cIik7XG4gICAgY29uc3QgSW50ZWdyYWxEaWdpdHM6IHN0cmluZyA9IFBhcnRzWzBdID8/IFwiMFwiO1xuICAgIGNvbnN0IEZyYWN0aW9uYWxEaWdpdHM6IHN0cmluZyB8IHVuZGVmaW5lZCA9IFBhcnRzWzFdO1xuXG4gICAgY29uc3QgR3JvdXBlZEludGVncmFsRGlnaXRzOiBzdHJpbmcgPSBHcm91cEludGVncmFsRGlnaXRzKEludGVncmFsRGlnaXRzKTtcblxuICAgIGlmIChGcmFjdGlvbmFsRGlnaXRzID09PSB1bmRlZmluZWQgfHwgRnJhY3Rpb25hbERpZ2l0cy5sZW5ndGggPT09IDApXG4gICAge1xuICAgICAgICByZXR1cm4gKElzTmVnYXRpdmUgPyBcIi1cIiA6IFwiXCIpICsgR3JvdXBlZEludGVncmFsRGlnaXRzO1xuICAgIH1cblxuICAgIGNvbnN0IEdyb3VwZWRGcmFjdGlvbmFsRGlnaXRzOiBzdHJpbmcgPSBHcm91cEZyYWN0aW9uYWxEaWdpdHMoRnJhY3Rpb25hbERpZ2l0cyk7XG5cbiAgICByZXR1cm4gKElzTmVnYXRpdmUgPyBcIi1cIiA6IFwiXCIpICsgR3JvdXBlZEludGVncmFsRGlnaXRzICsgXCIuXCIgKyBHcm91cGVkRnJhY3Rpb25hbERpZ2l0cztcbn07XG5cbmNvbnN0IEZvcm1hdE51bWJlciA9ICh7IERlcHRoLCBWYWx1ZSB9OiBUTG9nUHJpbWl0aXZlPG51bWJlcj4gfCBUTG9nUHJpbWl0aXZlPGJpZ2ludD4pOiBGTG9nU3RyaW5nID0+XG57XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBEZXB0aCxcbiAgICAgICAgU3RyaW5nOiBTdHlsZU51bWJlcihWYWx1ZSlcbiAgICB9O1xufTtcblxuY29uc3QgRm9ybWF0TnVsbCA9ICh7IERlcHRoIH06IFRMb2dQcmltaXRpdmU8bnVsbD4pOiBUQXJyYXk8RkxvZ1N0cmluZz4gPT5cbntcbiAgICByZXR1cm4gWyB7XG4gICAgICAgIERlcHRoLFxuICAgICAgICBTdHJpbmc6IExvZ1NldHRpbmdzLkZvcm1hdC5Db2xvcnMgPyBDaGFsay55ZWxsb3coXCJudWxsXCIpIDogXCJudWxsXCJcbiAgICB9IF07XG59O1xuXG5jb25zdCBGb3JtYXRVbmRlZmluZWQgPSAoeyBEZXB0aCB9OiBUTG9nUHJpbWl0aXZlPHVuZGVmaW5lZD4pOiBGTG9nU3RyaW5nID0+XG57XG4gICAgcmV0dXJuIHtcbiAgICAgICAgRGVwdGgsXG4gICAgICAgIFN0cmluZzogTG9nU2V0dGluZ3MuRm9ybWF0LkNvbG9ycyA/IENoYWxrLmdyYXkoXCJ1bmRlZmluZWRcIikgOiBcInVuZGVmaW5lZFwiXG4gICAgfTtcbn07XG5cbmNvbnN0IEZvcm1hdEZ1bmN0aW9uID0gKHsgRGVwdGggfTogVExvZ1ByaW1pdGl2ZTxGdW5jdGlvbj4pOiBGTG9nU3RyaW5nID0+XG57XG4gICAgcmV0dXJuIHtcbiAgICAgICAgRGVwdGgsXG4gICAgICAgIFN0cmluZzogTG9nU2V0dGluZ3MuRm9ybWF0LkNvbG9ycyA/IENoYWxrLnJlZChcIlsgRnVuY3Rpb24gXVwiKSA6IFwiWyBGdW5jdGlvbiBdXCJcbiAgICB9O1xufTtcblxuY29uc3QgRm9ybWF0Qm9vbGVhbiA9ICh7IERlcHRoLCBWYWx1ZSB9OiBUTG9nUHJpbWl0aXZlPGJvb2xlYW4+KTogRkxvZ1N0cmluZyA9Plxue1xuICAgIGNvbnN0IFN0cmluZ0Jhc2U6IHN0cmluZyA9IFZhbHVlID8gXCJ0cnVlXCIgOiBcImZhbHNlXCI7XG4gICAgY29uc3QgU3R5bGVGdW5jdGlvbjogRnVuY3Rpb24gPSBMb2dTZXR0aW5ncy5Gb3JtYXQuQ29sb3JzXG4gICAgICAgID8gKFZhbHVlID8gQ2hhbGsuYmx1ZSA6IENoYWxrLnJlZClcbiAgICAgICAgOiBJZGVudGl0eTtcblxuICAgIGNvbnN0IFN0cmluZzogc3RyaW5nID0gU3R5bGVGdW5jdGlvbihTdHJpbmdCYXNlKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIERlcHRoLFxuICAgICAgICBTdHJpbmdcbiAgICB9O1xufTtcblxuY29uc3QgRGVsaW1pdGVyczogRkRlbGltaXRlcnMgPVxue1xuICAgIEFycmF5OiBbIFwiW1wiLCBcIl1cIiBdLFxuICAgIEtleVZhbHVlUGFpcjogWyBcIntcIiwgXCJ9XCIgXSxcbiAgICBNYXA6IFsgXCI8XCIsIFwiPlwiIF0sXG4gICAgUmVjb3JkOiBbIFwie1wiLCBcIn1cIiBdLFxuICAgIFNldDogWyBcIntcIiwgXCJ9XCIgXVxufTtcblxuY29uc3QgR2V0RGVsaW1pdGVycyA9IChEZXB0aDogbnVtYmVyLCBDb250YWluZXJUeXBlOiBGQ29udGFpbmVyVHlwZSk6IFsgRkxvZ1N0cmluZywgRkxvZ1N0cmluZyBdID0+XG57XG4gICAgY29uc3QgTWFrZURlbGltaXRlckxvZ1N0cmluZyA9IChTdHJpbmc6IHN0cmluZyk6IEZMb2dTdHJpbmcgPT4gKHsgRGVwdGgsIFN0cmluZyB9KTtcbiAgICByZXR1cm4gRGVsaW1pdGVyc1tDb250YWluZXJUeXBlXS5tYXAoTWFrZURlbGltaXRlckxvZ1N0cmluZykgYXMgWyBGTG9nU3RyaW5nLCBGTG9nU3RyaW5nIF07XG59O1xuXG5jb25zdCBGb3JtYXRBcnJheSA9IChMb2dBcnJheTogRkxvZ0FycmF5KTogVEFycmF5PEZMb2dTdHJpbmc+ID0+XG57XG4gICAgcmV0dXJuIEZvcm1hdENvbnRhaW5lcihcIkFycmF5XCIsIExvZ0FycmF5KTtcbn07XG5cbmNvbnN0IEZvcm1hdE1hcCA9ICh7IERlcHRoLCBWYWx1ZSB9OiBGTG9nTWFwKTogVEFycmF5PEZMb2dTdHJpbmc+ID0+XG57XG4gICAgY29uc3QgRm9ybWF0S2V5VmFsdWVQYWlyID0gKHsgRGVwdGgsIEtleSwgVmFsdWUgfTogRktleVZhbHVlUGFpcik6IEZMb2dTdHJpbmdBcnJheSA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgWyBTdGFydERlbGltaXRlckxvZ1N0cmluZywgU3RvcERlbGltaXRlckxvZ1N0cmluZyBdID0gR2V0RGVsaW1pdGVycyhEZXB0aCwgXCJLZXlWYWx1ZVBhaXJcIik7XG5cbiAgICAgICAgY29uc3QgRm9ybWF0TWFwS2V5ID0gKHsgRGVwdGgsIEtleSB9OiBPbWl0PEZLZXlWYWx1ZVBhaXIsIFwiVmFsdWVcIj4pOiBGTG9nU3RyaW5nID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IE91dDogRkxvZ1N0cmluZyA9IEZvcm1hdFZhbHVlKHsgRGVwdGg6IERlcHRoICsgMSwgVmFsdWU6IEtleSB9KVswXTtcbiAgICAgICAgICAgIE91dC5TdHJpbmcgKz0gXCIsXCI7XG4gICAgICAgICAgICByZXR1cm4gT3V0O1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IEZvcm1hdE1hcFZhbHVlID0gKHsgRGVwdGgsIFZhbHVlIH06IE9taXQ8RktleVZhbHVlUGFpciwgXCJLZXlcIj4pOiBGTG9nU3RyaW5nQXJyYXkgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIEZvcm1hdFZhbHVlKHsgRGVwdGg6IERlcHRoICsgMSwgVmFsdWUgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgS2V5TG9nU3RyaW5nOiBGTG9nU3RyaW5nID0gRm9ybWF0TWFwS2V5KHsgRGVwdGgsIEtleSB9KTtcbiAgICAgICAgY29uc3QgVmFsdWVMb2dTdHJpbmdzOiBGTG9nU3RyaW5nQXJyYXkgPSBGb3JtYXRNYXBWYWx1ZSh7IERlcHRoLCBWYWx1ZSB9KTtcblxuICAgICAgICByZXR1cm4gWyBTdGFydERlbGltaXRlckxvZ1N0cmluZywgS2V5TG9nU3RyaW5nLCAuLi5WYWx1ZUxvZ1N0cmluZ3MsIFN0b3BEZWxpbWl0ZXJMb2dTdHJpbmcgXTtcbiAgICB9O1xuXG4gICAgY29uc3QgWyBTdGFydERlbGltaXRlckxvZ1N0cmluZywgU3RvcERlbGltaXRlckxvZ1N0cmluZyBdID0gR2V0RGVsaW1pdGVycyhEZXB0aCwgXCJNYXBcIik7XG4gICAgY29uc3QgR2V0S2V5VmFsdWVQYWlycyA9IChJbk1hcDogRk1hcCk6IFRBcnJheTxGS2V5VmFsdWVQYWlyPiA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgT3V0OiBUQXJyYXk8RktleVZhbHVlUGFpcj4gPSBbIF07XG5cbiAgICAgICAgSW5NYXAuZm9yRWFjaCgoVmFsdWU6IHVua25vd24sIEtleTogRlByaW1pdGl2ZSk6IHZvaWQgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgT3V0LnB1c2goeyBEZXB0aDogRGVwdGggKyAxLCBLZXksIFZhbHVlOiBWYWx1ZSBhcyBUTG9nVmFsdWUgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBPdXQ7XG4gICAgfTtcblxuICAgIGNvbnN0IElubmVyTG9nU3RyaW5nczogRkxvZ1N0cmluZ0FycmF5ID1cbiAgICAgICAgR2V0S2V5VmFsdWVQYWlycyhWYWx1ZSkubWFwKEZvcm1hdEtleVZhbHVlUGFpcikuZmxhdCgyMCkgYXMgRkxvZ1N0cmluZ0FycmF5O1xuXG4gICAgcmV0dXJuIFsgU3RhcnREZWxpbWl0ZXJMb2dTdHJpbmcsIC4uLklubmVyTG9nU3RyaW5ncywgU3RvcERlbGltaXRlckxvZ1N0cmluZyBdO1xufTtcblxuY29uc3QgRm9ybWF0UmVjb3JkID0gKHsgRGVwdGgsIFZhbHVlIH06IEZMb2dSZWNvcmQpOiBUQXJyYXk8RkxvZ1N0cmluZz4gPT5cbntcbiAgICBjb25zdCBbIFN0YXJ0RGVsaW1pdGVyTG9nU3RyaW5nLCBTdG9wRGVsaW1pdGVyTG9nU3RyaW5nIF0gPSBHZXREZWxpbWl0ZXJzKERlcHRoLCBcIlJlY29yZFwiKTtcblxuICAgIGNvbnN0IEdldEtleVZhbHVlUGFpcnMgPSAoSW5SZWNvcmQ6IEZSZWNvcmQpOiBUQXJyYXk8RktleVZhbHVlUGFpcj4gPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IE91dDogVEFycmF5PEZLZXlWYWx1ZVBhaXI+ID0gWyBdO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKEluUmVjb3JkKS5mb3JFYWNoKChLZXk6IFByb3BlcnR5S2V5KTogdm9pZCA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBPdXQucHVzaCh7IERlcHRoLCBLZXksIFZhbHVlOiBJblJlY29yZFtLZXldIGFzIFRMb2dWYWx1ZSB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIE91dDtcbiAgICB9O1xuXG4gICAgY29uc3QgS2V5VmFsdWVQYWlyczogVEFycmF5PEZLZXlWYWx1ZVBhaXI+ID0gR2V0S2V5VmFsdWVQYWlycyhWYWx1ZSk7XG5cbiAgICBjb25zdCBGb3JtYXRLZXlWYWx1ZVBhaXIgPSAoeyBEZXB0aCwgS2V5LCBWYWx1ZSB9OiBGS2V5VmFsdWVQYWlyLCBJbmRleDogbnVtYmVyKTogRkxvZ1N0cmluZ0FycmF5ID0+XG4gICAge1xuICAgICAgICAvLyBjb25zdCBbIFN0YXJ0RGVsaW1pdGVyTG9nU3RyaW5nLCBTdG9wRGVsaW1pdGVyTG9nU3RyaW5nIF0gPSBHZXREZWxpbWl0ZXJzKERlcHRoLCBcIlJlY29yZFwiKTtcblxuICAgICAgICBjb25zdCBGb3JtYXRSZWNvcmRLZXkgPSAoeyBEZXB0aCwgS2V5IH06IE9taXQ8RktleVZhbHVlUGFpciwgXCJWYWx1ZVwiPik6IEZMb2dTdHJpbmcgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgT3V0OiBGTG9nU3RyaW5nID0gRm9ybWF0VmFsdWUoeyBEZXB0aDogRGVwdGggKyAxLCBWYWx1ZTogS2V5IH0pWzBdO1xuICAgICAgICAgICAgT3V0LlN0cmluZyArPSBcIjpcIjtcbiAgICAgICAgICAgIHJldHVybiBPdXQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgRm9ybWF0UmVjb3JkVmFsdWUgPSAoeyBEZXB0aCwgVmFsdWUgfTogT21pdDxGS2V5VmFsdWVQYWlyLCBcIktleVwiPik6IEZMb2dTdHJpbmdBcnJheSA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBPdXQ6IEZMb2dTdHJpbmdBcnJheSA9IEZvcm1hdFZhbHVlKHsgRGVwdGg6IERlcHRoICsgMSwgVmFsdWUgfSk7XG4gICAgICAgICAgICBpZiAoSW5kZXggIT09IEtleVZhbHVlUGFpcnMubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBMYXN0OiBGTG9nU3RyaW5nIHwgdW5kZWZpbmVkID0gT3V0LmF0KC0xKTtcbiAgICAgICAgICAgICAgICBpZiAoTGFzdCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgTGFzdC5TdHJpbmcgKz0gXCIsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIE91dDtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBLZXlMb2dTdHJpbmc6IEZMb2dTdHJpbmcgPSBGb3JtYXRSZWNvcmRLZXkoeyBEZXB0aCwgS2V5IH0pO1xuICAgICAgICBjb25zdCBWYWx1ZUxvZ1N0cmluZ3M6IEZMb2dTdHJpbmdBcnJheSA9IEZvcm1hdFJlY29yZFZhbHVlKHsgRGVwdGgsIFZhbHVlIH0pO1xuXG4gICAgICAgIGlmIChWYWx1ZUxvZ1N0cmluZ3MubGVuZ3RoID09PSAxKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBPdXQ6IEZMb2dTdHJpbmcgPVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIERlcHRoOiBEZXB0aCArIDEsXG4gICAgICAgICAgICAgICAgU3RyaW5nOiBLZXlMb2dTdHJpbmcuU3RyaW5nICsgXCIgXCIgKyBWYWx1ZUxvZ1N0cmluZ3NbMF0uU3RyaW5nXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gWyBPdXQgXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBbIEtleUxvZ1N0cmluZywgLi4uVmFsdWVMb2dTdHJpbmdzIF07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgSW5uZXJMb2dTdHJpbmdzOiBGTG9nU3RyaW5nQXJyYXkgPVxuICAgICAgICBLZXlWYWx1ZVBhaXJzLm1hcChGb3JtYXRLZXlWYWx1ZVBhaXIpLmZsYXQoMjApIGFzIEZMb2dTdHJpbmdBcnJheTtcblxuICAgIHJldHVybiBbIFN0YXJ0RGVsaW1pdGVyTG9nU3RyaW5nLCAuLi5Jbm5lckxvZ1N0cmluZ3MsIFN0b3BEZWxpbWl0ZXJMb2dTdHJpbmcgXTtcbn07XG5cbmNvbnN0IEZvcm1hdENvbnRhaW5lciA9IChcbiAgICBDb250YWluZXJUeXBlOiBGU2V0VHlwZU5hbWUgfCBGQXJyYXlUeXBlTmFtZSxcbiAgICB7IERlcHRoLCBWYWx1ZSB9OiBGTG9nU2V0IHwgRkxvZ0FycmF5XG4pOiBUQXJyYXk8RkxvZ1N0cmluZz4gPT5cbntcbiAgICBjb25zdCBbIFN0YXJ0RGVsaW1pdGVyTG9nU3RyaW5nLCBTdG9wRGVsaW1pdGVyTG9nU3RyaW5nIF0gPSBHZXREZWxpbWl0ZXJzKERlcHRoLCBDb250YWluZXJUeXBlKTtcblxuICAgIGNvbnN0IE1ha2VMb2dWYWx1ZSA9IChJbjogRkxvZ1ZhbHVlVHlwZSk6IFRMb2dWYWx1ZSA9PiAoeyBEZXB0aDogRGVwdGggKyAxLCBWYWx1ZTogSW4gfSk7XG5cbiAgICBjb25zdCBWYWx1ZUFycmF5OiBUQXJyYXk8RkxvZ1ZhbHVlVHlwZT4gPSBBcnJheS5pc0FycmF5KFZhbHVlKVxuICAgICAgICA/IFZhbHVlXG4gICAgICAgIDogQXJyYXkuZnJvbShWYWx1ZSk7XG5cbiAgICBjb25zdCBBcHBlbmRDb21tYSA9ICh7IERlcHRoLCBTdHJpbmcgfTogRkxvZ1N0cmluZywgSW5kZXg6IG51bWJlcik6IEZMb2dTdHJpbmcgPT5cbiAgICB7XG4gICAgICAgIHJldHVybiBJbmRleCAhPT0gVmFsdWVBcnJheS5sZW5ndGggLSAxXG4gICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICBEZXB0aCxcbiAgICAgICAgICAgICAgICBTdHJpbmc6IFN0cmluZyArIFwiLFwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICBEZXB0aCxcbiAgICAgICAgICAgICAgICBTdHJpbmdcbiAgICAgICAgICAgIH07XG4gICAgfTtcblxuICAgIGNvbnN0IElubmVyTG9nU3RyaW5nczogRkxvZ1N0cmluZ0FycmF5ID1cbiAgICAgICAgVmFsdWVBcnJheS5tYXAoTWFrZUxvZ1ZhbHVlKS5tYXAoRm9ybWF0VmFsdWUpLmZsYXQoMjApLm1hcChBcHBlbmRDb21tYSkgYXMgRkxvZ1N0cmluZ0FycmF5O1xuXG4gICAgaWYgKElubmVyTG9nU3RyaW5ncy5sZW5ndGggPT09IDApXG4gICAge1xuICAgICAgICByZXR1cm4gWyB7XG4gICAgICAgICAgICBEZXB0aCxcbiAgICAgICAgICAgIFN0cmluZzogU3RhcnREZWxpbWl0ZXJMb2dTdHJpbmcuU3RyaW5nICsgXCIgXCIgKyBTdG9wRGVsaW1pdGVyTG9nU3RyaW5nLlN0cmluZ1xuICAgICAgICB9IF07XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIHJldHVybiBbIFN0YXJ0RGVsaW1pdGVyTG9nU3RyaW5nLCAuLi5Jbm5lckxvZ1N0cmluZ3MsIFN0b3BEZWxpbWl0ZXJMb2dTdHJpbmcgXTtcbiAgICB9XG59O1xuXG5jb25zdCBGb3JtYXRTZXQgPSAoTG9nU2V0OiBGTG9nU2V0KTogVEFycmF5PEZMb2dTdHJpbmc+ID0+XG57XG4gICAgcmV0dXJuIEZvcm1hdENvbnRhaW5lcihcIlNldFwiLCBMb2dTZXQpO1xufTtcblxuY29uc3QgRm9ybWF0T2JqZWN0ID0gKHsgRGVwdGgsIFZhbHVlIH06IFRMb2dDb250YWluZXIpOiBUQXJyYXk8RkxvZ1N0cmluZz4gPT5cbntcbiAgICBsZXQgRm9ybWF0dGVyOiBGdW5jdGlvbiA9IEZvcm1hdFJlY29yZDtcbiAgICBpZiAoVmFsdWUgaW5zdGFuY2VvZiBNYXApXG4gICAge1xuICAgICAgICBGb3JtYXR0ZXIgPSBGb3JtYXRNYXA7XG4gICAgfVxuICAgIGVsc2UgaWYgKFZhbHVlIGluc3RhbmNlb2YgU2V0KVxuICAgIHtcbiAgICAgICAgRm9ybWF0dGVyID0gRm9ybWF0U2V0O1xuICAgIH1cbiAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KFZhbHVlKSlcbiAgICB7XG4gICAgICAgIEZvcm1hdHRlciA9IEZvcm1hdEFycmF5O1xuICAgIH1cbiAgICBlbHNlIGlmIChWYWx1ZSA9PT0gbnVsbClcbiAgICB7XG4gICAgICAgIEZvcm1hdHRlciA9IEZvcm1hdE51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIEZvcm1hdHRlcih7IERlcHRoLCBWYWx1ZSB9KTtcbn07XG5cbmNvbnN0IEZvcm1hdFZhbHVlID0gKHsgRGVwdGgsIFZhbHVlIH06IFRMb2dWYWx1ZSk6IEZMb2dTdHJpbmdBcnJheSA9Plxue1xuICAgIGNvbnN0IEZvcm1hdHRlcnM6IFJlY29yZDxGVHlwZW9mLCBGdW5jdGlvbj4gPVxuICAgIHtcbiAgICAgICAgYmlnaW50OiBGb3JtYXROdW1iZXIsXG4gICAgICAgIGJvb2xlYW46IEZvcm1hdEJvb2xlYW4sXG4gICAgICAgIGZ1bmN0aW9uOiBGb3JtYXRGdW5jdGlvbixcbiAgICAgICAgbnVtYmVyOiBGb3JtYXROdW1iZXIsXG4gICAgICAgIG9iamVjdDogRm9ybWF0T2JqZWN0LFxuICAgICAgICBzdHJpbmc6IEZvcm1hdFN0cmluZyxcbiAgICAgICAgc3ltYm9sOiBGb3JtYXRTeW1ib2wsXG4gICAgICAgIHVuZGVmaW5lZDogRm9ybWF0VW5kZWZpbmVkXG4gICAgfTtcblxuICAgIGNvbnN0IFZhbHVlczogRkxvZ1N0cmluZyB8IEZMb2dTdHJpbmdBcnJheSA9IEZvcm1hdHRlcnNbdHlwZW9mIFZhbHVlXSh7IERlcHRoLCBWYWx1ZSB9KTtcblxuICAgIHJldHVybiBBcnJheS5pc0FycmF5KFZhbHVlcylcbiAgICAgICAgPyBWYWx1ZXNcbiAgICAgICAgOiBbIFZhbHVlcyBdO1xufTtcblxuZXhwb3J0IGNvbnN0IEZvcm1hdCA9IChWYWx1ZTogRkxvZ1ZhbHVlVHlwZSk6IHN0cmluZyA9Plxue1xuICAgIGNvbnN0IElubGluZWRBcnJheTogRkxvZ1N0cmluZ0FycmF5ID0gSW5saW5lKEZvcm1hdFZhbHVlKHsgRGVwdGg6IDAsIFZhbHVlIH0pKTtcbiAgICBjb25zdCBPdXQ6IHN0cmluZyA9IElubGluZWRBcnJheVxuICAgICAgICAubWFwKCh7IERlcHRoLCBTdHJpbmcgfTogRkxvZ1N0cmluZywgSW5kZXg6IG51bWJlcik6IHN0cmluZyA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBTdG9wRGVsaW1pdGVyczogVEFycmF5PHN0cmluZz4gPSBbIFwiPlwiLCBcIl1cIiwgXCJ9XCIgXTtcbiAgICAgICAgICAgIGNvbnN0IFN0YXJ0RGVsaW1pdGVyczogVEFycmF5PHN0cmluZz4gPSBbIFwiPFwiLCBcIltcIiwgXCJ7XCIgXTtcbiAgICAgICAgICAgIGNvbnN0IENoYXJhY3Rlcjogc3RyaW5nID0gR2V0V2l0aG91dEFuc2koU3RyaW5nKVtHZXRXaXRob3V0QW5zaShTdHJpbmcpLmxlbmd0aCAtIDFdIHx8IFwiXCI7XG4gICAgICAgICAgICBpZiAoU3RvcERlbGltaXRlcnMuaW5jbHVkZXMoQ2hhcmFjdGVyKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAoSW5kZXggIT09IElubGluZWRBcnJheS5sZW5ndGggLSAxKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgTmV4dDogRkxvZ1N0cmluZyB8IHVuZGVmaW5lZCA9IElubGluZWRBcnJheVtJbmRleCArIDFdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTmV4dCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBOZXh0U3RyaW5nU3RhcnQ6IHN0cmluZyB8IHVuZGVmaW5lZCA9IE5leHQuU3RyaW5nWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE5leHRTdHJpbmdTdGFydCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTdGFydERlbGltaXRlcnMuaW5jbHVkZXMoTmV4dFN0cmluZ1N0YXJ0KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZyArPSBcIixcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBcIiBcIi5yZXBlYXQoTG9nU2V0dGluZ3MuU2l6ZS5UYWJXaWR0aCAqIERlcHRoKSArIFN0cmluZztcbiAgICAgICAgfSlcbiAgICAgICAgLmpvaW4oXCJcXG5cIik7XG5cbiAgICByZXR1cm4gT3V0O1xufTtcblxuZXhwb3J0IGNvbnN0IEZvcm1hdElubGluZSA9IChWYWx1ZTogRkxvZ1ZhbHVlVHlwZSk6IHN0cmluZyA9Plxue1xuICAgIHJldHVybiBGb3JtYXQoVmFsdWUpLnJlcGxhY2VBbGwoXCJcXG5cIiwgXCIgXCIpO1xufTtcblxuY29uc3QgSXNCYXNlNjRTdHJpbmcgPSAoSW46IHN0cmluZyk6IGJvb2xlYW4gPT5cbntcbiAgICAvLyBjb25zdCBOb3JtYWxpemVkSW5wdXQ6IHN0cmluZyA9IEluLnJlcGxhY2UoL1xccysvZywgXCJcIik7XG5cbiAgICAvLyBpZiAoTm9ybWFsaXplZElucHV0Lmxlbmd0aCA9PT0gMCB8fCBOb3JtYWxpemVkSW5wdXQubGVuZ3RoICUgNCAhPT0gMClcbiAgICAvLyB7XG4gICAgLy8gICAgIHJldHVybiBmYWxzZTtcbiAgICAvLyB9XG5cbiAgICAvLyByZXR1cm4gL15bQS1aYS16MC05Ky9dKj17MCwyfSQvLnRlc3QoTm9ybWFsaXplZElucHV0KTtcbiAgICByZXR1cm4gKFxuICAgICAgICBJbi5zdGFydHNXaXRoKFwiZGF0YTpcIikgJiZcbiAgICAgICAgSW4uaW5jbHVkZXMoXCI7XCIpICYmXG4gICAgICAgIEluLmxlbmd0aCA+IDIwXG4gICAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBGb3JtYXRCYXNlNjRTdHJpbmcgPSAoSW46IHN0cmluZyk6IHN0cmluZyA9Plxue1xuICAgIGlmICghTG9nU2V0dGluZ3MuRm9ybWF0LlRydW5jYXRlQmFzZTY0U3RyaW5ncylcbiAgICB7XG4gICAgICAgIHJldHVybiBJbjtcbiAgICB9XG5cbiAgICBpZiAoSXNCYXNlNjRTdHJpbmcoSW4pKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIENoYWxrLmdyYXkoYFsgQmFzZTY0ICgkeyBJbi5zbGljZShcImRhdGE6XCIubGVuZ3RoKS5zcGxpdChcIjtcIilbMF0gfSkgXWApO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICByZXR1cm4gSW47XG4gICAgfVxuXG59O1xuIiwiLyogRmlsZTogICAgICBMb2cudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZHZXRUaW1lVG9rZW4sIEZMb2dGdW5jdGlvbiwgRkxvZ2dlciwgRkxvZ2dlckludGVyaW0gfSBmcm9tIFwiLi4vU2hhcmVkL0xvZy5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBGTG9nTGV2ZWwgfSBmcm9tIFwiQHNvcnJlbGx3bS93aW5kb3dzXCI7XG5pbXBvcnQgeyBHZXRUaW1lVG9rZW4gfSBmcm9tIFwiLi4vU2hhcmVkL0xvZ1wiO1xuXG5leHBvcnQgY29uc3QgR2V0VGltZSA9ICgpOiBGR2V0VGltZVRva2VuID0+XG57XG4gICAgcmV0dXJuIEdldFRpbWVUb2tlbjtcbn07XG5cbi8qKiBVc2UgdGhpcyB0byBjcmVhdGUgYSBsb2dnZXIgd2l0aGluIGEgZ2l2ZW4gbW9kdWxlIHNvIHRoYXQgdGhlIGxvZyBjYXRlZ29yeSBpcyBzZXQgZm9yIHRoYXQgbW9kdWxlLiAqL1xuZXhwb3J0IGNvbnN0IEdldExvZ2dlciA9IChDYXRlZ29yeTogc3RyaW5nKTogRkxvZ2dlciA9Plxue1xuICAgIGNvbnN0IE1ha2VMb2dnZXJJbnRlcm5hbCA9IChMZXZlbDogRkxvZ0xldmVsKTogRkxvZ0Z1bmN0aW9uID0+XG4gICAge1xuICAgICAgICByZXR1cm4gKC4uLlN0YXRlbWVudHM6IFRBcnJheTx1bmtub3duPik6IHZvaWQgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgRmlsdGVyZWRTdGF0ZW1lbnRzOiBUQXJyYXk8dW5rbm93bj4gPSBTdGF0ZW1lbnRzLm1hcCgoU3RhdGVtZW50OiB1bmtub3duKTogdW5rbm93biA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgU3RhdGVtZW50ID09PSBcIm9iamVjdFwiKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFN0YXRlbWVudCwgbnVsbCwgNCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTdGF0ZW1lbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHdpbmRvdy5lbGVjdHJvbi5pcGNSZW5kZXJlci5TZW5kKFwiTG9nXCIsIENhdGVnb3J5LCBMZXZlbCwgLi4uRmlsdGVyZWRTdGF0ZW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgY29uc3QgTG9nZ2VyOiBGTG9nZ2VySW50ZXJpbSA9IE1ha2VMb2dnZXJJbnRlcm5hbChcIk5vcm1hbFwiKTtcbiAgICBMb2dnZXIuRXJyb3IgPSBNYWtlTG9nZ2VySW50ZXJuYWwoXCJFcnJvclwiKTtcbiAgICBMb2dnZXIuVmVyYm9zZSA9IE1ha2VMb2dnZXJJbnRlcm5hbChcIlZlcmJvc2VcIik7XG4gICAgTG9nZ2VyLldhcm4gPSBNYWtlTG9nZ2VySW50ZXJuYWwoXCJXYXJuXCIpO1xuXG4gICAgcmV0dXJuIExvZ2dlciBhcyBGTG9nZ2VyO1xufTtcbiIsIi8qIEZpbGU6ICAgICAgQ29tbW9uLlR5cGVzLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGQW5ub3RhdGVkUGFuZWwsIEZQYW5lbCB9IGZyb20gXCIuLi9UcmVlLlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IEZIZXhDb2xvciwgSE1vbml0b3IgfSBmcm9tIFwiQHNvcnJlbGx3bS93aW5kb3dzXCI7XG5pbXBvcnQgdHlwZSB7IFRJcGNCYWNrZW5kRXZlbnQsIFRJcGNGcm9udGVuZEV2ZW50IH0gZnJvbSBcIi4vRXZlbnRCYXNlLlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IEZFeHRlcm5hbFdpbmRvdyB9IGZyb20gXCIuLi9XaW5kb3cvRXh0ZXJuYWxXaW5kb3cuVHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgRkZsb2F0aW5nV2luZG93IH0gZnJvbSBcIi4uL1dpbmRvdy9GbG9hdGluZ1dpbmRvdy5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBGSW5zZXJ0YWJsZVdpbmRvd0RhdGEgfSBmcm9tIFwiLi9JbnNlcnQuVHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgRlN0b3JlIH0gZnJvbSBcIi4uL1N0b3JlLlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IFRFdmVudEVycm9yQ29kZSB9IGZyb20gXCIuL0Vycm9yQ29kZXMuVHlwZXNcIjtcblxuZXhwb3J0IHR5cGUgRkFjdGl2YXRlRXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuXG5leHBvcnQgdHlwZSBGVGVhckRvd25FcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmV4cG9ydCB0eXBlIEZHZXRJZEVycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZXhwb3J0IHR5cGUgRkdldE1vbml0b3JGcm9tRm9jdXNlZFdpbmRvd0Vycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIkFjdGl2ZVdpbmRvd1VuZGVmaW5lZFwiPjtcblxuZXhwb3J0IHR5cGUgRkdldEFubm90YXRlZFBhbmVsc0Vycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZXhwb3J0IHR5cGUgRkdldEN1cnJlbnRQYW5lbEVycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZXhwb3J0IHR5cGUgRkdldElzTGlnaHRNb2RlRXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuXG5leHBvcnQgdHlwZSBGR2V0VGhlbWVDb2xvckVycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZXhwb3J0IHR5cGUgRkdldFBhbmVsU2NyZWVuc2hvdHNFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmV4cG9ydCB0eXBlIEZHZXRJbnNlcnRhYmxlV2luZG93RGF0YUVycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZXhwb3J0IHR5cGUgRkxvZ0Vycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZXhwb3J0IHR5cGUgRk1heGltaXplRmxvYXRpbmdXaW5kb3dFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmV4cG9ydCB0eXBlIEZNaW5pbWl6ZUZsb2F0aW5nV2luZG93RXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuXG5leHBvcnQgdHlwZSBGTm90aWZ5UmVhZHlFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmV4cG9ydCB0eXBlIEZSZWFkeUZvclJvdXRlRXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuXG5leHBvcnQgdHlwZSBGUmVzdG9yZUZsb2F0aW5nV2luZG93RXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuXG5leHBvcnQgdHlwZSBGUmVxdWVzdFRlYXJEb3duRXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuXG5leHBvcnQgdHlwZSBGR2V0RXh0ZXJuYWxXaW5kb3dTdGF0ZUVycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZXhwb3J0IHR5cGUgRkdldEZsb2F0aW5nV2luZG93U3RhdGVFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmV4cG9ydCB0eXBlIEZHZXRTdG9yZUVycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZXhwb3J0IHR5cGUgRlVwZGF0ZUVycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZXhwb3J0IHR5cGUgRlNldFN0b3JlRXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuXG5leHBvcnQgdHlwZSBGUmVxdWVzdFJlc3RhcnRFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmV4cG9ydCB0eXBlIEZBbGxvd0FjdGl2YXRpb25FcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmV4cG9ydCB0eXBlIEZQcmV2ZW50QWN0aXZhdGlvbkVycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZXhwb3J0IHR5cGUgRkdldElzRWxldmF0ZWRFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmV4cG9ydCB0eXBlIEZPcGVuV2ViUGFnZUVycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuL0V2ZW50LlR5cGVzXCJcbntcbiAgICBpbnRlcmZhY2UgSUZyb250ZW5kRXZlbnRSZWdpc3RyYXJcbiAgICB7XG4gICAgICAgIEdldElkOiBUSXBjRnJvbnRlbmRFdmVudDxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHsgSWQ6IG51bWJlciB8IHVuZGVmaW5lZDsgfSxcbiAgICAgICAgICAgIEZHZXRJZEVycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBHZXRNb25pdG9yRnJvbUZvY3VzZWRXaW5kb3c6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgeyBNb25pdG9yOiBITW9uaXRvcjsgfSxcbiAgICAgICAgICAgIEZHZXRNb25pdG9yRnJvbUZvY3VzZWRXaW5kb3dFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgR2V0QW5ub3RhdGVkUGFuZWxzOiBUSXBjRnJvbnRlbmRFdmVudDxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHsgQW5ub3RhdGVkUGFuZWxzOiBUQXJyYXk8RkFubm90YXRlZFBhbmVsPiB9LFxuICAgICAgICAgICAgRkdldEFubm90YXRlZFBhbmVsc0Vycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBHZXRDdXJyZW50UGFuZWw6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRlBhbmVsLFxuICAgICAgICAgICAgRkdldEN1cnJlbnRQYW5lbEVycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBHZXRJc0FjdGl2ZVdpbmRvd1RpbGVkOiBUSXBjRnJvbnRlbmRFdmVudDxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHsgSXNUaWxlZDogYm9vbGVhbjsgfSxcbiAgICAgICAgICAgIEZHZXRDdXJyZW50UGFuZWxFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgR2V0SXNMaWdodE1vZGU6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgeyBJc0xpZ2h0TW9kZTogYm9vbGVhbjsgfSxcbiAgICAgICAgICAgIEZHZXRJc0xpZ2h0TW9kZUVycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBVcGRhdGU6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRlVwZGF0ZUVycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBPcGVuV2ViUGFnZTogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICBzdHJpbmcsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBGT3BlbldlYlBhZ2VFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgR2V0SXNFbGV2YXRlZDogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB7IElzRWxldmF0ZWQ6IGJvb2xlYW47IH0sXG4gICAgICAgICAgICBGR2V0SXNFbGV2YXRlZEVycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBBbGxvd0FjdGl2YXRpb246IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRkFsbG93QWN0aXZhdGlvbkVycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBQcmV2ZW50QWN0aXZhdGlvbjogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBGUHJldmVudEFjdGl2YXRpb25FcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgR2V0U3RvcmU6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRlN0b3JlLFxuICAgICAgICAgICAgRkdldFN0b3JlRXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgICAgIFNldFN0b3JlOiBUSXBjRnJvbnRlbmRFdmVudDxcbiAgICAgICAgICAgIEZTdG9yZSxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIEZTZXRTdG9yZUVycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBHZXRUaGVtZUNvbG9yOiBUSXBjRnJvbnRlbmRFdmVudDxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHsgVGhlbWVDb2xvcjogRkhleENvbG9yOyB9LFxuICAgICAgICAgICAgRkdldFRoZW1lQ29sb3JFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgR2V0UGFuZWxTY3JlZW5zaG90czogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB7IFNjcmVlbnNob3RzOiBUQXJyYXk8c3RyaW5nPjsgfSxcbiAgICAgICAgICAgIEZHZXRQYW5lbFNjcmVlbnNob3RzRXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgICAgIEdldEV4dGVybmFsV2luZG93U3RhdGU6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRkV4dGVybmFsV2luZG93LFxuICAgICAgICAgICAgRkdldEV4dGVybmFsV2luZG93U3RhdGVFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgR2V0RmxvYXRpbmdXaW5kb3dTdGF0ZTogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBGRmxvYXRpbmdXaW5kb3csXG4gICAgICAgICAgICBGR2V0RmxvYXRpbmdXaW5kb3dTdGF0ZUVycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBHZXRJbnNlcnRhYmxlV2luZG93RGF0YTogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB7IEluc2VydGFibGVXaW5kb3dEYXRhOiBUQXJyYXk8Rkluc2VydGFibGVXaW5kb3dEYXRhPiB9LFxuICAgICAgICAgICAgRkdldEluc2VydGFibGVXaW5kb3dEYXRhRXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgICAgIExvZzogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICBUQXJyYXk8dW5rbm93bj4sXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBGTG9nRXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgICAgIE1heGltaXplRmxvYXRpbmdXaW5kb3c6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRk1heGltaXplRmxvYXRpbmdXaW5kb3dFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgTWluaW1pemVGbG9hdGluZ1dpbmRvdzogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBGTWluaW1pemVGbG9hdGluZ1dpbmRvd0Vycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBOb3RpZnlSZWFkeTogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBGTm90aWZ5UmVhZHlFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgUmVhZHlGb3JSb3V0ZTogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBGUmVhZHlGb3JSb3V0ZUVycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBSZXN0b3JlRmxvYXRpbmdXaW5kb3c6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRlJlc3RvcmVGbG9hdGluZ1dpbmRvd0Vycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBSZXF1ZXN0UmVzdGFydDogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBGUmVxdWVzdFJlc3RhcnRFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgUmVxdWVzdFRlYXJEb3duOiBUSXBjRnJvbnRlbmRFdmVudDxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIEZSZXF1ZXN0VGVhckRvd25FcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICB9XG5cbiAgICBpbnRlcmZhY2UgSUJhY2tlbmRFdmVudFJlZ2lzdHJhclxuICAgIHtcbiAgICAgICAgQWN0aXZhdGU6IFRJcGNCYWNrZW5kRXZlbnQ8XG4gICAgICAgICAgICBib29sZWFuLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRkFjdGl2YXRlRXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgICAgIFRlYXJEb3duOiBUSXBjQmFja2VuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRlRlYXJEb3duRXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgfVxufTtcbiIsIi8qIEZpbGU6ICAgICAgRXZlbnQuVHlwZXMudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IFRJcGNFdmVudHNCYXNlIH0gZnJvbSBcIi4vRXZlbnRCYXNlLlR5cGVzXCI7XG5cbi8qIGVzbGludC1kaXNhYmxlIEBzdHlsaXN0aWMvYnJhY2Utc3R5bGUsIEB0eXBlc2NyaXB0LWVzbGludC9uby1lbXB0eS1vYmplY3QtdHlwZSAqL1xuXG5leHBvcnQgaW50ZXJmYWNlIElGcm9udGVuZEV2ZW50UmVnaXN0cmFyIHsgfTtcblxuZXhwb3J0IHR5cGUgRklwY0Zyb250ZW5kRXZlbnRzID0gVElwY0V2ZW50c0Jhc2U8SUZyb250ZW5kRXZlbnRSZWdpc3RyYXI+O1xuXG5leHBvcnQgaW50ZXJmYWNlIElCYWNrZW5kRXZlbnRSZWdpc3RyYXIgeyB9O1xuXG5leHBvcnQgdHlwZSBGSXBjQmFja2VuZEV2ZW50cyA9IFRJcGNFdmVudHNCYXNlPElCYWNrZW5kRXZlbnRSZWdpc3RyYXI+O1xuIiwiLyogRmlsZTogICAgICBFdmVudC50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHtcbiAgICBGQmFja2VuZENoYW5uZWxUYWdnZWQsXG4gICAgRkJhY2tlbmRDaGFubmVsVGFnZ2VyLFxuICAgIEZDaGFubmVsVGFnZ2VkLFxuICAgIEZGcm9udGVuZENoYW5uZWxUYWdnZWQsXG4gICAgRkZyb250ZW5kQ2hhbm5lbFRhZ2dlcixcbiAgICBGSXBjQmFja2VuZENoYW5uZWwsXG4gICAgRklwY0NoYW5uZWwsXG4gICAgRklwY0Zyb250ZW5kQ2hhbm5lbCB9IGZyb20gXCIuL0V2ZW50VXRpbGl0eS5UeXBlc1wiO1xuXG5leHBvcnQgY29uc3QgSXNUYWdnZWQgPSAoQ2hhbm5lbDogc3RyaW5nKTogQ2hhbm5lbCBpcyBGQ2hhbm5lbFRhZ2dlZCA9Plxue1xuICAgIGNvbnN0IFNwbGl0OiBBcnJheTxzdHJpbmc+ID0gQ2hhbm5lbC5zcGxpdChcIi1cIik7XG4gICAgaWYgKFNwbGl0Lmxlbmd0aCA9PT0gMilcbiAgICB7XG4gICAgICAgIGNvbnN0IFRhZzogc3RyaW5nID0gU3BsaXRbMF0gfHwgXCJcIjtcbiAgICAgICAgY29uc3QgQ2hhbm5lbE5hbWU6IHN0cmluZyA9IFNwbGl0WzFdIHx8IFwiXCI7XG5cbiAgICAgICAgcmV0dXJuIC9cXGQvLnRlc3QoVGFnKSAmJiAhKC9cXGQvLnRlc3QoQ2hhbm5lbE5hbWUpKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBHZXRVbnRhZ2dlZCA9IChDaGFubmVsOiBzdHJpbmcgfCBzeW1ib2wpOiBzdHJpbmcgPT5cbntcbiAgICBpZiAodHlwZW9mIENoYW5uZWwgPT09IFwic3RyaW5nXCIpXG4gICAge1xuICAgICAgICBpZiAoSXNUYWdnZWQoQ2hhbm5lbCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBDaGFubmVsLnNwbGl0KFwiLVwiKVsxXSB8fCBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIENoYW5uZWw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IFRhZyA9IChXaW5kb3dJZDogbnVtYmVyLCBDaGFubmVsOiBGSXBjQ2hhbm5lbCk6IEZDaGFubmVsVGFnZ2VkID0+XG57XG4gICAgcmV0dXJuIGAkeyBXaW5kb3dJZCB9LSR7IENoYW5uZWwgfWA7XG59O1xuXG5leHBvcnQgY29uc3QgTWFrZVRhZ0Zyb250ZW5kID0gKElkOiBudW1iZXIgfCB1bmRlZmluZWQpOiBGRnJvbnRlbmRDaGFubmVsVGFnZ2VyID0+XG57XG4gICAgcmV0dXJuIChDaGFubmVsOiBGSXBjRnJvbnRlbmRDaGFubmVsKTogRkZyb250ZW5kQ2hhbm5lbFRhZ2dlZCB8IHVuZGVmaW5lZCA9PlxuICAgIHtcbiAgICAgICAgaWYgKElkID09PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gYCR7IElkIH0tJHsgQ2hhbm5lbCB9YDtcbiAgICAgICAgfVxuICAgIH07XG59O1xuXG5leHBvcnQgY29uc3QgTWFrZVRhZ0JhY2tlbmQgPSAoSWQ6IG51bWJlciB8IHVuZGVmaW5lZCk6IEZCYWNrZW5kQ2hhbm5lbFRhZ2dlciA9Plxue1xuICAgIHJldHVybiAoQ2hhbm5lbDogRklwY0JhY2tlbmRDaGFubmVsKTogRkJhY2tlbmRDaGFubmVsVGFnZ2VkIHwgdW5kZWZpbmVkID0+XG4gICAge1xuICAgICAgICBpZiAoSWQgPT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBgJHsgSWQgfS0keyBDaGFubmVsIH1gO1xuICAgICAgICB9XG4gICAgfTtcbn07XG4iLCIvKiBGaWxlOiAgICAgIEV2ZW50LlR5cGVzLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGTm90RnVuY3Rpb24gfSBmcm9tIFwiLi4vLi4vU2hhcmVkL1NoYXJlZC5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBGVW5rbm93bkVycm9yQ29kZSB9IGZyb20gXCIuL0Vycm9yQ29kZXMuVHlwZXNcIjtcblxuZXhwb3J0IHR5cGUgRklwY0V2ZW50SW5pdGlhdG9yID1cbiAgICB8IFwiQmFja2VuZFwiXG4gICAgfCBcIkZyb250ZW5kXCI7XG5cbmV4cG9ydCB0eXBlIEZSaWNoUmVzcG9uc2VEYXRhID0gUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG5cbmV4cG9ydCB0eXBlIFRSaWNoUmVzcG9uc2VTdWNjZXNzPFJlc3BvbnNlRGF0YSBleHRlbmRzIEZSaWNoUmVzcG9uc2VEYXRhPiA9XG57XG4gICAgRGF0YTogUmVzcG9uc2VEYXRhO1xuICAgIEVycm9yOiB1bmRlZmluZWQ7XG59O1xuXG5leHBvcnQgdHlwZSBUUmljaFJlc3BvbnNlRmFpbHVyZTxFcnJvckNvZGUgZXh0ZW5kcyBGVW5rbm93bkVycm9yQ29kZT4gPVxue1xuICAgIERhdGE6IHVuZGVmaW5lZDtcbiAgICBFcnJvcjogRXJyb3JDb2RlO1xufTtcblxuZXhwb3J0IHR5cGUgVFJpY2hSZXNwb25zZURlY2w8XG4gICAgUmVzcG9uc2VQYXlsb2FkIGV4dGVuZHMgRlJpY2hSZXNwb25zZURhdGEsXG4gICAgRXJyb3JDb2RlIGV4dGVuZHMgRlVua25vd25FcnJvckNvZGVcbj4gPVxue1xuICAgIERhdGE6IFJlc3BvbnNlUGF5bG9hZDtcbiAgICBFcnJvcjogRXJyb3JDb2RlO1xufTtcblxuZXhwb3J0IHR5cGUgRlVua25vd25SaWNoUmVzcG9uc2VEZWNsID0gVFJpY2hSZXNwb25zZURlY2w8RlJpY2hSZXNwb25zZURhdGEsIEZVbmtub3duRXJyb3JDb2RlPjtcblxuLyoqIFwiUmljaFwiIHJlZmVycyB0byByZXNwb25zZXMgdGhhdCByZXR1cm4gZGF0YSBpZiB0aGVyZSBpcyBubyBlcnJvci4gKi9cbmV4cG9ydCB0eXBlIFRSaWNoUmVzcG9uc2U8XG4gICAgUmVzcG9uc2VQYXlsb2FkIGV4dGVuZHMgRlJpY2hSZXNwb25zZURhdGEsXG4gICAgRXJyb3JDb2RlIGV4dGVuZHMgRlVua25vd25FcnJvckNvZGVcbj4gPVxuICAgIHwgVFJpY2hSZXNwb25zZVN1Y2Nlc3M8UmVzcG9uc2VQYXlsb2FkPlxuICAgIHwgVFJpY2hSZXNwb25zZUZhaWx1cmU8RXJyb3JDb2RlPjtcblxuZXhwb3J0IHR5cGUgVFBvb3JSZXNwb25zZTxFcnJvckNvZGUgZXh0ZW5kcyBGVW5rbm93bkVycm9yQ29kZT4gPVxue1xuICAgIERhdGE6IHVuZGVmaW5lZDtcbiAgICBFcnJvcjogRXJyb3JDb2RlIHwgdW5kZWZpbmVkO1xufTtcblxuZXhwb3J0IHR5cGUgVFBvb3JSZXNwb25zZURlY2w8RXJyb3JDb2RlIGV4dGVuZHMgRlVua25vd25FcnJvckNvZGU+ID1cbntcbiAgICBFcnJvcjogRXJyb3JDb2RlO1xufTtcblxuZXhwb3J0IHR5cGUgRk5vUmVzcG9uc2VEYXRhID0gdW5kZWZpbmVkO1xuXG5leHBvcnQgdHlwZSBGUmVzcG9uc2VEYXRhID1cbiAgICB8IEZOb1Jlc3BvbnNlRGF0YVxuICAgIHwgRlJpY2hSZXNwb25zZURhdGE7XG5cbmV4cG9ydCB0eXBlIEZVbmtub3duUmljaFJlc3BvbnNlRGF0YSA9IFRSaWNoUmVzcG9uc2U8RlJpY2hSZXNwb25zZURhdGEsIEZVbmtub3duRXJyb3JDb2RlPjtcbmV4cG9ydCB0eXBlIEZVbmtub3duUmljaFJlc3BvbnNlU3VjY2VzcyA9IFRSaWNoUmVzcG9uc2VTdWNjZXNzPEZSaWNoUmVzcG9uc2VEYXRhPjtcbmV4cG9ydCB0eXBlIEZVbmtub3duUmljaFJlc3BvbnNlRmFpbHVyZSA9IFRSaWNoUmVzcG9uc2VGYWlsdXJlPEZVbmtub3duRXJyb3JDb2RlPjtcbmV4cG9ydCB0eXBlIEZVbmtub3duUmljaFJlc3BvbnNlID1cbiAgICB8IEZVbmtub3duUmljaFJlc3BvbnNlU3VjY2Vzc1xuICAgIHwgRlVua25vd25SaWNoUmVzcG9uc2VGYWlsdXJlO1xuXG5leHBvcnQgdHlwZSBUUmVzcG9uc2VEZWNsPFxuICAgIFJlc3BvbnNlUGF5bG9hZCBleHRlbmRzIEZSZXNwb25zZURhdGEsXG4gICAgRXJyb3JDb2RlIGV4dGVuZHMgRlVua25vd25FcnJvckNvZGVcbj4gPVxuICAgIFJlc3BvbnNlUGF5bG9hZCBleHRlbmRzIEZSaWNoUmVzcG9uc2VEYXRhXG4gICAgICAgID8gVFJpY2hSZXNwb25zZURlY2w8UmVzcG9uc2VQYXlsb2FkLCBFcnJvckNvZGU+XG4gICAgICAgIDogVFBvb3JSZXNwb25zZURlY2w8RXJyb3JDb2RlPjtcblxuZXhwb3J0IHR5cGUgVElwY0V2ZW50PFxuICAgIEluaXRpYXRvciBleHRlbmRzIEZJcGNFdmVudEluaXRpYXRvcixcbiAgICBSZXF1ZXN0IGV4dGVuZHMgRk5vdEZ1bmN0aW9uLFxuICAgIFJlc3BvbnNlUGF5bG9hZCBleHRlbmRzIEZSZXNwb25zZURhdGEsXG4gICAgRXJyb3JTdHJpbmcgZXh0ZW5kcyBzdHJpbmdcbj4gPVxue1xuICAgIEluaXRpYXRvcjogSW5pdGlhdG9yO1xuICAgIFJlcXVlc3Q6IFJlcXVlc3Q7XG4gICAgUmVzcG9uc2U6IFRSZXNwb25zZURlY2w8UmVzcG9uc2VQYXlsb2FkLCBFcnJvclN0cmluZz47XG59O1xuXG5leHBvcnQgdHlwZSBGVW5rbm93blJpY2hFdmVudCA9IFRJcGNFdmVudDxcbiAgICBGSXBjRXZlbnRJbml0aWF0b3IsXG4gICAgRk5vdEZ1bmN0aW9uLFxuICAgIEZSaWNoUmVzcG9uc2VEYXRhLFxuICAgIEZVbmtub3duRXJyb3JDb2RlXG4+O1xuXG5leHBvcnQgdHlwZSBGVW5rbm93blBvb3JFdmVudCA9IFRJcGNFdmVudDxcbiAgICBGSXBjRXZlbnRJbml0aWF0b3IsXG4gICAgRk5vdEZ1bmN0aW9uLFxuICAgIEZOb1Jlc3BvbnNlRGF0YSxcbiAgICBGVW5rbm93bkVycm9yQ29kZVxuPjtcblxuZXhwb3J0IHR5cGUgRlVua25vd25JcGNFdmVudCA9XG4gICAgfCBGVW5rbm93blJpY2hFdmVudFxuICAgIHwgRlVua25vd25Qb29yRXZlbnQ7XG5cbmV4cG9ydCB0eXBlIFRJcGNFdmVudHNCYXNlPFJlZ2lzdHJhclR5cGUgPSB1bmtub3duPiA9XG57XG4gICAgWyBLZXkgaW4ga2V5b2YgUmVnaXN0cmFyVHlwZSBhcyBSZWdpc3RyYXJUeXBlW0tleV0gZXh0ZW5kcyBGVW5rbm93bklwY0V2ZW50ID8gS2V5IDogbmV2ZXIgXTogUmVnaXN0cmFyVHlwZVtLZXldO1xufTtcblxuZXhwb3J0IHR5cGUgVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgUmVxdWVzdCBleHRlbmRzIEZOb3RGdW5jdGlvbiA9IEZOb3RGdW5jdGlvbixcbiAgICBSZXNwb25zZSBleHRlbmRzIEZSZXNwb25zZURhdGEgPSBGUmVzcG9uc2VEYXRhLFxuICAgIEVycm9yU3RyaW5nIGV4dGVuZHMgc3RyaW5nID0gc3RyaW5nPiA9XG4gICAgICAgIFRJcGNFdmVudDxcbiAgICAgICAgICAgIFwiRnJvbnRlbmRcIixcbiAgICAgICAgICAgIFJlcXVlc3QsXG4gICAgICAgICAgICBSZXNwb25zZSxcbiAgICAgICAgICAgIEVycm9yU3RyaW5nXG4gICAgICAgID47XG5cbmV4cG9ydCB0eXBlIFRJcGNCYWNrZW5kRXZlbnQ8XG4gICAgUmVxdWVzdCBleHRlbmRzIEZOb3RGdW5jdGlvbixcbiAgICBSZXNwb25zZSBleHRlbmRzIEZSZXNwb25zZURhdGEsXG4gICAgRXJyb3JDb2RlIGV4dGVuZHMgRlVua25vd25FcnJvckNvZGU+ID1cbiAgICAgICAgVElwY0V2ZW50PFxuICAgICAgICAgICAgXCJCYWNrZW5kXCIsXG4gICAgICAgICAgICBSZXF1ZXN0LFxuICAgICAgICAgICAgUmVzcG9uc2UsXG4gICAgICAgICAgICBFcnJvckNvZGVcbiAgICAgICAgPjtcbiIsIi8qIEZpbGU6ICAgICAgRXZlbnRVdGlsaXR5LlR5cGVzLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGSXBjQmFja2VuZEV2ZW50cywgRklwY0Zyb250ZW5kRXZlbnRzIH0gZnJvbSBcIi4vRXZlbnQuVHlwZXNcIjtcbmltcG9ydCB0eXBlIHtcbiAgICBGUmljaFJlc3BvbnNlRGF0YSxcbiAgICBGVW5rbm93bklwY0V2ZW50LFxuICAgIEZVbmtub3duUmljaFJlc3BvbnNlRGVjbCxcbiAgICBUSXBjRXZlbnRzQmFzZSxcbiAgICBUUG9vclJlc3BvbnNlLFxuICAgIFRQb29yUmVzcG9uc2VEZWNsLFxuICAgIFRSaWNoUmVzcG9uc2UsXG4gICAgVFJpY2hSZXNwb25zZURlY2wsXG4gICAgVFJpY2hSZXNwb25zZUZhaWx1cmUsXG4gICAgVFJpY2hSZXNwb25zZVN1Y2Nlc3MgfSBmcm9tIFwiLi9FdmVudEJhc2UuVHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgRlVua25vd25FcnJvckNvZGUgfSBmcm9tIFwiLi9FcnJvckNvZGVzLlR5cGVzXCI7XG5cbmV4cG9ydCB0eXBlIEZJcGNCYWNrZW5kQ2hhbm5lbCA9IGtleW9mIEZJcGNCYWNrZW5kRXZlbnRzO1xuXG5leHBvcnQgdHlwZSBGSXBjRXZlbnRzID0gRklwY0Zyb250ZW5kRXZlbnRzICYgRklwY0JhY2tlbmRFdmVudHM7XG5cbmV4cG9ydCB0eXBlIEZJcGNDaGFubmVsID0ga2V5b2YgRklwY0V2ZW50cztcblxuZXhwb3J0IHR5cGUgRklwY0Zyb250ZW5kQ2hhbm5lbCA9IGtleW9mIEZJcGNGcm9udGVuZEV2ZW50cztcblxuZXhwb3J0IHR5cGUgVFJlcXVlc3Q8VHlwZSBleHRlbmRzIEZJcGNDaGFubmVsPiA9IEZJcGNFdmVudHNbVHlwZV1bXCJSZXF1ZXN0XCJdO1xuZXhwb3J0IHR5cGUgVFJlc3BvbnNlPFR5cGUgZXh0ZW5kcyBGSXBjQ2hhbm5lbD4gPSBGSXBjRXZlbnRzW1R5cGVdW1wiUmVzcG9uc2VcIl07XG5cbi8qKiBNYXBzIGV2ZW50cyB0aGF0IGRvICpub3QqIGhhdmUgcmVzcG9uc2VzIHRvIGBuZXZlcmAuICovXG5leHBvcnQgdHlwZSBURXZlbnRIYXNSZXNwb25zZTxUeXBlIGV4dGVuZHMgRlVua25vd25JcGNFdmVudD4gPSBcIkRhdGFcIiBleHRlbmRzIGtleW9mIFR5cGVbXCJSZXNwb25zZVwiXVxuICAgID8gVHlwZVxuICAgIDogbmV2ZXI7XG5cbi8vIC8qKiBGaWx0ZXJzIG91dCBldmVudHMgdGhhdCBkbyBub3QgaGF2ZSBhIHJlc3BvbnNlLiAqL1xuLy8gZXhwb3J0IHR5cGUgVFJpY2hFdmVudHM8VHlwZSBleHRlbmRzIFRJcGNFdmVudHNCYXNlPiA9XG4vLyB7XG4vLyAgICAgWyBLZXkgaW4ga2V5b2YgVCBhcyB1bmRlZmluZWQgZXh0ZW5kcyBUeXBlW0tleV1bXCJSZXNwb25zZVwiXVtcIkRhdGFcIl0gPyBLZXkgOiBuZXZlciBdOiBUeXBlW0tleV07XG4vLyB9O1xuXG4vLyBleHBvcnQgdHlwZSBUUmljaEV2ZW50czxUeXBlIGV4dGVuZHMgVElwY0V2ZW50c0Jhc2U+ID1cbi8vIHtcbi8vICAgICBbIEtleSBpbiBrZXlvZiBUIGFzIFwiRGF0YVwiIGV4dGVuZHMga2V5b2YgVHlwZVtLZXldW1wiUmVzcG9uc2VcIl0gPyBLZXkgOiBuZXZlciBdOiBUeXBlW0tleV07XG4vLyB9O1xuXG4vLyBleHBvcnQgdHlwZSBUUmljaEV2ZW50czxUeXBlIGV4dGVuZHMgVElwY0V2ZW50c0Jhc2U+ID1cbi8vIHtcbi8vICAgICAvKiBlc2xpbnQtZGlzYWJsZSBAc3R5bGlzdGljL2luZGVudCAqL1xuLy8gICAgIFtcbi8vICAgICAgICAgS2V5IGluIGtleW9mIFQgYXNcbi8vICAgICAgICAgICAgIFwiRGF0YVwiIGV4dGVuZHMga2V5b2YgVHlwZVtLZXldW1wiUmVzcG9uc2VcIl1cbi8vICAgICAgICAgICAgICAgICA/ICggWyBUeXBlW0tleV1bXCJSZXNwb25zZVwiXVtcIkRhdGFcIl0gXSBleHRlbmRzIFsgdW5kZWZpbmVkIF0gPyBuZXZlciA6IEtleSApXG4vLyAgICAgICAgICAgICAgICAgOiBuZXZlclxuLy8gICAgIF06IFR5cGVbS2V5XTtcbi8vICAgICAvKiBlc2xpbnQtZW5hYmxlIEBzdHlsaXN0aWMvaW5kZW50ICovXG4vLyB9O1xuXG5pbnRlcmZhY2UgSUhhc1Jlc3BvbnNlXG57XG4gICAgUmVzcG9uc2U6IHVua25vd247XG59XG5cbmV4cG9ydCB0eXBlIFRQb29yRXZlbnRzPFR5cGUgZXh0ZW5kcyBUSXBjRXZlbnRzQmFzZT4gPVxue1xuICAgIFsgS2V5IGluIGtleW9mIFR5cGUgYXMgXCJEYXRhXCIgZXh0ZW5kcyBrZXlvZiBFeHRyYWN0PFR5cGVbS2V5XSwgSUhhc1Jlc3BvbnNlPltcIlJlc3BvbnNlXCJdXG4gICAgICAgID8gbmV2ZXJcbiAgICAgICAgOiBLZXlcbiAgICBdOiBUeXBlW0tleV07XG59O1xuXG5leHBvcnQgdHlwZSBUUmljaEV2ZW50RGVjbDxUeXBlIGV4dGVuZHMgRlVua25vd25JcGNFdmVudD4gPVxuICAgIFR5cGVbXCJSZXNwb25zZVwiXSBleHRlbmRzIEZVbmtub3duUmljaFJlc3BvbnNlRGVjbFxuICAgICAgICA/IFR5cGVcbiAgICAgICAgOiBuZXZlcjtcblxuZXhwb3J0IHR5cGUgVFJpY2hGcm9udGVuZEV2ZW50UmVzcG9uc2VEYXRhPFR5cGUgZXh0ZW5kcyBrZXlvZiBGUmljaEZyb250ZW5kRXZlbnRzPiA9XG4gICAgRXhjbHVkZTxGSXBjRnJvbnRlbmRFdmVudHNbVHlwZV1bXCJSZXNwb25zZVwiXVtcIkRhdGFcIl0sIHVuZGVmaW5lZD47XG5cbmV4cG9ydCB0eXBlIFRSaWNoRXZlbnREYXRhT3JVbmRlZmluZWQ8VHlwZSBleHRlbmRzIEZVbmtub3duSXBjRXZlbnQ+ID1cbiAgICBcIkRhdGFcIiBleHRlbmRzIGtleW9mIFR5cGVbXCJSZXNwb25zZVwiXVxuICAgICAgICA/IFR5cGVbXCJSZXNwb25zZVwiXVtcIkRhdGFcIl1cbiAgICAgICAgOiB1bmRlZmluZWQ7XG5cbmV4cG9ydCB0eXBlIFRQb29yRXZlbnQ8VHlwZSBleHRlbmRzIEZVbmtub3duSXBjRXZlbnQ+ID1cbiAgICBcIkRhdGFcIiBleHRlbmRzIGtleW9mIFR5cGVbXCJSZXNwb25zZVwiXVxuICAgICAgICA/IG5ldmVyXG4gICAgICAgIDogVHlwZTtcblxudHlwZSBUUmljaEV2ZW50c0ludGVybWVkaWF0ZTxUeXBlIGV4dGVuZHMgVElwY0V2ZW50c0Jhc2U+ID1cbntcbiAgICBbIEtleSBpbiBrZXlvZiBUeXBlIF06IFRSaWNoRXZlbnREZWNsPEV4dHJhY3Q8VHlwZVtLZXldLCBGVW5rbm93bklwY0V2ZW50Pj47XG59O1xuXG5leHBvcnQgdHlwZSBUUmljaEV2ZW50czxUeXBlIGV4dGVuZHMgVElwY0V2ZW50c0Jhc2U+ID1cbntcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBAc3R5bGlzdGljL2luZGVudCAqL1xuICAgIFtcbiAgICAgICAgS2V5IGluIGtleW9mIFRSaWNoRXZlbnRzSW50ZXJtZWRpYXRlPFR5cGU+IGFzXG4gICAgICAgIFRSaWNoRXZlbnRzSW50ZXJtZWRpYXRlPFR5cGU+W0tleV0gZXh0ZW5kcyBuZXZlclxuICAgICAgICAgICAgPyBuZXZlclxuICAgICAgICAgICAgOiBLZXlcbiAgICBdOiBUeXBlW0tleV07XG4gICAgLyogZXNsaW50LWVuYWJsZSBAc3R5bGlzdGljL2luZGVudCAqL1xufTtcbi8vICAgICBbIEtleSBpbiBrZXlvZiBUIGFzIHVuZGVmaW5lZCBleHRlbmRzIFR5cGVbS2V5XVtcIlJlc3BvbnNlXCJdW1wiRGF0YVwiXSA/IEtleSA6IG5ldmVyIF06IFR5cGVbS2V5XTtcblxuZXhwb3J0IHR5cGUgRlJpY2hCYWNrZW5kRXZlbnRzID0gVFJpY2hFdmVudHM8RklwY0JhY2tlbmRFdmVudHM+O1xuZXhwb3J0IHR5cGUgRlJpY2hGcm9udGVuZEV2ZW50cyA9IFRSaWNoRXZlbnRzPEZJcGNGcm9udGVuZEV2ZW50cz47XG5leHBvcnQgdHlwZSBGUmljaEV2ZW50cyA9IEZSaWNoQmFja2VuZEV2ZW50cyAmIEZSaWNoRnJvbnRlbmRFdmVudHM7XG5cbmV4cG9ydCB0eXBlIFRHZXRSaWNoUmVzcG9uc2U8XG4gICAgVHlwZSBleHRlbmRzIFRSaWNoUmVzcG9uc2VEZWNsPEZSaWNoUmVzcG9uc2VEYXRhLCBGVW5rbm93bkVycm9yQ29kZT5cbj4gPSBUUmljaFJlc3BvbnNlPFR5cGVbXCJEYXRhXCJdLCBUeXBlW1wiRXJyb3JcIl0+O1xuXG5leHBvcnQgdHlwZSBUR2V0UmljaFJlc3BvbnNlRnJvbUtleTxUeXBlIGV4dGVuZHMga2V5b2YgRlJpY2hFdmVudHM+ID1cbiAgICBUR2V0UmljaFJlc3BvbnNlPEZSaWNoRXZlbnRzW1R5cGVdW1wiUmVzcG9uc2VcIl0+O1xuXG5leHBvcnQgdHlwZSBUR2V0UmljaFJlc3BvbnNlQXNTdWNjZXNzPFR5cGUgZXh0ZW5kcyBrZXlvZiBGUmljaEV2ZW50cz4gPVxuICAgIFRSaWNoUmVzcG9uc2VTdWNjZXNzPE5vbk51bGxhYmxlPEZSaWNoRXZlbnRzW1R5cGVdW1wiUmVzcG9uc2VcIl1bXCJEYXRhXCJdPj47XG5cbmV4cG9ydCB0eXBlIFRHZXREZWZhdWx0UmljaFJlc3BvbnNlRGF0YTxUeXBlIGV4dGVuZHMga2V5b2YgRlJpY2hFdmVudHM+ID1cbiAgICBUR2V0UmljaFJlc3BvbnNlQXNTdWNjZXNzPFR5cGU+W1wiRGF0YVwiXTtcblxuZXhwb3J0IHR5cGUgVEdldFJpY2hSZXNwb25zZUFzRmFpbHVyZTxUeXBlIGV4dGVuZHMga2V5b2YgRlJpY2hFdmVudHM+ID1cbiAgICBUUmljaFJlc3BvbnNlRmFpbHVyZTxOb25OdWxsYWJsZTxGUmljaEV2ZW50c1tUeXBlXVtcIlJlc3BvbnNlXCJdW1wiRXJyb3JcIl0+PjtcblxuZXhwb3J0IHR5cGUgRlBvb3JFdmVudHMgPSBGUG9vckJhY2tlbmRFdmVudHMgJiBGUG9vckZyb250ZW5kRXZlbnRzO1xuXG4vLyBleHBvcnQgdHlwZSBUR2V0UG9vclJlc3BvbnNlPFR5cGUgZXh0ZW5kcyBUUG9vclJlc3BvbnNlRGVjbDxGVW5rbm93bkVycm9yQ29kZT4+ID1cbi8vICAgICBUUG9vclJlc3BvbnNlPFR5cGVbXCJFcnJvclwiXT47XG5leHBvcnQgdHlwZSBGUG9vclJlc3BvbnNlQXNTdWNjZXNzID1cbntcbiAgICBEYXRhOiB1bmRlZmluZWQ7XG4gICAgRXJyb3I6IHVuZGVmaW5lZDtcbn07XG5cbi8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnMgKi9cbmV4cG9ydCB0eXBlIFRQb29yUmVzcG9uc2VBc1N1Y2Nlc3M8VHlwZSBleHRlbmRzIGtleW9mIEZQb29yRXZlbnRzPiA9XG57XG4gICAgRGF0YTogdW5kZWZpbmVkO1xuICAgIEVycm9yOiB1bmRlZmluZWQ7XG59O1xuXG5leHBvcnQgdHlwZSBUUG9vclJlc3BvbnNlQXNGYWlsdXJlPFR5cGUgZXh0ZW5kcyBrZXlvZiBGUG9vckV2ZW50cz4gPVxue1xuICAgIERhdGE6IHVuZGVmaW5lZDtcbiAgICBFcnJvcjogVEdldEVycm9yQ29kZTxUeXBlPjtcbn07XG5cbmV4cG9ydCB0eXBlIFRHZXRQb29yUmVzcG9uc2U8VHlwZSBleHRlbmRzIFRQb29yUmVzcG9uc2VEZWNsPEZVbmtub3duRXJyb3JDb2RlPj4gPVxuICAgIFRQb29yUmVzcG9uc2U8VHlwZVtcIkVycm9yXCJdPjtcblxuZXhwb3J0IHR5cGUgVEdldFBvb3JSZXNwb25zZUZyb21LZXk8VHlwZSBleHRlbmRzIGtleW9mIEZQb29yRXZlbnRzPiA9XG4gICAgVEdldFBvb3JSZXNwb25zZTxGUG9vckV2ZW50c1tUeXBlXVtcIlJlc3BvbnNlXCJdPjtcblxuZXhwb3J0IHR5cGUgVEdldEVycm9yQ29kZTxUeXBlIGV4dGVuZHMga2V5b2YgRklwY0V2ZW50cz4gPSBGSXBjRXZlbnRzW1R5cGVdW1wiUmVzcG9uc2VcIl1bXCJFcnJvclwiXSB8IFwiXCI7XG5cbmV4cG9ydCB0eXBlIFRHZXRSZXNwb25zZTxcbiAgICBUeXBlIGV4dGVuZHNcbiAgICAgICAgfCBUUmljaFJlc3BvbnNlRGVjbDxGUmljaFJlc3BvbnNlRGF0YSwgRlVua25vd25FcnJvckNvZGU+XG4gICAgICAgIHwgVFBvb3JSZXNwb25zZURlY2w8RlVua25vd25FcnJvckNvZGU+XG4+ID1cbiAgICBUeXBlIGV4dGVuZHMgVFJpY2hSZXNwb25zZURlY2w8RlJpY2hSZXNwb25zZURhdGEsIEZVbmtub3duRXJyb3JDb2RlPlxuICAgICAgICA/IFRHZXRSaWNoUmVzcG9uc2U8VHlwZT5cbiAgICAgICAgOiBUeXBlIGV4dGVuZHMgVFBvb3JSZXNwb25zZURlY2w8RlVua25vd25FcnJvckNvZGU+XG4gICAgICAgICAgICA/IFRHZXRQb29yUmVzcG9uc2U8VHlwZT5cbiAgICAgICAgICAgIDogbmV2ZXI7XG5cbmV4cG9ydCB0eXBlIFRHZXRSZXNwb25zZUZyb21LZXk8VHlwZSBleHRlbmRzIGtleW9mIEZJcGNFdmVudHM+ID1cbiAgICBUeXBlIGV4dGVuZHMga2V5b2YgRlJpY2hFdmVudHNcbiAgICAgICAgPyBUR2V0UmljaFJlc3BvbnNlPEZJcGNFdmVudHNbVHlwZV1bXCJSZXNwb25zZVwiXT5cbiAgICAgICAgOiBUeXBlIGV4dGVuZHMga2V5b2YgRlBvb3JFdmVudHNcbiAgICAgICAgICAgID8gVEdldFBvb3JSZXNwb25zZTxGSXBjRXZlbnRzW1R5cGVdW1wiUmVzcG9uc2VcIl0+XG4gICAgICAgICAgICA6IG5ldmVyO1xuXG5leHBvcnQgdHlwZSBGUG9vckJhY2tlbmRFdmVudHMgPSBUUG9vckV2ZW50czxGSXBjQmFja2VuZEV2ZW50cz47XG5leHBvcnQgdHlwZSBGUG9vckZyb250ZW5kRXZlbnRzID0gVFBvb3JFdmVudHM8RklwY0Zyb250ZW5kRXZlbnRzPjtcblxuLyoqIEEgY2FsbGJhY2sgdG8gcmVzcG9uZCB0byBhIHJlY2VpdmVkIGV2ZW50LiAqL1xuZXhwb3J0IHR5cGUgVEV2ZW50Q2FsbGJhY2s8VHlwZSBleHRlbmRzIGtleW9mIEZJcGNFdmVudHM+ID0gKFxuICAgIFJlc3BvbnNlOiBGSXBjRXZlbnRzW1R5cGVdW1wiUmVxdWVzdFwiXVxuKSA9PiBQcm9taXNlPFRHZXRSZXNwb25zZTxGSXBjRXZlbnRzW1R5cGVdW1wiUmVzcG9uc2VcIl0+PjtcblxudHlwZSBUSXNVbmlvbjxUeXBlLCBPcmlnaW5hbCA9IFR5cGU+ID1cbiAgICBUeXBlIGV4dGVuZHMgdW5rbm93blxuICAgICAgICA/IChbIE9yaWdpbmFsIF0gZXh0ZW5kcyBbIFR5cGUgXSA/IGZhbHNlIDogdHJ1ZSlcbiAgICAgICAgOiBmYWxzZTtcblxudHlwZSBUSGFzRXhhY3RseU9uZUtleTxUeXBlPiA9XG4gICAgVHlwZSBleHRlbmRzIFJlY29yZDxQcm9wZXJ0eUtleSwgdW5rbm93bj5cbiAgICAgICAgPyAoWyBrZXlvZiBUeXBlIF0gZXh0ZW5kcyBbIG5ldmVyIF1cbiAgICAgICAgICAgID8gZmFsc2VcbiAgICAgICAgICAgIDogKCBUSXNVbmlvbjxrZXlvZiBUeXBlPiBleHRlbmRzIHRydWUgPyBmYWxzZSA6IHRydWUgKVxuICAgICAgICApXG4gICAgICAgIDogZmFsc2U7XG5cbi8qKiBUaGUgcmljaCBmcm9udGVuZCBldmVudHMgd2hvc2UgcmVzcGVjdGl2ZSBgRGF0YWAgcHJvcGVydGllcyBoYXZlIGV4YWN0bHkgb25lIHByb3BlcnR5LiAqL1xuZXhwb3J0IHR5cGUgRlNpbmdsZVJpY2hGcm9udGVuZENoYW5uZWxzID1cbntcbiAgICBbIEtleSBpbiBrZXlvZiBGUmljaEZyb250ZW5kRXZlbnRzIF0tPzpcbiAgICBUSGFzRXhhY3RseU9uZUtleTxGUmljaEZyb250ZW5kRXZlbnRzW0tleV1bXCJSZXNwb25zZVwiXVtcIkRhdGFcIl0+IGV4dGVuZHMgdHJ1ZVxuICAgICAgICA/IEtleVxuICAgICAgICA6IG5ldmVyXG59W2tleW9mIEZSaWNoRnJvbnRlbmRFdmVudHNdO1xuXG50eXBlIFRHZXRWYWx1ZU9mU2luZ2xlUHJvcGVydHlSZWNvcmQ8VHlwZSBleHRlbmRzIFJlY29yZDxQcm9wZXJ0eUtleSwgdW5rbm93bj4+ID1cbiAgICBrZXlvZiBUeXBlIGV4dGVuZHMgaW5mZXIgS2V5XG4gICAgICAgID8gS2V5IGV4dGVuZHMgUHJvcGVydHlLZXlcbiAgICAgICAgICAgID8gVHlwZVtLZXldXG4gICAgICAgICAgICA6IG5ldmVyXG4gICAgICAgIDogbmV2ZXI7XG5cbmV4cG9ydCB0eXBlIEZTaW5nbGVSaWNoRnJvbnRlbmRFdmVudHMgPSBQaWNrPEZSaWNoRnJvbnRlbmRFdmVudHMsIEZTaW5nbGVSaWNoRnJvbnRlbmRDaGFubmVscz47XG5cbmV4cG9ydCB0eXBlIFRHZXRTaW5nbGVSaWNoUmVzcG9uc2VEYXRhPFR5cGUgZXh0ZW5kcyBGU2luZ2xlUmljaEZyb250ZW5kQ2hhbm5lbHM+ID1cbiAgICBUR2V0VmFsdWVPZlNpbmdsZVByb3BlcnR5UmVjb3JkPEZTaW5nbGVSaWNoRnJvbnRlbmRFdmVudHNbVHlwZV1bXCJSZXNwb25zZVwiXVtcIkRhdGFcIl0+O1xuXG50eXBlIFRDaGFubmVsVGFnZ2VkQmFzZTxDaGFubmVsVHlwZSBleHRlbmRzIHN0cmluZyA9IHN0cmluZz4gPSBgJHsgbnVtYmVyIH0tJHsgQ2hhbm5lbFR5cGUgfWA7XG5cbmV4cG9ydCB0eXBlIFRCYWNrZW5kQ2hhbm5lbFRhZ2dlZDxDaGFubmVsVHlwZSBleHRlbmRzIEZJcGNCYWNrZW5kQ2hhbm5lbD4gPSBUQ2hhbm5lbFRhZ2dlZEJhc2U8Q2hhbm5lbFR5cGU+O1xuZXhwb3J0IHR5cGUgVEZyb250ZW5kQ2hhbm5lbFRhZ2dlZDxDaGFubmVsVHlwZSBleHRlbmRzIEZJcGNGcm9udGVuZENoYW5uZWw+ID0gVENoYW5uZWxUYWdnZWRCYXNlPENoYW5uZWxUeXBlPjtcbmV4cG9ydCB0eXBlIFRDaGFubmVsVGFnZ2VkPENoYW5uZWxUeXBlIGV4dGVuZHMgRklwY0NoYW5uZWw+ID1cbiAgICBDaGFubmVsVHlwZSBleHRlbmRzIEZJcGNCYWNrZW5kQ2hhbm5lbFxuICAgICAgICA/IFRCYWNrZW5kQ2hhbm5lbFRhZ2dlZDxDaGFubmVsVHlwZT5cbiAgICAgICAgOiBDaGFubmVsVHlwZSBleHRlbmRzIEZJcGNGcm9udGVuZENoYW5uZWxcbiAgICAgICAgICAgID8gVEZyb250ZW5kQ2hhbm5lbFRhZ2dlZDxDaGFubmVsVHlwZT5cbiAgICAgICAgICAgIDogbmV2ZXI7XG5cbmV4cG9ydCB0eXBlIEZCYWNrZW5kQ2hhbm5lbFRhZ2dlZCA9IFRCYWNrZW5kQ2hhbm5lbFRhZ2dlZDxGSXBjQmFja2VuZENoYW5uZWw+O1xuZXhwb3J0IHR5cGUgRkZyb250ZW5kQ2hhbm5lbFRhZ2dlZCA9IFRGcm9udGVuZENoYW5uZWxUYWdnZWQ8RklwY0Zyb250ZW5kQ2hhbm5lbD47XG5leHBvcnQgdHlwZSBGQ2hhbm5lbFRhZ2dlZCA9IFRDaGFubmVsVGFnZ2VkPEZJcGNDaGFubmVsPjtcblxuZXhwb3J0IHR5cGUgRkJhY2tlbmRDaGFubmVsVGFnZ2VyID0gKENoYW5uZWw6IEZJcGNCYWNrZW5kQ2hhbm5lbCkgPT4gRkJhY2tlbmRDaGFubmVsVGFnZ2VkIHwgdW5kZWZpbmVkO1xuZXhwb3J0IHR5cGUgRkZyb250ZW5kQ2hhbm5lbFRhZ2dlciA9IChDaGFubmVsOiBGSXBjRnJvbnRlbmRDaGFubmVsKSA9PiBGRnJvbnRlbmRDaGFubmVsVGFnZ2VkIHwgdW5kZWZpbmVkO1xuIiwiLyogRmlsZTogICAgICBUcmFuc2FjdGlvbnMudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqIENvbW1lbnQ6ICAgRGVmaW5lIHR5cGVzIHVzZWQgaW4gYEV2ZW50LlR5cGVzLnRzYCB0aGF0XG4gKiAgICAgICAgICAgIGRvIG5vdCBvdGhlcndpc2UgaGF2ZSBhIGdvb2QgcGxhY2UgdG8gZ28uXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGRm9jdXNDaGFuZ2UgfSBmcm9tIFwiLi4vVHJlZS5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBURXZlbnRFcnJvckNvZGUgfSBmcm9tIFwiLi9FcnJvckNvZGVzLlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IFRJcGNGcm9udGVuZEV2ZW50IH0gZnJvbSBcIi4vRXZlbnRCYXNlLlR5cGVzXCI7XG5cbmV4cG9ydCB0eXBlIEZXaW5kb3dGb2N1c0RhdGEgPVxue1xuICAgIEZvY3VzZWRXaW5kb3dUaXRsZTogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgRlBhbmVsRm9jdXNEYXRhID1cbntcbiAgICBOdW1WZXJ0aWNlczogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgRkZvY3VzRGF0YUJhc2UgPVxue1xuICAgIENhbk1vdmVXaXRoaW5QYW5lbDogYm9vbGVhbjtcbiAgICBDYW5TdGVwVXA6IGJvb2xlYW47XG4gICAgQ2FuU3RlcERvd246IGJvb2xlYW47XG4gICAgRGlyZWN0aW9uOiBcIkhvcml6b250YWxcIiB8IFwiVmVydGljYWxcIjtcbn07XG5cbmV4cG9ydCB0eXBlIEZGb2N1c0RhdGEgPVxuICAgIEZGb2N1c0RhdGFCYXNlICZcbiAgICAoXG4gICAgICAgIHwgRldpbmRvd0ZvY3VzRGF0YVxuICAgICAgICB8IEZQYW5lbEZvY3VzRGF0YVxuICAgICk7XG5cbmV4cG9ydCB0eXBlIEZPbkNoYW5nZUZvY3VzRXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuXG5leHBvcnQgdHlwZSBGR2V0Rm9jdXNEYXRhRXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFxuICAgIHwgXCJDdXJyZW50UGFuZWxVbmRlZmluZWRcIlxuICAgIHwgXCJGb2N1c2VkVmVydGV4VW5kZWZpbmVkXCJcbj47XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi9FdmVudC5UeXBlc1wiXG57XG4gICAgaW50ZXJmYWNlIElGcm9udGVuZEV2ZW50UmVnaXN0cmFyXG4gICAge1xuICAgICAgICBHZXRGb2N1c0RhdGE6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRkZvY3VzRGF0YSxcbiAgICAgICAgICAgIEZHZXRGb2N1c0RhdGFFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgT25DaGFuZ2VGb2N1czogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICBGRm9jdXNDaGFuZ2UsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBGT25DaGFuZ2VGb2N1c0Vycm9yQ29kZVxuICAgICAgICA+O1xuICAgIH1cbn1cbiIsIi8qIEZpbGU6ICAgICAgSW5zZXJ0RXZlbnQuVHlwZXMudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEhXaW5kb3cgfSBmcm9tIFwiQHNvcnJlbGx3bS93aW5kb3dzXCI7XG5cbi8qKlxuICogV2hlbiBhIG5ldyB2ZXJ0ZXggaXMgY3JlYXRlZCB3aXRoaW4gYSBwYW5lbCwgaG93IHNob3VsZCBpdHMgc2l6ZVxuICogYmUgZGV0ZXJtaW5lZCwgYXMgd2VsbCBhcyB0aGUgc2l6ZSBvZiB0aGUgY3VycmVudCB2ZXJ0aWNlcz9cbiAqL1xuZXhwb3J0IHR5cGUgRkluc2VydFNpemluZ01ldGhvZCA9XG4gICAgfCBcIkJpc2VjdGlvblwiXG4gICAgfCBcIlVuaWZvcm1SZXNpemVcIjtcblxuZXhwb3J0IHR5cGUgRkluc2VydGFibGVXaW5kb3dEYXRhID1cbntcbiAgICBIYW5kbGU6IEhXaW5kb3c7XG4gICAgSWNvbjogc3RyaW5nO1xuICAgIFRpdGxlOiBzdHJpbmc7XG59O1xuIiwiLyogRmlsZTogICAgICBNb3ZlLlR5cGVzLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGQXhpcyB9IGZyb20gXCIuLi8uLi9TaGFyZWQvU2hhcmVkLlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IFRFdmVudEVycm9yQ29kZSB9IGZyb20gXCIuL0Vycm9yQ29kZXMuVHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgVElwY0Zyb250ZW5kRXZlbnQgfSBmcm9tIFwiLi9FdmVudEJhc2UuVHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgRkZvY3VzRGF0YUJhc2UgfSBmcm9tIFwiLi9Gb2N1cy5UeXBlc1wiO1xuXG5leHBvcnQgdHlwZSBGVHJhbnNsYXRpb24gPVxue1xuICAgIERpcmVjdGlvbjogRkF4aXM7XG4gICAgRGlzdGFuY2U6IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIEZQYW5lbFN0ZXAgPVxuICAgIHwgXCJVcFwiXG4gICAgfCBcIkRvd25cIlxuICAgIHwgXCJOZXh0XCJcbiAgICB8IFwiUHJldmlvdXNcIjtcblxuZXhwb3J0IHR5cGUgRlRpbGVkTW92ZURhdGEgPSBPbWl0PEZGb2N1c0RhdGFCYXNlLCBcIkNhbk1vdmVXaXRoaW5QYW5lbFwiPjtcblxuZXhwb3J0IHR5cGUgRlRpbGVkTW92ZVRyYW5zYWN0aW9uID1cbntcbiAgICBTdGVwOiBGUGFuZWxTdGVwO1xufTtcblxuZXhwb3J0IHR5cGUgRlRpbGVkTW92ZVJlc3VsdCA9XG57XG4gICAgSXNPblBhbmVsOiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgRk1vdmVGbG9hdGluZ1dpbmRvd0Vycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuL0V2ZW50LlR5cGVzXCJcbntcbiAgICBpbnRlcmZhY2UgSUZyb250ZW5kRXZlbnRSZWdpc3RyYXJcbiAgICB7XG4gICAgICAgIE1vdmVGbG9hdGluZ1dpbmRvdzogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICBGVHJhbnNsYXRpb24sXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBGTW92ZUZsb2F0aW5nV2luZG93RXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgICAgIE1vdmVUaWxlZFdpbmRvdzogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICBGVGlsZWRNb3ZlVHJhbnNhY3Rpb24sXG4gICAgICAgICAgICBGVGlsZWRNb3ZlUmVzdWx0LFxuICAgICAgICAgICAgRk1vdmVGbG9hdGluZ1dpbmRvd0Vycm9yQ29kZVxuICAgICAgICA+O1xuICAgIH1cbn07XG4iLCIvKiBGaWxlOiAgICAgIE5hdmlnYXRlLlR5cGVzLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBURXZlbnRFcnJvckNvZGUgfSBmcm9tIFwiLi9FcnJvckNvZGVzLlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IFRJcGNCYWNrZW5kRXZlbnQgfSBmcm9tIFwiLi9FdmVudEJhc2UuVHlwZXNcIjtcblxuZXhwb3J0IHR5cGUgRk5hdmlnYXRlUmVxdWVzdCA9XG57XG4gICAgUm91dGU6IHN0cmluZztcbiAgICBTdGF0ZT86IFJlY29yZDxQcm9wZXJ0eUtleSwgdW5rbm93bj47XG59O1xuXG5leHBvcnQgdHlwZSBGTmF2aWdhdGVFcnJvckNvZGUgPSBURXZlbnRFcnJvckNvZGU8XCJcIj47XG5cbmRlY2xhcmUgbW9kdWxlIFwiLi9FdmVudC5UeXBlc1wiXG57XG4gICAgaW50ZXJmYWNlIElCYWNrZW5kRXZlbnRSZWdpc3RyYXJcbiAgICB7XG4gICAgICAgIE5hdmlnYXRlOiBUSXBjQmFja2VuZEV2ZW50PFxuICAgICAgICAgICAgRk5hdmlnYXRlUmVxdWVzdCxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIEZOYXZpZ2F0ZUVycm9yQ29kZVxuICAgICAgICA+O1xuXG4gICAgfVxufTtcbiIsIi8qIEZpbGU6ICAgICAgU2V0dGluZ3MuVHlwZXMudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZFeHRlcm5hbFNldHRpbmcsIEZTZXR0aW5ncyB9IGZyb20gXCIuLi9TZXR0aW5nc1wiO1xuaW1wb3J0IHR5cGUgeyBURXZlbnRFcnJvckNvZGUgfSBmcm9tIFwiLi9FcnJvckNvZGVzLlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IFRJcGNGcm9udGVuZEV2ZW50IH0gZnJvbSBcIi4vRXZlbnRCYXNlLlR5cGVzXCI7XG5cbmV4cG9ydCB0eXBlIEZVcGRhdGVTdGF0dXMgPVxue1xuICAgIEF2YWlsYWJsZVZlcnNpb246IHN0cmluZyB8IHVuZGVmaW5lZDtcbn07XG5cbmV4cG9ydCB0eXBlIEZVcGRhdGVTZXR0aW5nc0Vycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcbmV4cG9ydCB0eXBlIEZHZXRTZXR0aW5nc0Vycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcbmV4cG9ydCB0eXBlIEZHZXRTZXR0aW5nRXJyb3JDb2RlID0gVEV2ZW50RXJyb3JDb2RlPFwiXCI+O1xuZXhwb3J0IHR5cGUgRkNoZWNrRm9yVXBkYXRlc0Vycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcbmV4cG9ydCB0eXBlIEZHZXRFeHRlcm5hbFNldHRpbmdTdGF0ZUVycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuL0V2ZW50LlR5cGVzXCJcbntcbiAgICBpbnRlcmZhY2UgSUZyb250ZW5kRXZlbnRSZWdpc3RyYXJcbiAgICB7XG4gICAgICAgIEdldEV4dGVybmFsU2V0dGluZ1N0YXRlOiBUSXBjRnJvbnRlbmRFdmVudDxcbiAgICAgICAgICAgIEZFeHRlcm5hbFNldHRpbmcsXG4gICAgICAgICAgICB7IFNldHRpbmc6IEZTZXR0aW5nc1tGRXh0ZXJuYWxTZXR0aW5nXSB9LFxuICAgICAgICAgICAgRkdldEV4dGVybmFsU2V0dGluZ1N0YXRlRXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgICAgIEdldFNldHRpbmc6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAga2V5b2YgRlNldHRpbmdzLFxuICAgICAgICAgICAgeyBTZXR0aW5nOiBGU2V0dGluZ3Nba2V5b2YgRlNldHRpbmdzXSB9LFxuICAgICAgICAgICAgRkdldFNldHRpbmdFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICAgICAgR2V0U2V0dGluZ3M6IFRJcGNGcm9udGVuZEV2ZW50PFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgRlNldHRpbmdzLFxuICAgICAgICAgICAgRkdldFNldHRpbmdzRXJyb3JDb2RlXG4gICAgICAgID47XG4gICAgICAgIENoZWNrRm9yVXBkYXRlczogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBGVXBkYXRlU3RhdHVzLFxuICAgICAgICAgICAgRkNoZWNrRm9yVXBkYXRlc0Vycm9yQ29kZVxuICAgICAgICA+O1xuICAgICAgICBVcGRhdGVTZXR0aW5nczogVElwY0Zyb250ZW5kRXZlbnQ8XG4gICAgICAgICAgICBGU2V0dGluZ3MsXG4gICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICBGVXBkYXRlU2V0dGluZ3NFcnJvckNvZGVcbiAgICAgICAgPjtcbiAgICB9XG59O1xuIiwiLyogRmlsZTogICAgICBUaWxlLlR5cGVzLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGQW5ub3RhdGVkUGFuZWwgfSBmcm9tIFwiLi4vVHJlZS5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBURXZlbnRFcnJvckNvZGUgfSBmcm9tIFwiLi9FcnJvckNvZGVzLlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IFRJcGNGcm9udGVuZEV2ZW50IH0gZnJvbSBcIi4vRXZlbnRCYXNlLlR5cGVzXCI7XG5cbmV4cG9ydCB0eXBlIEZCcmluZ0ludG9QYW5lbEVycm9yQ29kZSA9IFRFdmVudEVycm9yQ29kZTxcIlwiPjtcblxuZGVjbGFyZSBtb2R1bGUgXCIuL0V2ZW50LlR5cGVzXCJcbntcbiAgICBpbnRlcmZhY2UgSUZyb250ZW5kRXZlbnRSZWdpc3RyYXJcbiAgICB7XG4gICAgICAgIEJyaW5nSW50b1BhbmVsOiBUSXBjRnJvbnRlbmRFdmVudDxcbiAgICAgICAgICAgIEZBbm5vdGF0ZWRQYW5lbCxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIEZCcmluZ0ludG9QYW5lbEVycm9yQ29kZVxuICAgICAgICA+O1xuICAgIH1cbn07XG4iLCIvKiBGaWxlOiAgICAgIGluZGV4LnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuZXhwb3J0ICogZnJvbSBcIi4vRXZlbnRcIjtcbmV4cG9ydCAqIGZyb20gXCIuL0V2ZW50LlR5cGVzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9FdmVudEJhc2UuVHlwZXNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL0V2ZW50VXRpbGl0eS5UeXBlc1wiO1xuXG5leHBvcnQgKiBmcm9tIFwiLi9Db21tb24uVHlwZXNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL0ZvY3VzLlR5cGVzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9JbnNlcnQuVHlwZXNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL01vdmUuVHlwZXNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL05hdmlnYXRlLlR5cGVzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9TZXR0aW5ncy5UeXBlc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vVGlsZS5UeXBlc1wiO1xuIiwiLyogRmlsZTogICAgICBLZXlib2FyZC5UeXBlcy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjQgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmV4cG9ydCB0eXBlIEZWaXJ0dWFsS2V5ID1cbiAgICB8IDB4MDVcbiAgICB8IDB4MDZcbiAgICB8IDB4MDhcbiAgICB8IDB4MDlcbiAgICB8IDB4MERcbiAgICB8IDB4MTBcbiAgICB8IDB4MTFcbiAgICB8IDB4MTJcbiAgICB8IDB4MTNcbiAgICB8IDB4MjBcbiAgICB8IDB4MjFcbiAgICB8IDB4MjJcbiAgICB8IDB4MjNcbiAgICB8IDB4MjRcbiAgICB8IDB4MjVcbiAgICB8IDB4MjZcbiAgICB8IDB4MjdcbiAgICB8IDB4MjhcbiAgICB8IDB4MkRcbiAgICB8IDB4MkVcbiAgICB8IDB4MzBcbiAgICB8IDB4MzFcbiAgICB8IDB4MzJcbiAgICB8IDB4MzNcbiAgICB8IDB4MzRcbiAgICB8IDB4MzVcbiAgICB8IDB4MzZcbiAgICB8IDB4MzdcbiAgICB8IDB4MzhcbiAgICB8IDB4MzlcbiAgICB8IDB4NDFcbiAgICB8IDB4NDJcbiAgICB8IDB4NDNcbiAgICB8IDB4NDRcbiAgICB8IDB4NDVcbiAgICB8IDB4NDZcbiAgICB8IDB4NDdcbiAgICB8IDB4NDhcbiAgICB8IDB4NDlcbiAgICB8IDB4NEFcbiAgICB8IDB4NEJcbiAgICB8IDB4NENcbiAgICB8IDB4NERcbiAgICB8IDB4NEVcbiAgICB8IDB4NEZcbiAgICB8IDB4NTBcbiAgICB8IDB4NTFcbiAgICB8IDB4NTJcbiAgICB8IDB4NTNcbiAgICB8IDB4NTRcbiAgICB8IDB4NTVcbiAgICB8IDB4NTZcbiAgICB8IDB4NTdcbiAgICB8IDB4NThcbiAgICB8IDB4NTlcbiAgICB8IDB4NUFcbiAgICB8IDB4NUJcbiAgICB8IDB4NUNcbiAgICB8IDB4NURcbiAgICB8IDB4NjBcbiAgICB8IDB4NjFcbiAgICB8IDB4NjJcbiAgICB8IDB4NjNcbiAgICB8IDB4NjRcbiAgICB8IDB4NjVcbiAgICB8IDB4NjZcbiAgICB8IDB4NjdcbiAgICB8IDB4NjhcbiAgICB8IDB4NjlcbiAgICB8IDB4NkFcbiAgICB8IDB4NkJcbiAgICB8IDB4NkRcbiAgICB8IDB4NkVcbiAgICB8IDB4NkZcbiAgICB8IDB4NzBcbiAgICB8IDB4NzFcbiAgICB8IDB4NzJcbiAgICB8IDB4NzNcbiAgICB8IDB4NzRcbiAgICB8IDB4NzVcbiAgICB8IDB4NzZcbiAgICB8IDB4NzdcbiAgICB8IDB4NzhcbiAgICB8IDB4NzlcbiAgICB8IDB4N0FcbiAgICB8IDB4N0JcbiAgICB8IDB4N0NcbiAgICB8IDB4N0RcbiAgICB8IDB4N0VcbiAgICB8IDB4N0ZcbiAgICB8IDB4ODBcbiAgICB8IDB4ODFcbiAgICB8IDB4ODJcbiAgICB8IDB4ODNcbiAgICB8IDB4ODRcbiAgICB8IDB4ODVcbiAgICB8IDB4ODZcbiAgICB8IDB4ODdcbiAgICB8IDB4QTBcbiAgICB8IDB4QTFcbiAgICB8IDB4QTJcbiAgICB8IDB4QTNcbiAgICB8IDB4QTRcbiAgICB8IDB4QTVcbiAgICB8IDB4QTZcbiAgICB8IDB4QTdcbiAgICB8IDB4QThcbiAgICB8IDB4QTlcbiAgICB8IDB4QUFcbiAgICB8IDB4QUJcbiAgICB8IDB4QUNcbiAgICB8IDB4QjBcbiAgICB8IDB4QjFcbiAgICB8IDB4QjJcbiAgICB8IDB4QjNcbiAgICB8IDB4QjRcbiAgICB8IDB4QjVcbiAgICB8IDB4QjZcbiAgICB8IDB4QjdcbiAgICB8IDB4QkFcbiAgICB8IDB4QkJcbiAgICB8IDB4QkNcbiAgICB8IDB4QkRcbiAgICB8IDB4QkVcbiAgICB8IDB4QkZcbiAgICB8IDB4QzBcbiAgICB8IDB4REJcbiAgICB8IDB4RENcbiAgICB8IDB4RERcbiAgICB8IDB4REU7XG5cbi8qKiBEZXZlbG9wZXItZnJpZW5kbHkgbmFtZXMgZm9yIGtleXMsIGFzc2lnbmVkIGluIGBLZXkudHN4YC4gKi9cbmV4cG9ydCB0eXBlIEZLZXlJZCA9XG4gICAgfCBcIk1vdXNlWDFcIlxuICAgIHwgXCJNb3VzZVgyXCJcbiAgICB8IFwiQmFja3NwYWNlXCJcbiAgICB8IFwiVGFiXCJcbiAgICB8IFwiRW50ZXJcIlxuICAgIHwgXCJTaGlmdFwiXG4gICAgfCBcIkN0cmxcIlxuICAgIHwgXCJBbHRcIlxuICAgIHwgXCJTcGFjZVwiXG4gICAgfCBcIlBnVXBcIlxuICAgIHwgXCJQZ0Rvd25cIlxuICAgIHwgXCJFbmRcIlxuICAgIHwgXCJIb21lXCJcbiAgICB8IFwiTGVmdEFycm93XCJcbiAgICB8IFwiVXBBcnJvd1wiXG4gICAgfCBcIlJpZ2h0QXJyb3dcIlxuICAgIHwgXCJEb3duQXJyb3dcIlxuICAgIHwgXCJJbnNcIlxuICAgIHwgXCJEZWxcIlxuICAgIHwgXCIwXCJcbiAgICB8IFwiMVwiXG4gICAgfCBcIjJcIlxuICAgIHwgXCIzXCJcbiAgICB8IFwiNFwiXG4gICAgfCBcIjVcIlxuICAgIHwgXCI2XCJcbiAgICB8IFwiN1wiXG4gICAgfCBcIjhcIlxuICAgIHwgXCI5XCJcbiAgICB8IFwiQVwiXG4gICAgfCBcIkJcIlxuICAgIHwgXCJDXCJcbiAgICB8IFwiRFwiXG4gICAgfCBcIkVcIlxuICAgIHwgXCJGXCJcbiAgICB8IFwiR1wiXG4gICAgfCBcIkhcIlxuICAgIHwgXCJJXCJcbiAgICB8IFwiSlwiXG4gICAgfCBcIktcIlxuICAgIHwgXCJMXCJcbiAgICB8IFwiTVwiXG4gICAgfCBcIk5cIlxuICAgIHwgXCJPXCJcbiAgICB8IFwiUFwiXG4gICAgfCBcIlFcIlxuICAgIHwgXCJSXCJcbiAgICB8IFwiU1wiXG4gICAgfCBcIlRcIlxuICAgIHwgXCJVXCJcbiAgICB8IFwiVlwiXG4gICAgfCBcIldcIlxuICAgIHwgXCJYXCJcbiAgICB8IFwiWVwiXG4gICAgfCBcIlpcIlxuICAgIHwgXCJMV2luXCJcbiAgICB8IFwiUldpblwiXG4gICAgfCBcIk51bTBcIlxuICAgIHwgXCJOdW0xXCJcbiAgICB8IFwiTnVtMlwiXG4gICAgfCBcIk51bTNcIlxuICAgIHwgXCJOdW00XCJcbiAgICB8IFwiTnVtNVwiXG4gICAgfCBcIk51bTZcIlxuICAgIHwgXCJOdW03XCJcbiAgICB8IFwiTnVtOFwiXG4gICAgfCBcIk51bTlcIlxuICAgIHwgXCJNdWx0aXBseVwiXG4gICAgfCBcIkFkZFwiXG4gICAgfCBcIlN1YnRyYWN0XCJcbiAgICB8IFwiTnVtRGVjaW1hbFwiXG4gICAgfCBcIk51bURpdmlkZVwiXG4gICAgfCBcIkYxXCJcbiAgICB8IFwiRjJcIlxuICAgIHwgXCJGM1wiXG4gICAgfCBcIkY0XCJcbiAgICB8IFwiRjVcIlxuICAgIHwgXCJGNlwiXG4gICAgfCBcIkY3XCJcbiAgICB8IFwiRjhcIlxuICAgIHwgXCJGOVwiXG4gICAgfCBcIkYxMFwiXG4gICAgfCBcIkYxMVwiXG4gICAgfCBcIkYxMlwiXG4gICAgfCBcIkYxM1wiXG4gICAgfCBcIlBhdXNlXCJcbiAgICB8IFwiRjE0XCJcbiAgICB8IFwiRjE1XCJcbiAgICB8IFwiRjE2XCJcbiAgICB8IFwiRjE3XCJcbiAgICB8IFwiRjE4XCJcbiAgICB8IFwiRjE5XCJcbiAgICB8IFwiRjIwXCJcbiAgICB8IFwiRjIxXCJcbiAgICB8IFwiRjIyXCJcbiAgICB8IFwiRjIzXCJcbiAgICB8IFwiRjI0XCJcbiAgICB8IFwiTFNoaWZ0XCJcbiAgICB8IFwiUlNoaWZ0XCJcbiAgICB8IFwiTEN0cmxcIlxuICAgIHwgXCJSQ3RybFwiXG4gICAgfCBcIkxBbHRcIlxuICAgIHwgXCJSQWx0XCJcbiAgICB8IFwiQnJvd3NlckJhY2tcIlxuICAgIHwgXCJCcm93c2VyRm9yd2FyZFwiXG4gICAgfCBcIkJyb3dzZXJSZWZyZXNoXCJcbiAgICB8IFwiQnJvd3NlclN0b3BcIlxuICAgIHwgXCJCcm93c2VyU2VhcmNoXCJcbiAgICB8IFwiQnJvd3NlckZhdm9yaXRlc1wiXG4gICAgfCBcIkJyb3dzZXJTdGFydFwiXG4gICAgfCBcIk5leHRUcmFja1wiXG4gICAgfCBcIlByZXZpb3VzVHJhY2tcIlxuICAgIHwgXCJTdG9wTWVkaWFcIlxuICAgIHwgXCJQYXVzZVwiXG4gICAgfCBcIlBsYXlQYXVzZU1lZGlhXCJcbiAgICB8IFwiU3RhcnRNYWlsXCJcbiAgICB8IFwiU2VsZWN0TWVkaWFcIlxuICAgIHwgXCJBcHBsaWNhdGlvbnNcIlxuICAgIHwgXCJTdGFydEFwcGxpY2F0aW9uT25lXCJcbiAgICB8IFwiU3RhcnRBcHBsaWNhdGlvblR3b1wiXG4gICAgfCBcIjtcIlxuICAgIHwgXCIrXCJcbiAgICB8IFwiLFwiXG4gICAgfCBcIi1cIlxuICAgIHwgXCIuXCJcbiAgICB8IFwiL1wiXG4gICAgfCBcImBcIlxuICAgIHwgXCJbXCJcbiAgICB8IFwiXFxcXFwiXG4gICAgfCBcIl1cIlxuICAgIHwgXCInXCI7XG4iLCIvKiBGaWxlOiAgICAgIEtleWJvYXJkLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNCBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGS2V5SWQsIEZWaXJ0dWFsS2V5IH0gZnJvbSBcIi4vS2V5Ym9hcmQuVHlwZXNcIjtcblxuLyogZXNsaW50LWRpc2FibGUgc29ydC1rZXlzICovXG5cbi8qKiBEZXZlbG9wZXItZnJpZW5kbHkgbmFtZXMgb2Yga2V5IGNvZGVzLiAqL1xuZXhwb3J0IGNvbnN0IEtleUlkc0J5SWQ6IFJlYWRvbmx5PFJlY29yZDxGVmlydHVhbEtleSwgRktleUlkPj4gPVxue1xuICAgIDB4MDU6IFwiTW91c2VYMVwiLFxuICAgIDB4MDY6IFwiTW91c2VYMlwiLFxuICAgIDB4MDg6IFwiQmFja3NwYWNlXCIsXG4gICAgMHgwOTogXCJUYWJcIixcbiAgICAweDBEOiBcIkVudGVyXCIsXG4gICAgMHgxMDogXCJTaGlmdFwiLFxuICAgIDB4MTE6IFwiQ3RybFwiLFxuICAgIDB4MTI6IFwiQWx0XCIsXG4gICAgMHgxMzogXCJQYXVzZVwiLFxuICAgIDB4MjA6IFwiU3BhY2VcIixcbiAgICAweDIxOiBcIlBnVXBcIixcbiAgICAweDIyOiBcIlBnRG93blwiLFxuICAgIDB4MjM6IFwiRW5kXCIsXG4gICAgMHgyNDogXCJIb21lXCIsXG4gICAgMHgyNTogXCJMZWZ0QXJyb3dcIixcbiAgICAweDI2OiBcIlVwQXJyb3dcIixcbiAgICAweDI3OiBcIlJpZ2h0QXJyb3dcIixcbiAgICAweDI4OiBcIkRvd25BcnJvd1wiLFxuICAgIDB4MkQ6IFwiSW5zXCIsXG4gICAgMHgyRTogXCJEZWxcIixcbiAgICAweDMwOiBcIjBcIixcbiAgICAweDMxOiBcIjFcIixcbiAgICAweDMyOiBcIjJcIixcbiAgICAweDMzOiBcIjNcIixcbiAgICAweDM0OiBcIjRcIixcbiAgICAweDM1OiBcIjVcIixcbiAgICAweDM2OiBcIjZcIixcbiAgICAweDM3OiBcIjdcIixcbiAgICAweDM4OiBcIjhcIixcbiAgICAweDM5OiBcIjlcIixcbiAgICAweDQxOiBcIkFcIixcbiAgICAweDQyOiBcIkJcIixcbiAgICAweDQzOiBcIkNcIixcbiAgICAweDQ0OiBcIkRcIixcbiAgICAweDQ1OiBcIkVcIixcbiAgICAweDQ2OiBcIkZcIixcbiAgICAweDQ3OiBcIkdcIixcbiAgICAweDQ4OiBcIkhcIixcbiAgICAweDQ5OiBcIklcIixcbiAgICAweDRBOiBcIkpcIixcbiAgICAweDRCOiBcIktcIixcbiAgICAweDRDOiBcIkxcIixcbiAgICAweDREOiBcIk1cIixcbiAgICAweDRFOiBcIk5cIixcbiAgICAweDRGOiBcIk9cIixcbiAgICAweDUwOiBcIlBcIixcbiAgICAweDUxOiBcIlFcIixcbiAgICAweDUyOiBcIlJcIixcbiAgICAweDUzOiBcIlNcIixcbiAgICAweDU0OiBcIlRcIixcbiAgICAweDU1OiBcIlVcIixcbiAgICAweDU2OiBcIlZcIixcbiAgICAweDU3OiBcIldcIixcbiAgICAweDU4OiBcIlhcIixcbiAgICAweDU5OiBcIllcIixcbiAgICAweDVBOiBcIlpcIixcbiAgICAweDVCOiBcIkxXaW5cIixcbiAgICAweDVDOiBcIlJXaW5cIixcbiAgICAweDVEOiBcIkFwcGxpY2F0aW9uc1wiLFxuICAgIDB4NjA6IFwiTnVtMFwiLFxuICAgIDB4NjE6IFwiTnVtMVwiLFxuICAgIDB4NjI6IFwiTnVtMlwiLFxuICAgIDB4NjM6IFwiTnVtM1wiLFxuICAgIDB4NjQ6IFwiTnVtNFwiLFxuICAgIDB4NjU6IFwiTnVtNVwiLFxuICAgIDB4NjY6IFwiTnVtNlwiLFxuICAgIDB4Njc6IFwiTnVtN1wiLFxuICAgIDB4Njg6IFwiTnVtOFwiLFxuICAgIDB4Njk6IFwiTnVtOVwiLFxuICAgIDB4NkE6IFwiTXVsdGlwbHlcIixcbiAgICAweDZCOiBcIkFkZFwiLFxuICAgIDB4NkQ6IFwiU3VidHJhY3RcIixcbiAgICAweDZFOiBcIk51bURlY2ltYWxcIixcbiAgICAweDZGOiBcIk51bURpdmlkZVwiLFxuICAgIDB4NzA6IFwiRjFcIixcbiAgICAweDcxOiBcIkYyXCIsXG4gICAgMHg3MjogXCJGM1wiLFxuICAgIDB4NzM6IFwiRjRcIixcbiAgICAweDc0OiBcIkY1XCIsXG4gICAgMHg3NTogXCJGNlwiLFxuICAgIDB4NzY6IFwiRjdcIixcbiAgICAweDc3OiBcIkY4XCIsXG4gICAgMHg3ODogXCJGOVwiLFxuICAgIDB4Nzk6IFwiRjEwXCIsXG4gICAgMHg3QTogXCJGMTFcIixcbiAgICAweDdCOiBcIkYxMlwiLFxuICAgIDB4N0M6IFwiRjEzXCIsXG4gICAgMHg3RDogXCJGMTRcIixcbiAgICAweDdFOiBcIkYxNVwiLFxuICAgIDB4N0Y6IFwiRjE2XCIsXG4gICAgMHg4MDogXCJGMTdcIixcbiAgICAweDgxOiBcIkYxOFwiLFxuICAgIDB4ODI6IFwiRjE5XCIsXG4gICAgMHg4MzogXCJGMjBcIixcbiAgICAweDg0OiBcIkYyMVwiLFxuICAgIDB4ODU6IFwiRjIyXCIsXG4gICAgMHg4NjogXCJGMjNcIixcbiAgICAweDg3OiBcIkYyNFwiLFxuICAgIDB4QTA6IFwiTFNoaWZ0XCIsXG4gICAgMHhBMTogXCJSU2hpZnRcIixcbiAgICAweEEyOiBcIkxDdHJsXCIsXG4gICAgMHhBMzogXCJSQ3RybFwiLFxuICAgIDB4QTQ6IFwiTEFsdFwiLFxuICAgIDB4QTU6IFwiUkFsdFwiLFxuICAgIDB4QTY6IFwiQnJvd3NlckJhY2tcIixcbiAgICAweEE3OiBcIkJyb3dzZXJGb3J3YXJkXCIsXG4gICAgMHhBODogXCJCcm93c2VyUmVmcmVzaFwiLFxuICAgIDB4QTk6IFwiQnJvd3NlclN0b3BcIixcbiAgICAweEFBOiBcIkJyb3dzZXJTZWFyY2hcIixcbiAgICAweEFCOiBcIkJyb3dzZXJGYXZvcml0ZXNcIixcbiAgICAweEFDOiBcIkJyb3dzZXJTdGFydFwiLFxuICAgIDB4QjA6IFwiTmV4dFRyYWNrXCIsXG4gICAgMHhCMTogXCJQcmV2aW91c1RyYWNrXCIsXG4gICAgMHhCMjogXCJTdG9wTWVkaWFcIixcbiAgICAweEIzOiBcIlBsYXlQYXVzZU1lZGlhXCIsXG4gICAgMHhCNDogXCJTdGFydE1haWxcIixcbiAgICAweEI1OiBcIlNlbGVjdE1lZGlhXCIsXG4gICAgMHhCNjogXCJTdGFydEFwcGxpY2F0aW9uT25lXCIsXG4gICAgMHhCNzogXCJTdGFydEFwcGxpY2F0aW9uVHdvXCIsXG4gICAgMHhCQTogXCI7XCIsXG4gICAgMHhCQjogXCIrXCIsXG4gICAgMHhCQzogXCIsXCIsXG4gICAgMHhCRDogXCItXCIsXG4gICAgMHhCRTogXCIuXCIsXG4gICAgMHhCRjogXCIvXCIsXG4gICAgMHhDMDogXCJgXCIsXG4gICAgMHhEQjogXCJbXCIsXG4gICAgMHhEQzogXCJcXFxcXCIsXG4gICAgMHhERDogXCJdXCIsXG4gICAgMHhERTogXCInXCJcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCBLZXlJZHM6IFJlYWRvbmx5PEFycmF5PEZLZXlJZD4+ID1cbltcbiAgICBcIk1vdXNlWDFcIixcbiAgICBcIk1vdXNlWDJcIixcbiAgICBcIkJhY2tzcGFjZVwiLFxuICAgIFwiVGFiXCIsXG4gICAgXCJFbnRlclwiLFxuICAgIFwiU2hpZnRcIixcbiAgICBcIkN0cmxcIixcbiAgICBcIkFsdFwiLFxuICAgIFwiUGF1c2VcIixcbiAgICBcIlNwYWNlXCIsXG4gICAgXCJQZ1VwXCIsXG4gICAgXCJQZ0Rvd25cIixcbiAgICBcIkVuZFwiLFxuICAgIFwiSG9tZVwiLFxuICAgIFwiTGVmdEFycm93XCIsXG4gICAgXCJVcEFycm93XCIsXG4gICAgXCJSaWdodEFycm93XCIsXG4gICAgXCJEb3duQXJyb3dcIixcbiAgICBcIkluc1wiLFxuICAgIFwiRGVsXCIsXG4gICAgXCIwXCIsXG4gICAgXCIxXCIsXG4gICAgXCIyXCIsXG4gICAgXCIzXCIsXG4gICAgXCI0XCIsXG4gICAgXCI1XCIsXG4gICAgXCI2XCIsXG4gICAgXCI3XCIsXG4gICAgXCI4XCIsXG4gICAgXCI5XCIsXG4gICAgXCJBXCIsXG4gICAgXCJCXCIsXG4gICAgXCJDXCIsXG4gICAgXCJEXCIsXG4gICAgXCJFXCIsXG4gICAgXCJGXCIsXG4gICAgXCJHXCIsXG4gICAgXCJIXCIsXG4gICAgXCJJXCIsXG4gICAgXCJKXCIsXG4gICAgXCJLXCIsXG4gICAgXCJMXCIsXG4gICAgXCJNXCIsXG4gICAgXCJOXCIsXG4gICAgXCJPXCIsXG4gICAgXCJQXCIsXG4gICAgXCJRXCIsXG4gICAgXCJSXCIsXG4gICAgXCJTXCIsXG4gICAgXCJUXCIsXG4gICAgXCJVXCIsXG4gICAgXCJWXCIsXG4gICAgXCJXXCIsXG4gICAgXCJYXCIsXG4gICAgXCJZXCIsXG4gICAgXCJaXCIsXG4gICAgXCJMV2luXCIsXG4gICAgXCJSV2luXCIsXG4gICAgXCJBcHBsaWNhdGlvbnNcIixcbiAgICBcIk51bTBcIixcbiAgICBcIk51bTFcIixcbiAgICBcIk51bTJcIixcbiAgICBcIk51bTNcIixcbiAgICBcIk51bTRcIixcbiAgICBcIk51bTVcIixcbiAgICBcIk51bTZcIixcbiAgICBcIk51bTdcIixcbiAgICBcIk51bThcIixcbiAgICBcIk51bTlcIixcbiAgICBcIk11bHRpcGx5XCIsXG4gICAgXCJBZGRcIixcbiAgICBcIlN1YnRyYWN0XCIsXG4gICAgXCJOdW1EZWNpbWFsXCIsXG4gICAgXCJOdW1EaXZpZGVcIixcbiAgICBcIkYxXCIsXG4gICAgXCJGMlwiLFxuICAgIFwiRjNcIixcbiAgICBcIkY0XCIsXG4gICAgXCJGNVwiLFxuICAgIFwiRjZcIixcbiAgICBcIkY3XCIsXG4gICAgXCJGOFwiLFxuICAgIFwiRjlcIixcbiAgICBcIkYxMFwiLFxuICAgIFwiRjExXCIsXG4gICAgXCJGMTJcIixcbiAgICBcIkYxM1wiLFxuICAgIFwiRjE0XCIsXG4gICAgXCJGMTVcIixcbiAgICBcIkYxNlwiLFxuICAgIFwiRjE3XCIsXG4gICAgXCJGMThcIixcbiAgICBcIkYxOVwiLFxuICAgIFwiRjIwXCIsXG4gICAgXCJGMjFcIixcbiAgICBcIkYyMlwiLFxuICAgIFwiRjIzXCIsXG4gICAgXCJGMjRcIixcbiAgICBcIkxTaGlmdFwiLFxuICAgIFwiUlNoaWZ0XCIsXG4gICAgXCJMQ3RybFwiLFxuICAgIFwiUkN0cmxcIixcbiAgICBcIkxBbHRcIixcbiAgICBcIlJBbHRcIixcbiAgICBcIkJyb3dzZXJCYWNrXCIsXG4gICAgXCJCcm93c2VyRm9yd2FyZFwiLFxuICAgIFwiQnJvd3NlclJlZnJlc2hcIixcbiAgICBcIkJyb3dzZXJTdG9wXCIsXG4gICAgXCJCcm93c2VyU2VhcmNoXCIsXG4gICAgXCJCcm93c2VyRmF2b3JpdGVzXCIsXG4gICAgXCJCcm93c2VyU3RhcnRcIixcbiAgICBcIk5leHRUcmFja1wiLFxuICAgIFwiUHJldmlvdXNUcmFja1wiLFxuICAgIFwiU3RvcE1lZGlhXCIsXG4gICAgXCJQbGF5UGF1c2VNZWRpYVwiLFxuICAgIFwiU3RhcnRNYWlsXCIsXG4gICAgXCJTZWxlY3RNZWRpYVwiLFxuICAgIFwiU3RhcnRBcHBsaWNhdGlvbk9uZVwiLFxuICAgIFwiU3RhcnRBcHBsaWNhdGlvblR3b1wiLFxuICAgIFwiO1wiLFxuICAgIFwiK1wiLFxuICAgIFwiLFwiLFxuICAgIFwiLVwiLFxuICAgIFwiLlwiLFxuICAgIFwiL1wiLFxuICAgIFwiYFwiLFxuICAgIFwiW1wiLFxuICAgIFwiXFxcXFwiLFxuICAgIFwiXVwiLFxuICAgIFwiJ1wiXG5dIGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgSXNLZXlJZCA9IChJbjogc3RyaW5nKTogSW4gaXMgRktleUlkID0+XG57XG4gICAgcmV0dXJuIEtleUlkcy5pbmNsdWRlcyhJbiBhcyBGS2V5SWQpO1xufTtcblxuZXhwb3J0IGNvbnN0IEdldEtleU5hbWUgPSAoVmtDb2RlOiBGVmlydHVhbEtleSk6IEZLZXlJZCA9Plxue1xuICAgIHJldHVybiBLZXlJZHNCeUlkW1ZrQ29kZV07XG59O1xuXG4vKiogRGV2ZWxvcGVyLWZyaWVuZGx5IG5hbWVzIG9mIGtleSBjb2Rlcy4gKi9cbmV4cG9ydCBjb25zdCBWazogUmVhZG9ubHk8UmVjb3JkPEZLZXlJZCwgRlZpcnR1YWxLZXk+PiA9XG57XG4gICAgTW91c2VYMTogMHgwNSxcbiAgICBNb3VzZVgyOiAweDA2LFxuICAgIEJhY2tzcGFjZTogMHgwOCxcbiAgICBUYWI6IDB4MDksXG4gICAgRW50ZXI6IDB4MEQsXG4gICAgU2hpZnQ6IDB4MTAsXG4gICAgQ3RybDogMHgxMSxcbiAgICBBbHQ6IDB4MTIsXG4gICAgUGF1c2U6IDB4MTMsXG4gICAgU3BhY2U6IDB4MjAsXG4gICAgUGdVcDogMHgyMSxcbiAgICBQZ0Rvd246IDB4MjIsXG4gICAgRW5kOiAweDIzLFxuICAgIEhvbWU6IDB4MjQsXG4gICAgTGVmdEFycm93OiAweDI1LFxuICAgIFVwQXJyb3c6IDB4MjYsXG4gICAgUmlnaHRBcnJvdzogMHgyNyxcbiAgICBEb3duQXJyb3c6IDB4MjgsXG4gICAgSW5zOiAweDJELFxuICAgIERlbDogMHgyRSxcbiAgICAwOiAweDMwLFxuICAgIDE6IDB4MzEsXG4gICAgMjogMHgzMixcbiAgICAzOiAweDMzLFxuICAgIDQ6IDB4MzQsXG4gICAgNTogMHgzNSxcbiAgICA2OiAweDM2LFxuICAgIDc6IDB4MzcsXG4gICAgODogMHgzOCxcbiAgICA5OiAweDM5LFxuICAgIEE6IDB4NDEsXG4gICAgQjogMHg0MixcbiAgICBDOiAweDQzLFxuICAgIEQ6IDB4NDQsXG4gICAgRTogMHg0NSxcbiAgICBGOiAweDQ2LFxuICAgIEc6IDB4NDcsXG4gICAgSDogMHg0OCxcbiAgICBJOiAweDQ5LFxuICAgIEo6IDB4NEEsXG4gICAgSzogMHg0QixcbiAgICBMOiAweDRDLFxuICAgIE06IDB4NEQsXG4gICAgTjogMHg0RSxcbiAgICBPOiAweDRGLFxuICAgIFA6IDB4NTAsXG4gICAgUTogMHg1MSxcbiAgICBSOiAweDUyLFxuICAgIFM6IDB4NTMsXG4gICAgVDogMHg1NCxcbiAgICBVOiAweDU1LFxuICAgIFY6IDB4NTYsXG4gICAgVzogMHg1NyxcbiAgICBYOiAweDU4LFxuICAgIFk6IDB4NTksXG4gICAgWjogMHg1QSxcbiAgICBMV2luOiAweDVCLFxuICAgIFJXaW46IDB4NUMsXG4gICAgQXBwbGljYXRpb25zOiAweDVELFxuICAgIE51bTA6IDB4NjAsXG4gICAgTnVtMTogMHg2MSxcbiAgICBOdW0yOiAweDYyLFxuICAgIE51bTM6IDB4NjMsXG4gICAgTnVtNDogMHg2NCxcbiAgICBOdW01OiAweDY1LFxuICAgIE51bTY6IDB4NjYsXG4gICAgTnVtNzogMHg2NyxcbiAgICBOdW04OiAweDY4LFxuICAgIE51bTk6IDB4NjksXG4gICAgTXVsdGlwbHk6IDB4NkEsXG4gICAgQWRkOiAweDZCLFxuICAgIFN1YnRyYWN0OiAweDZELFxuICAgIE51bURlY2ltYWw6IDB4NkUsXG4gICAgTnVtRGl2aWRlOiAweDZGLFxuICAgIEYxOiAweDcwLFxuICAgIEYyOiAweDcxLFxuICAgIEYzOiAweDcyLFxuICAgIEY0OiAweDczLFxuICAgIEY1OiAweDc0LFxuICAgIEY2OiAweDc1LFxuICAgIEY3OiAweDc2LFxuICAgIEY4OiAweDc3LFxuICAgIEY5OiAweDc4LFxuICAgIEYxMDogMHg3OSxcbiAgICBGMTE6IDB4N0EsXG4gICAgRjEyOiAweDdCLFxuICAgIEYxMzogMHg3QyxcbiAgICBGMTQ6IDB4N0QsXG4gICAgRjE1OiAweDdFLFxuICAgIEYxNjogMHg3RixcbiAgICBGMTc6IDB4ODAsXG4gICAgRjE4OiAweDgxLFxuICAgIEYxOTogMHg4MixcbiAgICBGMjA6IDB4ODMsXG4gICAgRjIxOiAweDg0LFxuICAgIEYyMjogMHg4NSxcbiAgICBGMjM6IDB4ODYsXG4gICAgRjI0OiAweDg3LFxuICAgIExTaGlmdDogMHhBMCxcbiAgICBSU2hpZnQ6IDB4QTEsXG4gICAgTEN0cmw6IDB4QTIsXG4gICAgUkN0cmw6IDB4QTMsXG4gICAgTEFsdDogMHhBNCxcbiAgICBSQWx0OiAweEE1LFxuICAgIEJyb3dzZXJCYWNrOiAweEE2LFxuICAgIEJyb3dzZXJGb3J3YXJkOiAweEE3LFxuICAgIEJyb3dzZXJSZWZyZXNoOiAweEE4LFxuICAgIEJyb3dzZXJTdG9wOiAweEE5LFxuICAgIEJyb3dzZXJTZWFyY2g6IDB4QUEsXG4gICAgQnJvd3NlckZhdm9yaXRlczogMHhBQixcbiAgICBCcm93c2VyU3RhcnQ6IDB4QUMsXG4gICAgTmV4dFRyYWNrOiAweEIwLFxuICAgIFByZXZpb3VzVHJhY2s6IDB4QjEsXG4gICAgU3RvcE1lZGlhOiAweEIyLFxuICAgIFBsYXlQYXVzZU1lZGlhOiAweEIzLFxuICAgIFN0YXJ0TWFpbDogMHhCNCxcbiAgICBTZWxlY3RNZWRpYTogMHhCNSxcbiAgICBTdGFydEFwcGxpY2F0aW9uT25lOiAweEI2LFxuICAgIFN0YXJ0QXBwbGljYXRpb25Ud286IDB4QjcsXG4gICAgXCI7XCI6IDB4QkEsXG4gICAgXCIrXCI6IDB4QkIsXG4gICAgXCIsXCI6IDB4QkMsXG4gICAgXCItXCI6IDB4QkQsXG4gICAgXCIuXCI6IDB4QkUsXG4gICAgXCIvXCI6IDB4QkYsXG4gICAgXCJgXCI6IDB4QzAsXG4gICAgXCJbXCI6IDB4REIsXG4gICAgXCJcXFxcXCI6IDB4REMsXG4gICAgXCJdXCI6IDB4REQsXG4gICAgXCInXCI6IDB4REVcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCBWaXJ0dWFsS2V5czogUmVhZG9ubHk8VEFycmF5PEZWaXJ0dWFsS2V5Pj4gPVxuW1xuICAgIDB4MDUsXG4gICAgMHgwNixcbiAgICAweDA4LFxuICAgIDB4MDksXG4gICAgMHgwRCxcbiAgICAweDEwLFxuICAgIDB4MTEsXG4gICAgMHgxMixcbiAgICAweDEzLFxuICAgIDB4MjAsXG4gICAgMHgyMSxcbiAgICAweDIyLFxuICAgIDB4MjMsXG4gICAgMHgyNCxcbiAgICAweDI1LFxuICAgIDB4MjYsXG4gICAgMHgyNyxcbiAgICAweDI4LFxuICAgIDB4MkQsXG4gICAgMHgyRSxcbiAgICAweDMwLFxuICAgIDB4MzEsXG4gICAgMHgzMixcbiAgICAweDMzLFxuICAgIDB4MzQsXG4gICAgMHgzNSxcbiAgICAweDM2LFxuICAgIDB4MzcsXG4gICAgMHgzOCxcbiAgICAweDM5LFxuICAgIDB4NDEsXG4gICAgMHg0MixcbiAgICAweDQzLFxuICAgIDB4NDQsXG4gICAgMHg0NSxcbiAgICAweDQ2LFxuICAgIDB4NDcsXG4gICAgMHg0OCxcbiAgICAweDQ5LFxuICAgIDB4NEEsXG4gICAgMHg0QixcbiAgICAweDRDLFxuICAgIDB4NEQsXG4gICAgMHg0RSxcbiAgICAweDRGLFxuICAgIDB4NTAsXG4gICAgMHg1MSxcbiAgICAweDUyLFxuICAgIDB4NTMsXG4gICAgMHg1NCxcbiAgICAweDU1LFxuICAgIDB4NTYsXG4gICAgMHg1NyxcbiAgICAweDU4LFxuICAgIDB4NTksXG4gICAgMHg1QSxcbiAgICAweDVCLFxuICAgIDB4NUMsXG4gICAgMHg1RCxcbiAgICAweDYwLFxuICAgIDB4NjEsXG4gICAgMHg2MixcbiAgICAweDYzLFxuICAgIDB4NjQsXG4gICAgMHg2NSxcbiAgICAweDY2LFxuICAgIDB4NjcsXG4gICAgMHg2OCxcbiAgICAweDY5LFxuICAgIDB4NkEsXG4gICAgMHg2QixcbiAgICAweDZELFxuICAgIDB4NkUsXG4gICAgMHg2RixcbiAgICAweDcwLFxuICAgIDB4NzEsXG4gICAgMHg3MixcbiAgICAweDczLFxuICAgIDB4NzQsXG4gICAgMHg3NSxcbiAgICAweDc2LFxuICAgIDB4NzcsXG4gICAgMHg3OCxcbiAgICAweDc5LFxuICAgIDB4N0EsXG4gICAgMHg3QixcbiAgICAweDdDLFxuICAgIDB4N0QsXG4gICAgMHg3RSxcbiAgICAweDdGLFxuICAgIDB4ODAsXG4gICAgMHg4MSxcbiAgICAweDgyLFxuICAgIDB4ODMsXG4gICAgMHg4NCxcbiAgICAweDg1LFxuICAgIDB4ODYsXG4gICAgMHg4NyxcbiAgICAweEEwLFxuICAgIDB4QTEsXG4gICAgMHhBMixcbiAgICAweEEzLFxuICAgIDB4QTQsXG4gICAgMHhBNSxcbiAgICAweEE2LFxuICAgIDB4QTcsXG4gICAgMHhBOCxcbiAgICAweEE5LFxuICAgIDB4QUEsXG4gICAgMHhBQixcbiAgICAweEFDLFxuICAgIDB4QjAsXG4gICAgMHhCMSxcbiAgICAweEIyLFxuICAgIDB4QjMsXG4gICAgMHhCNCxcbiAgICAweEI1LFxuICAgIDB4QjYsXG4gICAgMHhCNyxcbiAgICAweEJBLFxuICAgIDB4QkIsXG4gICAgMHhCQyxcbiAgICAweEJELFxuICAgIDB4QkUsXG4gICAgMHhCRixcbiAgICAweEMwLFxuICAgIDB4REIsXG4gICAgMHhEQyxcbiAgICAweERELFxuICAgIDB4REVcbl0gYXMgY29uc3Q7XG5cbi8qIGVzbGludC1lbmFibGUgc29ydC1rZXlzICovXG5cbi8qKiBJcyB0aGUgYEtleUNvZGVgIGEgVksgQ29kZSAqKnRoYXQgdGhpcyBhcHAgdXNlcz8qKiAqL1xuZXhwb3J0IGNvbnN0IElzVmlydHVhbEtleSA9IChLZXlDb2RlOiBudW1iZXIpOiBLZXlDb2RlIGlzIEZWaXJ0dWFsS2V5ID0+XG57XG4gICAgcmV0dXJuIFZpcnR1YWxLZXlzLmluY2x1ZGVzKEtleUNvZGUgYXMgRlZpcnR1YWxLZXkpO1xufTtcbiIsIi8qIEZpbGU6ICAgICAgTG9nLlR5cGVzLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGTG9nTGV2ZWwsIEZMb2dPcmlnaW4gfSBmcm9tIFwiQHNvcnJlbGx3bS93aW5kb3dzXCI7XG5pbXBvcnQgdHlwZSBjaGFsayBmcm9tIFwiY2hhbGtcIjtcblxuZXhwb3J0IHR5cGUgRkNoYWxrQmFja2dyb3VuZCA9IEV4dHJhY3Q8a2V5b2YgdHlwZW9mIGNoYWxrLCBgYmckeyBzdHJpbmcgfWA+O1xuXG5leHBvcnQgdHlwZSBGQ2hhbGtGb3JlZ3JvdW5kID0gRXh0cmFjdDxrZXlvZiB0eXBlb2YgY2hhbGssIFwiYmxhY2tcIiB8IFwid2hpdGVCcmlnaHRcIj47XG5cbmV4cG9ydCB0eXBlIEZMb2dGdW5jdGlvbiA9ICguLi5TdGF0ZW1lbnRzOiBUQXJyYXk8dW5rbm93bj4pID0+IHZvaWQ7XG5cbmV4cG9ydCB0eXBlIEZMb2dGb3JtYXRGdW5jdGlvbiA9IChTdGF0ZW1lbnQ6IHVua25vd24pID0+IHVua25vd247XG5cbmV4cG9ydCB0eXBlIEZMb2dnZXJSZWNvcmQgPSBSZWNvcmQ8RXhjbHVkZTxGTG9nTGV2ZWwsIFwiTm9ybWFsXCI+LCBGTG9nRnVuY3Rpb24+O1xuXG5leHBvcnQgdHlwZSBGTG9nT3JpZ2luRXh0ZW5kZWQgPSBGTG9nT3JpZ2luIHwgXCIqXCI7XG5cbmV4cG9ydCB0eXBlIEZMb2dEaWdpdFNlcGFyYXRvciA9XG4gICAgfCBcIlNwYWNlXCJcbiAgICB8IFwiQ29tbWFcIlxuICAgIHwgXCJVbmRlcnNjb3JlXCJcbiAgICB8IFwiTm9uZVwiO1xuXG5leHBvcnQgdHlwZSBGTG9nUXVvdGVTdHlsZSA9XG4gICAgfCBcIkRvdWJsZVwiXG4gICAgfCBcIlNpbmdsZVwiXG4gICAgfCBcIk5vbmVcIjtcblxuZXhwb3J0IHR5cGUgRkxvZ1NldHRpbmdzID0gUmVhZG9ubHk8e1xuICAgIENhdGVnb3J5OlxuICAgIHtcbiAgICAgICAgRGlzYWJsZWRDYXRlZ29yaWVzOlxuICAgICAgICB7XG4gICAgICAgICAgICBbIExvZ09yaWdpbiBpbiBGTG9nT3JpZ2luRXh0ZW5kZWQgXTogVEFycmF5PHN0cmluZz47XG4gICAgICAgIH07XG4gICAgICAgIExvZ0Rpc2FibGVkQ2F0ZWdvcnlBdHRlbXB0czogYm9vbGVhbjtcbiAgICB9O1xuICAgIEZvcm1hdDpcbiAgICB7XG4gICAgICAgIEFsd2F5c0FwcGx5Rm9ybWF0OiBib29sZWFuO1xuICAgICAgICBDb2xvcnM6IGJvb2xlYW47XG4gICAgICAgIERpZ2l0U2VwYXJhdG9yOiBGTG9nRGlnaXRTZXBhcmF0b3I7XG4gICAgICAgIFF1b3RlU3R5bGU6IEZMb2dRdW90ZVN0eWxlO1xuICAgICAgICBUcnVuY2F0ZUJhc2U2NFN0cmluZ3M6IGJvb2xlYW47XG4gICAgfTtcbiAgICBTaXplOlxuICAgIHtcbiAgICAgICAgTGltaXRTdGF0ZW1lbnRMZW5ndGg6XG4gICAgICAgIHtcbiAgICAgICAgICAgIEVuYWJsZWQ6IGJvb2xlYW47XG4gICAgICAgICAgICBNYXhMZW5ndGg6IG51bWJlcjtcbiAgICAgICAgfTtcbiAgICAgICAgTWF4VGVybWluYWxXaWR0aDogbnVtYmVyO1xuICAgICAgICBUYWJXaWR0aDogbnVtYmVyO1xuICAgIH07XG59PjtcblxuZXhwb3J0IHR5cGUgRkxvZ2dlciA9IEZMb2dnZXJSZWNvcmQgJiBGTG9nRnVuY3Rpb247XG5cbmV4cG9ydCB0eXBlIEZMb2dnZXJJbnRlcmltID0gRkxvZ0Z1bmN0aW9uICYgUGFydGlhbDxGTG9nZ2VyUmVjb3JkPjtcblxuZXhwb3J0IHR5cGUgRkxvZyA9ICguLi5Bcmd1bWVudHM6IFRBcnJheTx1bmtub3duPikgPT4gdm9pZDtcblxuZXhwb3J0IHR5cGUgRkdldFRpbWVUb2tlbiA9IFwiX19HZXRUaW1lX19cIjtcblxuZXhwb3J0IHR5cGUgRkxvZ0Zyb250ZW5kVG9rZW5zID1cbiAgICB8IEZHZXRUaW1lVG9rZW47XG4iLCIvKiBGaWxlOiAgICAgIExvZy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRkdldFRpbWVUb2tlbiB9IGZyb20gXCIuL0xvZy5UeXBlc1wiO1xuXG5leHBvcnQgY29uc3QgR2V0VGltZVRva2VuOiBGR2V0VGltZVRva2VuID0gXCJfX0dldFRpbWVfX1wiIGFzIGNvbnN0O1xuIiwiLyogRmlsZTogICAgICBLZXliaW5kLlR5cGVzLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBUSW50ZWdyYWxSYW5nZSwgVFN0YXRpY0FycmF5IH0gZnJvbSBcIi4uLy4uL1NoYXJlZC9VdGlsaXR5XCI7XG5pbXBvcnQgdHlwZSB7IEZLZXlJZCB9IGZyb20gXCIuLi8uLi9TaGFyZWQvS2V5Ym9hcmQuVHlwZXNcIjtcblxuZXhwb3J0IHR5cGUgRktleWJpbmREaXJlY3Rpb24gPVxuICAgIHwgXCJMZWZ0XCJcbiAgICB8IFwiVXBcIlxuICAgIHwgXCJEb3duXCJcbiAgICB8IFwiUmlnaHRcIjtcblxuZXhwb3J0IHR5cGUgRktleWJpbmRBY3Rpb25MZXZlbCA9XG4gICAgfCBcIlByaW1hcnlcIlxuICAgIHwgXCJTZWNvbmRhcnlcIjtcblxuZXhwb3J0IHR5cGUgRktleVNlcXVlbmNlU2V0ID0gUmVjb3JkPFRJbnRlZ3JhbFJhbmdlPDAsIDM+LCBBcnJheTxGS2V5SWQ+PjtcblxuZXhwb3J0IHR5cGUgRktleWJpbmRBY3Rpb25NaXNjZWxsYW5lb3VzID1cbiAgICB8IFwiUGVla1wiXG4gICAgfCBcIkZvY3VzTGlzdFwiXG4gICAgfCBcIkZvY3VzVGV4dElucHV0XCJcbiAgICB8IFwiU2V0dGluZ3NcIjtcblxuZXhwb3J0IHR5cGUgRktleWJpbmRzID1cbiAgICBSZWNvcmQ8RktleWJpbmRBY3Rpb25MZXZlbCwgRktleVNlcXVlbmNlU2V0PiAmXG4gICAge1xuICAgICAgICBBY3RpdmF0ZTogQXJyYXk8RktleUlkPjtcbiAgICAgICAgQ2FuY2VsOiBBcnJheTxGS2V5SWQ+O1xuICAgICAgICBEaXJlY3Rpb246IFJlY29yZDxGS2V5YmluZERpcmVjdGlvbiwgQXJyYXk8RktleUlkPj47XG4gICAgICAgIE1pc2NlbGxhbmVvdXM6IFJlY29yZDxGS2V5YmluZEFjdGlvbk1pc2NlbGxhbmVvdXMsIEFycmF5PEZLZXlJZD4+O1xuICAgIH07XG5cbnR5cGUgVFJlY3VycmVuY2U8VHlwZT4gPSBUeXBlIGV4dGVuZHMgUmVjb3JkPFByb3BlcnR5S2V5LCBSZWNvcmQ8UHJvcGVydHlLZXksIHVua25vd24+PlxuICAgID8ge1xuICAgICAgICBbIEtleSBpbiBrZXlvZiBUeXBlIF06IFRSZWN1cnJlbmNlPFR5cGVbS2V5XT47XG4gICAgfVxuICAgIDogVHlwZSBleHRlbmRzIFJlY29yZDxQcm9wZXJ0eUtleSwgdW5rbm93bj5cbiAgICAgICAgPyB7XG4gICAgICAgICAgICBbIEtleSBpbiBrZXlvZiBUeXBlIF06IHN0cmluZztcbiAgICAgICAgfVxuICAgICAgICA6IHN0cmluZztcblxuZXhwb3J0IHR5cGUgRktleWJpbmREaXNwbGF5TmFtZXMgPSBUUmVjdXJyZW5jZTxGS2V5YmluZHM+O1xuXG5leHBvcnQgdHlwZSBGQWN0aW9uS2V5ID1cbiAgICB8IGAkeyBGS2V5YmluZEFjdGlvbkxldmVsIH1bJHsga2V5b2YgRktleVNlcXVlbmNlU2V0IH1dYFxuICAgIHwgYERpcmVjdGlvbi4keyBGS2V5YmluZERpcmVjdGlvbiB9YFxuICAgIHwgYE1pc2NlbGxhbmVvdXMuJHsgRktleWJpbmRBY3Rpb25NaXNjZWxsYW5lb3VzIH1gXG4gICAgfCBcIkFjdGl2YXRlXCJcbiAgICB8IFwiQ2FuY2VsXCI7XG5cbmV4cG9ydCB0eXBlIEZBY3Rpb24gPSBUU3RhdGljQXJyYXk8RkFjdGlvbktleSwgVEludGVncmFsUmFuZ2U8MSwgND4+O1xuXG5leHBvcnQgdHlwZSBGS2V5U2lkZSA9XG4gICAgfCBcIkxcIlxuICAgIHwgXCJSXCJcbiAgICB8IFwiRWl0aGVyXCJcbiAgICB8IHVuZGVmaW5lZDtcblxuZXhwb3J0IHR5cGUgRktleSA9XG57XG4gICAgLyoqIFRleHQgdG8gZGlzcGxheSBvbiB0aGUga2V5LCBvciBhIHN5bWJvbCB0aGF0IGlzIHJlbmRlcmVkIGluIHRoZSBjZW50ZXIgb2YgdGhlIGtleS4gKi9cbiAgICBEaXNwbGF5OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBBbiBhZGRpdGlvbmFsIGRlc2NyaXB0b3IsIHNob3duIGluIHRoZSBjb3JuZXIuXG4gICAgICogU2hvdWxkIGJlIGB1bmRlZmluZWRgIHdoZW5ldmVyIGBTaWRlYCBpcyBkZWZpbmVkLlxuICAgICAqL1xuICAgIE1vZGlmaWVyOiB1bmRlZmluZWQgfCBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgXCJzaWRlXCIgb2YgdGhlIGtleSBpczpcbiAgICAgKiAgICAgKiBgXCJMZWZ0XCJgIG9yIGBcIlJpZ2h0XCJgIGluIHRoZSBjYXNlIG9mIGtleXMgbGlrZSBsZWZ0IHNoaWZ0XG4gICAgICogICAgICogYFwiRWl0aGVyXCJgIGluIHRoZSBjYXNlIG9mIGtleXMgdGhhdCBkbyBub3QgaGF2ZSBhIHNpZGUsXG4gICAgICogICAgICAgYnV0IGhhdmUgY29ycmVzcG9uZGluZyBrZXkgY29kZXMgdGhhdCAqZG8qIGhhdmUgc2lkZXMuXG4gICAgICogICAgICogYHVuZGVmaW5lZGAgZm9yIFwibm9ybWFsXCIga2V5cywgc3VjaCBhcyBsZXR0ZXJzIGFuZCBudW1iZXJzXG4gICAgICovXG4gICAgU2lkZTogRktleVNpZGU7XG59O1xuIiwiLyogRmlsZTogICAgICBLZXliaW5kLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgc29ydC1rZXlzICovXG5cbmltcG9ydCB0eXBlIHsgRkFjdGlvbktleSwgRktleSB9IGZyb20gXCIuL0tleWJpbmQuVHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgRlZpcnR1YWxLZXkgfSBmcm9tIFwiLi4vLi4vU2hhcmVkL0tleWJvYXJkLlR5cGVzXCI7XG5cbmNvbnN0IFdpbmRvd3NMb2dvOiBzdHJpbmcgPSBcIlxcdUU3ODJcIjtcbmNvbnN0IEdsb2JlU3ltYm9sOiBzdHJpbmcgPSBcIlxcdUU3NzRcIjtcbmNvbnN0IE51bU1vZGlmaWVyOiBzdHJpbmcgPSBcIk5VTVwiO1xuY29uc3QgU2hpZnRTeW1ib2w6IHN0cmluZyA9IFwiXFx1RTc1MlwiO1xuXG5leHBvcnQgY29uc3QgS2V5czogUmVhZG9ubHk8UmVjb3JkPEZWaXJ0dWFsS2V5LCBGS2V5Pj4gPVxue1xuICAgIDB4MDU6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUU5NjJcIixcbiAgICAgICAgTW9kaWZpZXI6IFwiMVwiLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4MDY6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUU5NjJcIixcbiAgICAgICAgTW9kaWZpZXI6IFwiMlwiLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4MDg6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUU3NTBcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDA5OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFN0ZEXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgwRDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RTc1MVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4MTA6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUU3NTJcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogXCJFaXRoZXJcIlxuICAgIH0sXG4gICAgMHgxMTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiQ1RSTFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiBcIkVpdGhlclwiXG4gICAgfSxcbiAgICAweDEyOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJBTFRcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogXCJFaXRoZXJcIlxuICAgIH0sXG4gICAgMHgxMzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RTgxQVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4MjA6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUU3NURcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDIxOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJQZ1VwXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgyMjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiUGdEb3duXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgyMzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRW5kXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgyNDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiSG9tZVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4MjU6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkxlZnRBcnJvd1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4MjY6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlVwQXJyb3dcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDI3OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJSaWdodEFycm93XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgyODpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRG93bkFycm93XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgyRDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiSW5zXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgyRTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRGVsXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgzMDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiMFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4MzE6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIjFcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDMyOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCIyXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgzMzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiM1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4MzQ6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIjRcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDM1OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCI1XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgzNjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiNlwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4Mzc6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIjdcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDM4OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCI4XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHgzOTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiOVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NDE6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkFcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDQyOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJCXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg0MzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiQ1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NDQ6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkRcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDQ1OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJFXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg0NjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRlwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NDc6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkdcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDQ4OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJIXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg0OTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiSVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NEE6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkpcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDRCOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJLXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg0QzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiTFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NEQ6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIk1cIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDRFOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJOXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg0RjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiT1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NTA6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlBcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDUxOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJRXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg1MjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiUlwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NTM6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlNcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDU0OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJUXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg1NTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiVVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NTY6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlZcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDU3OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJXXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg1ODpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiWFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NTk6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIllcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDVBOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJaXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg1QjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFdpbmRvd3NMb2dvLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiBcIkxcIlxuICAgIH0sXG4gICAgMHg1QzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFdpbmRvd3NMb2dvLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiBcIlJcIlxuICAgIH0sXG4gICAgMHg1RDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RTcwMFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NjA6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIjBcIixcbiAgICAgICAgTW9kaWZpZXI6IE51bU1vZGlmaWVyLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NjE6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIjFcIixcbiAgICAgICAgTW9kaWZpZXI6IE51bU1vZGlmaWVyLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NjI6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIjJcIixcbiAgICAgICAgTW9kaWZpZXI6IE51bU1vZGlmaWVyLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NjM6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIjNcIixcbiAgICAgICAgTW9kaWZpZXI6IE51bU1vZGlmaWVyLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NjQ6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIjRcIixcbiAgICAgICAgTW9kaWZpZXI6IE51bU1vZGlmaWVyLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NjU6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIjVcIixcbiAgICAgICAgTW9kaWZpZXI6IE51bU1vZGlmaWVyLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NjY6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIjZcIixcbiAgICAgICAgTW9kaWZpZXI6IE51bU1vZGlmaWVyLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4Njc6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIjdcIixcbiAgICAgICAgTW9kaWZpZXI6IE51bU1vZGlmaWVyLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4Njg6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIjhcIixcbiAgICAgICAgTW9kaWZpZXI6IE51bU1vZGlmaWVyLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4Njk6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIjlcIixcbiAgICAgICAgTW9kaWZpZXI6IE51bU1vZGlmaWVyLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NkE6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIsOXXCIsXG4gICAgICAgIE1vZGlmaWVyOiBOdW1Nb2RpZmllcixcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDZCOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCIrXCIsXG4gICAgICAgIE1vZGlmaWVyOiBOdW1Nb2RpZmllcixcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDZEOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCItXCIsXG4gICAgICAgIE1vZGlmaWVyOiBOdW1Nb2RpZmllcixcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDZFOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCIuXCIsXG4gICAgICAgIE1vZGlmaWVyOiBOdW1Nb2RpZmllcixcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDZGOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCIvXCIsXG4gICAgICAgIE1vZGlmaWVyOiBOdW1Nb2RpZmllcixcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDcwOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGMVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NzE6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkYyXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg3MjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjNcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDczOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGNFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4NzQ6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkY1XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg3NTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjZcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDc2OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGN1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4Nzc6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkY4XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHg3ODpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiRjlcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDc5OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGMTBcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDdBOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGMTFcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDdCOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGMTJcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDdDOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGMTNcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDdEOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGMTRcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDdFOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGMTVcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDdGOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGMTZcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDgwOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGMTdcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDgxOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGMThcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDgyOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGMTlcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDgzOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGMjBcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDg0OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGMjFcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDg1OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGMjJcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDg2OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGMjNcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweDg3OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJGMjRcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEEwOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogU2hpZnRTeW1ib2wsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IFwiTFwiXG4gICAgfSxcbiAgICAweEExOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogU2hpZnRTeW1ib2wsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IFwiUlwiXG4gICAgfSxcbiAgICAweEEyOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJDVFJMXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IFwiTFwiXG4gICAgfSxcbiAgICAweEEzOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJDVFJMXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IFwiUlwiXG4gICAgfSxcbiAgICAweEE0OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJBTFRcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogXCJMXCJcbiAgICB9LFxuICAgIDB4QTU6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIkFMVFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiBcIlJcIlxuICAgIH0sXG4gICAgMHhBNjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiJiNFNzJCXCIsXG4gICAgICAgIE1vZGlmaWVyOiBHbG9iZVN5bWJvbCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEE3OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFNzJBXCIsXG4gICAgICAgIE1vZGlmaWVyOiBHbG9iZVN5bWJvbCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEE4OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFNzJDXCIsXG4gICAgICAgIE1vZGlmaWVyOiBHbG9iZVN5bWJvbCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEE5OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFNzMzXCIsXG4gICAgICAgIE1vZGlmaWVyOiBHbG9iZVN5bWJvbCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEFBOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFNzIxXCIsXG4gICAgICAgIE1vZGlmaWVyOiBHbG9iZVN5bWJvbCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEFCOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFNzI4XCIsXG4gICAgICAgIE1vZGlmaWVyOiBHbG9iZVN5bWJvbCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEFDOlxuICAgIHtcbiAgICAgICAgLyogQFRPRE8gQ29uc2lkZXIgdXNpbmcgYSBkaWZmZXJlbnQgaWNvbi4gKi9cbiAgICAgICAgRGlzcGxheTogXCJcXHVGNzFDXCIsXG4gICAgICAgIE1vZGlmaWVyOiBHbG9iZVN5bWJvbCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEIwOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFQjlEXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhCMTpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RUI5RVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4QjI6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUU3MUFcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEIzOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFNzY4XCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhCNDpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RTcxNVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4QjU6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIlxcdUVBNjlcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEI2OlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJcXHVFQjNCXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhCNzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFx1RUQzNVwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4QkE6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIjtcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEJCOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCIrXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhCQzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiLFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4QkQ6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIi1cIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweEJFOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCIuXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhCRjpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiL1wiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4QzA6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcImBcIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweERCOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCJbXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgMHhEQzpcbiAgICB7XG4gICAgICAgIERpc3BsYXk6IFwiXFxcXFwiLFxuICAgICAgICBNb2RpZmllcjogdW5kZWZpbmVkLFxuICAgICAgICBTaWRlOiB1bmRlZmluZWRcbiAgICB9LFxuICAgIDB4REQ6XG4gICAge1xuICAgICAgICBEaXNwbGF5OiBcIl1cIixcbiAgICAgICAgTW9kaWZpZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgU2lkZTogdW5kZWZpbmVkXG4gICAgfSxcbiAgICAweERFOlxuICAgIHtcbiAgICAgICAgRGlzcGxheTogXCInXCIsXG4gICAgICAgIE1vZGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgIFNpZGU6IHVuZGVmaW5lZFxuICAgIH1cbn07XG5cbmV4cG9ydCBjb25zdCBBY3Rpb25LZXlzOiBSZWFkb25seTxBcnJheTxGQWN0aW9uS2V5Pj4gPVxuW1xuICAgIFwiQWN0aXZhdGVcIixcbiAgICBcIkNhbmNlbFwiLFxuICAgIFwiRGlyZWN0aW9uLkRvd25cIixcbiAgICBcIkRpcmVjdGlvbi5MZWZ0XCIsXG4gICAgXCJEaXJlY3Rpb24uUmlnaHRcIixcbiAgICBcIkRpcmVjdGlvbi5VcFwiLFxuICAgIFwiTWlzY2VsbGFuZW91cy5Gb2N1c0xpc3RcIixcbiAgICBcIk1pc2NlbGxhbmVvdXMuRm9jdXNUZXh0SW5wdXRcIixcbiAgICBcIk1pc2NlbGxhbmVvdXMuUGVla1wiLFxuICAgIFwiTWlzY2VsbGFuZW91cy5TZXR0aW5nc1wiLFxuICAgIFwiUHJpbWFyeVswXVwiLFxuICAgIFwiUHJpbWFyeVsxXVwiLFxuICAgIFwiUHJpbWFyeVsyXVwiLFxuICAgIFwiUHJpbWFyeVszXVwiLFxuICAgIFwiU2Vjb25kYXJ5WzBdXCIsXG4gICAgXCJTZWNvbmRhcnlbMV1cIixcbiAgICBcIlNlY29uZGFyeVsyXVwiLFxuICAgIFwiU2Vjb25kYXJ5WzNdXCJcbl0gYXMgY29uc3Q7XG4iLCIvKiBGaWxlOiAgICAgIFNldHRpbmdzLlR5cGVzLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGS2V5YmluZHMgfSBmcm9tIFwiLi9LZXliaW5kLlR5cGVzXCI7XG5cbi8qKlxuICogU29tZSBzZXR0aW5ncyByZWdhcmQgc3RhdGUgdGhhdCBpcyBvdXRzaWRlIG9mIFNvcnJlbGxXbSxcbiAqIGZvciBleGFtcGxlLCBmb3IgdGhlIGBSdW5PblN0YXJ0dXBgIHNldHRpbmcgdG8gYmUgaG9ub3JlZCxcbiAqIGEgdGFzayBtdXN0IGJlIHJlZ2lzdGVyZWQgdmlhIHRoZSBUYXNrIFNjaGVkdWxlci4gIElmIHRoaXNcbiAqIGZhaWxzLCB0aGVuIHRoaXMgZXh0ZXJuYWwgc3RhdGUgKCppLmUuKiwgdGhlIFRhc2sgU2NoZWR1bGVyKVxuICogaXMgaW5jb25zaXN0ZW50IHdpdGggdGhlIHZhbHVlIG9mIHRoZSBzZXR0aW5nIGBSdW5PblN0YXJ0dXBgXG4gKiBpbiBTb3JyZWxsV20uXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvdHlwZWRlZiAqL1xuZXhwb3J0IGNvbnN0IEV4dGVybmFsU2V0dGluZ3MgPSBbIFwiUnVuT25TdGFydHVwXCIgXSBhcyBjb25zdDtcblxuZXhwb3J0IHR5cGUgRkV4dGVybmFsU2V0dGluZyA9IHR5cGVvZiBFeHRlcm5hbFNldHRpbmdzW251bWJlcl07XG5cbmV4cG9ydCB0eXBlIEZTZXR0aW5ncyA9XG57XG4gICAgQW5pbWF0aW9uU2NhbGFyOiBudW1iZXI7XG4gICAgR2FwOiBudW1iZXI7XG4gICAgUnVuT25TdGFydHVwOiBib29sZWFuO1xuICAgIEtleWJpbmRzOiBGS2V5YmluZHM7XG4gICAgU2hvd1VwZGF0ZU5vdGlmaWNhdGlvbnM6IGJvb2xlYW47XG59O1xuXG5leHBvcnQgdHlwZSBGU2V0dGluZ3NLZXlzID0ga2V5b2YgRlNldHRpbmdzO1xuIiwiLyogRmlsZTogICAgICBTZXR0aW5ncy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjUgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRlNldHRpbmdzIH0gZnJvbSBcIi4vU2V0dGluZ3MuVHlwZXNcIjtcblxuZXhwb3J0IGNvbnN0IERlZmF1bHRTZXR0aW5nczogRlNldHRpbmdzID1cbntcbiAgICBBbmltYXRpb25TY2FsYXI6IDEsXG4gICAgR2FwOiA0LFxuICAgIEtleWJpbmRzOlxuICAgIHtcbiAgICAgICAgQWN0aXZhdGU6IFsgXCJGMjBcIiBdLFxuICAgICAgICBDYW5jZWw6IFsgXCJCYWNrc3BhY2VcIiBdLFxuICAgICAgICBEaXJlY3Rpb246XG4gICAgICAgIHtcbiAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlIHNvcnQta2V5cyAqL1xuICAgICAgICAgICAgTGVmdDogWyBcIkRcIiBdLFxuICAgICAgICAgICAgVXA6IFsgXCJIXCIgXSxcbiAgICAgICAgICAgIERvd246IFsgXCJUXCIgXSxcbiAgICAgICAgICAgIFJpZ2h0OiBbIFwiTlwiIF1cbiAgICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgc29ydC1rZXlzICovXG4gICAgICAgIH0sXG4gICAgICAgIE1pc2NlbGxhbmVvdXM6XG4gICAgICAgIHtcbiAgICAgICAgICAgIEZvY3VzTGlzdDogWyBcImBcIiBdLFxuICAgICAgICAgICAgRm9jdXNUZXh0SW5wdXQ6IFsgXCJUYWJcIiBdLFxuICAgICAgICAgICAgUGVlazogWyBcIlpcIiBdLFxuICAgICAgICAgICAgU2V0dGluZ3M6IFsgXCIrXCIgXVxuICAgICAgICB9LFxuICAgICAgICBQcmltYXJ5OlxuICAgICAgICB7XG4gICAgICAgICAgICAwOiBbIFwiRlwiIF0sXG4gICAgICAgICAgICAxOiBbIFwiR1wiIF0sXG4gICAgICAgICAgICAyOiBbIFwiVFwiIF0sXG4gICAgICAgICAgICAzOiBbIFwiUlwiIF1cbiAgICAgICAgfSxcbiAgICAgICAgU2Vjb25kYXJ5OlxuICAgICAgICB7XG4gICAgICAgICAgICAwOiBbIFwiQ3RybFwiLCBcIkZcIiBdLFxuICAgICAgICAgICAgMTogWyBcIkN0cmxcIiwgXCJHXCIgXSxcbiAgICAgICAgICAgIDI6IFsgXCJDdHJsXCIsIFwiVFwiIF0sXG4gICAgICAgICAgICAzOiBbIFwiQ3RybFwiLCBcIlJcIiBdXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFJ1bk9uU3RhcnR1cDogZmFsc2UsXG4gICAgU2hvd1VwZGF0ZU5vdGlmaWNhdGlvbnM6IHRydWVcbn07XG4iLCIvKiBGaWxlOiAgICAgIGluZGV4LnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuZXhwb3J0ICogZnJvbSBcIi4vS2V5YmluZFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vS2V5YmluZC5UeXBlc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vU2V0dGluZ3NcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1NldHRpbmdzLlR5cGVzXCI7XG4iLCIvKiBGaWxlOiAgICAgIFNoYXJlZC5UeXBlcy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjUgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmV4cG9ydCB0eXBlIEZDYXJkaW5hbERpcmVjdGlvbiA9XG4gICAgfCBcIlVwXCJcbiAgICB8IFwiRG93blwiXG4gICAgfCBcIkxlZnRcIlxuICAgIHwgXCJSaWdodFwiO1xuXG5leHBvcnQgdHlwZSBURnVuY3Rpb248UGFyYW1ldGVyVHlwZXMgZXh0ZW5kcyBUQXJyYXk8dW5rbm93bj4sIFJldHVyblR5cGU+ID1cbiAgICAoLi4uQXJndW1lbnRzOiBQYXJhbWV0ZXJUeXBlcykgPT4gUmV0dXJuVHlwZTtcblxuZXhwb3J0IHR5cGUgRk5vdEZ1bmN0aW9uID0gRXhjbHVkZTx1bmtub3duLCAoLi4uQXJndW1lbnRzOiBUQXJyYXk8dW5rbm93bj4pID0+IHVua25vd24+O1xuXG5leHBvcnQgdHlwZSBGQXhpcyA9IFwiWFwiIHwgXCJZXCI7XG4iLCIvKiBGaWxlOiAgICAgIFN0b3JlLlR5cGVzLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuZXhwb3J0IHR5cGUgRlN0b3JlID1cbntcbiAgICBBcHBWZXJzaW9uOiBzdHJpbmc7XG4gICAgVGltZUxhc3RDaGVja2VkVXBkYXRlOiBudW1iZXIgfCBudWxsO1xufTtcbiIsIi8qIEZpbGU6ICAgICAgU3RvcmUudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZTdG9yZSB9IGZyb20gXCIuL1N0b3JlLlR5cGVzXCI7XG4vLyBpbXBvcnQgeyBhcHAgfSBmcm9tIFwiZWxlY3Ryb25cIjtcblxuZXhwb3J0IGNvbnN0IEdldERlZmF1bHRTdG9yZSA9ICgpOiBGU3RvcmUgPT5cbntcbiAgICByZXR1cm4ge1xuICAgICAgICAvLyBBcHBWZXJzaW9uOiBhcHAuZ2V0VmVyc2lvbigpLFxuICAgICAgICBBcHBWZXJzaW9uOiBcIkBUT0RPXCIsXG4gICAgICAgIFRpbWVMYXN0Q2hlY2tlZFVwZGF0ZTogbnVsbFxuICAgIH07XG59O1xuIiwiLyogRmlsZTogICAgICBUb2tlbnMudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqIENvbW1lbnQ6ICAgVGhpcyBob3N0cyBzaW1wbGUgdmFsdWVzIHVzZWQgYnkgYG1haW5gIGFuZCB0aGUgYHJlbmRlcmVyYC5cbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L3R5cGVkZWYgKi9cbmV4cG9ydCBjb25zdCBUb2tlbnMgPVxue1xuICAgIFRpdGxlYmFySGVpZ2h0OiA0OFxufTtcbiIsIi8qIEZpbGU6ICAgICAgVHJlZS5UeXBlcy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjUgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRkJveCwgSE1vbml0b3IsIEhXaW5kb3cgfSBmcm9tIFwiQHNvcnJlbGx3bS93aW5kb3dzXCI7XG5cbmV4cG9ydCB0eXBlIEZWZXJ0ZXhCYXNlID1cbntcbiAgICBTaXplOiBGQm94O1xuICAgIFpPcmRlcjogbnVtYmVyO1xufTtcblxuZXhwb3J0IHR5cGUgRkNlbGwgPVxuICAgIEZWZXJ0ZXhCYXNlICZcbiAgICB7XG4gICAgICAgIEhhbmRsZTogSFdpbmRvdztcbiAgICB9O1xuXG5leHBvcnQgdHlwZSBGVmVydGV4ID1cbiAgICB8IEZDZWxsXG4gICAgfCBGUGFuZWw7XG5cbmV4cG9ydCB0eXBlIEZQYW5lbERpcmVjdGlvbiA9XG4gICAgfCBcIkhvcml6b250YWxcIlxuICAgIHwgXCJWZXJ0aWNhbFwiXG5cbmV4cG9ydCB0eXBlIEZQYW5lbFR5cGUgPVxuICAgIHwgRlBhbmVsRGlyZWN0aW9uXG4gICAgfCBcIlN0YWNrXCI7XG5cbmV4cG9ydCB0eXBlIEZQYW5lbEJhc2UgPVxuICAgIEZWZXJ0ZXhCYXNlICZcbiAgICB7XG4gICAgICAgIENoaWxkcmVuOiBUQXJyYXk8RlZlcnRleD47XG4gICAgICAgIC8qKiBTaG91bGQgb25seSBiZSBzZXQgd2hlbiB0aGlzIGlzIHRoZSByb290IHBhbmVsIG9mIGEgbW9uaXRvci4gKi9cbiAgICAgICAgTW9uaXRvcklkPzogSE1vbml0b3I7XG4gICAgICAgIFR5cGU6IEZQYW5lbFR5cGU7XG4gICAgfTtcblxuZXhwb3J0IHR5cGUgRlBhbmVsSG9yaXpvbnRhbCA9XG4gICAgRlBhbmVsQmFzZSAmXG4gICAge1xuICAgICAgICBUeXBlOiBcIkhvcml6b250YWxcIjtcbiAgICB9O1xuXG5leHBvcnQgdHlwZSBGUGFuZWxWZXJ0aWNhbCA9XG4gICAgRlBhbmVsQmFzZSAmXG4gICAge1xuICAgICAgICBUeXBlOiBcIlZlcnRpY2FsXCI7XG4gICAgfTtcblxuZXhwb3J0IHR5cGUgRlBhbmVsU3RhY2sgPVxuICAgIEZQYW5lbEJhc2UgJlxuICAgIHtcbiAgICAgICAgVHlwZTogXCJTdGFja1wiO1xuICAgIH07XG5cbmV4cG9ydCB0eXBlIEZQYW5lbCA9XG4gICAgfCBGUGFuZWxIb3Jpem9udGFsXG4gICAgfCBGUGFuZWxWZXJ0aWNhbDtcbiAgICAvLyB8IEZQYW5lbFN0YWNrO1xuXG5leHBvcnQgdHlwZSBGRm9yZXN0ID0gVEFycmF5PEZQYW5lbD47XG5cbmV4cG9ydCB0eXBlIEZBbm5vdGF0ZWRQYW5lbCA9XG4gICAgRlBhbmVsICZcbiAgICB7XG4gICAgICAgIEFwcGxpY2F0aW9uTmFtZXM6IFRBcnJheTxzdHJpbmc+O1xuICAgICAgICBNb25pdG9yTmFtZTogc3RyaW5nO1xuICAgICAgICBJc1Jvb3Q6IGJvb2xlYW47XG4gICAgICAgIFNjcmVlbnNob3Q6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICB9O1xuXG5leHBvcnQgdHlwZSBGRm9jdXNDaGFuZ2UgPVxuICAgIHwgXCJOZXh0XCJcbiAgICB8IFwiUHJldmlvdXNcIlxuICAgIHwgXCJVcFwiXG4gICAgfCBcIkRvd25cIjtcblxuZXhwb3J0IHR5cGUgRkxvZ1RyYW5zZm9ybWVyID0gKFZlcnRleDogRlZlcnRleCwgRGVwdGg6IG51bWJlciwgRGVmYXVsdFN0cmluZzogc3RyaW5nKSA9PiBzdHJpbmc7XG5cbmV4cG9ydCB0eXBlIEZHYXBEYXRhID1cbntcbiAgICBBZGp1c3RlZFNpemU6IEZCb3g7XG4gICAgUHJpbmNpcGFsUmF0aW86IG51bWJlcjtcbn07XG4iLCIvKiBGaWxlOiAgICAgIEFycmF5LnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBUSXNOb25OZWdhdGl2ZUludGVnZXIgfSBmcm9tIFwiLi9VdGlsaXR5LlR5cGVzXCI7XG5cbmV4cG9ydCB0eXBlIFRNYXliZUFycmF5PFR5cGU+ID0gVHlwZSB8IFRBcnJheTxUeXBlPjtcblxudHlwZSBUQnVpbGRTdGF0aWNUQXJyYXk8XG4gICAgRWxlbWVudFR5cGUsXG4gICAgQXJyYXlTaXplIGV4dGVuZHMgbnVtYmVyLFxuICAgIEFjY3VtdWxhdG9yIGV4dGVuZHMgVEFycmF5PEVsZW1lbnRUeXBlPiA9IFsgXVxuPiA9XG4gICAgQWNjdW11bGF0b3JbXCJsZW5ndGhcIl0gZXh0ZW5kcyBBcnJheVNpemVcbiAgICAgICAgPyBBY2N1bXVsYXRvclxuICAgICAgICA6IFRCdWlsZFN0YXRpY1RBcnJheTxFbGVtZW50VHlwZSwgQXJyYXlTaXplLCBbIC4uLkFjY3VtdWxhdG9yLCBFbGVtZW50VHlwZSBdPjtcblxuZXhwb3J0IHR5cGUgVFN0YXRpY0FycmF5PEVsZW1lbnRUeXBlLCBBcnJheVNpemUgZXh0ZW5kcyBudW1iZXI+ID1cbiAgICBBcnJheVNpemUgZXh0ZW5kcyBBcnJheVNpemVcbiAgICAgICAgPyBudW1iZXIgZXh0ZW5kcyBBcnJheVNpemVcbiAgICAgICAgICAgID8gVEFycmF5PEVsZW1lbnRUeXBlPlxuICAgICAgICAgICAgOiBUSXNOb25OZWdhdGl2ZUludGVnZXI8QXJyYXlTaXplPiBleHRlbmRzIHRydWVcbiAgICAgICAgICAgICAgICA/IFRCdWlsZFN0YXRpY1RBcnJheTxFbGVtZW50VHlwZSwgQXJyYXlTaXplPlxuICAgICAgICAgICAgICAgIDogbmV2ZXJcbiAgICAgICAgOiBuZXZlcjtcbiIsIi8qIEZpbGU6ICAgICAgRnVuY3Rpb25hbC5UeXBlcy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmV4cG9ydCB0eXBlIEZTaW1wbGVDYWxsYmFjayA9ICgpID0+IHZvaWQ7XG5leHBvcnQgdHlwZSBGU2ltcGxlQ2FsbGJhY2tBc3luYyA9ICgpID0+IFByb21pc2U8dm9pZD47XG5leHBvcnQgdHlwZSBGU2ltcGxlQ2FsbGJhY2tNYXliZUFzeW5jID0gRlNpbXBsZUNhbGxiYWNrIHwgRlNpbXBsZUNhbGxiYWNrQXN5bmM7XG5cbmV4cG9ydCB0eXBlIFRTaW1wbGVGdW5jdGlvbjxQYXJhbWV0ZXJUeXBlLCBSZXR1cm5UeXBlID0gdm9pZD4gPSAoSW46IFBhcmFtZXRlclR5cGUpID0+IFJldHVyblR5cGU7XG5cbmV4cG9ydCB0eXBlIFRSZXNvbHZlRnVuY3Rpb248VHlwZT4gPSAoVmFsdWU6IFR5cGUgfCBQcm9taXNlTGlrZTxUeXBlPikgPT4gdm9pZDtcbmV4cG9ydCB0eXBlIEZSZWplY3RGdW5jdGlvbiA9IChSZWFzb24/OiB1bmtub3duKSA9PiB2b2lkO1xuIiwiLyogRmlsZTogICAgICBVdGlsaXR5LlR5cGVzLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGUmVjb3JkIH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuLy8gaW1wb3J0IHR5cGUgeyBURWl0aGVyUmVjb3JkIH0gZnJvbSBcIi4vUmVjb3JkLlR5cGVzXCI7XG5cbmV4cG9ydCB0eXBlIFRJc05vbk5lZ2F0aXZlSW50ZWdlcjxBcnJheVNpemUgZXh0ZW5kcyBudW1iZXI+ID1cbiAgICBgJHsgQXJyYXlTaXplIH1gIGV4dGVuZHMgYC0keyBzdHJpbmcgfWBcbiAgICAgICAgPyBmYWxzZVxuICAgICAgICA6IGAkeyBBcnJheVNpemUgfWAgZXh0ZW5kcyBgJHsgYmlnaW50IH1gXG4gICAgICAgICAgICA/IHRydWVcbiAgICAgICAgICAgIDogZmFsc2U7XG5cbnR5cGUgVEJ1aWxkVHVwbGU8XG4gICAgTGVuZ3RoIGV4dGVuZHMgbnVtYmVyLFxuICAgIEFjY3VtdWxhdG9yIGV4dGVuZHMgVEFycmF5PHVua25vd24+ID0gW11cbj4gPVxuICAgIEFjY3VtdWxhdG9yW1wibGVuZ3RoXCJdIGV4dGVuZHMgTGVuZ3RoXG4gICAgICAgID8gQWNjdW11bGF0b3JcbiAgICAgICAgOiBUQnVpbGRUdXBsZTxMZW5ndGgsIFsuLi5BY2N1bXVsYXRvciwgdW5rbm93bl0+O1xuXG50eXBlIFRJc0xlc3NUaGFuT3JFcXVhbDxcbiAgICBMZWZ0IGV4dGVuZHMgbnVtYmVyLFxuICAgIFJpZ2h0IGV4dGVuZHMgbnVtYmVyXG4+ID1cbiAgICBUQnVpbGRUdXBsZTxSaWdodD4gZXh0ZW5kcyBbLi4uVEJ1aWxkVHVwbGU8TGVmdD4sIC4uLmluZmVyIF8gXVxuICAgICAgICA/IHRydWVcbiAgICAgICAgOiBmYWxzZTtcblxudHlwZSBUSW5jbHVzaXZlUmFuZ2VGcm9tVHVwbGU8XG4gICAgQ3VycmVudFR1cGxlIGV4dGVuZHMgVEFycmF5PHVua25vd24+LFxuICAgIEVuZFZhbHVlIGV4dGVuZHMgbnVtYmVyLFxuICAgIFJlc3VsdCBleHRlbmRzIG51bWJlciA9IG5ldmVyXG4+ID1cbiAgICBDdXJyZW50VHVwbGVbXCJsZW5ndGhcIl0gZXh0ZW5kcyBFbmRWYWx1ZVxuICAgICAgICA/IFJlc3VsdCB8IEVuZFZhbHVlXG4gICAgICAgIDogVEluY2x1c2l2ZVJhbmdlRnJvbVR1cGxlPFxuICAgICAgICAgICAgWy4uLkN1cnJlbnRUdXBsZSwgdW5rbm93bl0sXG4gICAgICAgICAgICBFbmRWYWx1ZSxcbiAgICAgICAgICAgIFJlc3VsdCB8IEN1cnJlbnRUdXBsZVtcImxlbmd0aFwiXVxuICAgICAgICA+O1xuXG5leHBvcnQgdHlwZSBUSW50ZWdyYWxSYW5nZTxcbiAgICBTdGFydFZhbHVlIGV4dGVuZHMgbnVtYmVyLFxuICAgIEVuZFZhbHVlIGV4dGVuZHMgbnVtYmVyXG4+ID1cbiAgICBudW1iZXIgZXh0ZW5kcyBTdGFydFZhbHVlXG4gICAgICAgID8gbmV2ZXJcbiAgICAgICAgOiBudW1iZXIgZXh0ZW5kcyBFbmRWYWx1ZVxuICAgICAgICAgICAgPyBuZXZlclxuICAgICAgICAgICAgOiBUSXNOb25OZWdhdGl2ZUludGVnZXI8U3RhcnRWYWx1ZT4gZXh0ZW5kcyB0cnVlXG4gICAgICAgICAgICAgICAgPyBUSXNOb25OZWdhdGl2ZUludGVnZXI8RW5kVmFsdWU+IGV4dGVuZHMgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICA/IFRJc0xlc3NUaGFuT3JFcXVhbDxTdGFydFZhbHVlLCBFbmRWYWx1ZT4gZXh0ZW5kcyB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICA/IFRJbmNsdXNpdmVSYW5nZUZyb21UdXBsZTxUQnVpbGRUdXBsZTxTdGFydFZhbHVlPiwgRW5kVmFsdWU+XG4gICAgICAgICAgICAgICAgICAgICAgICA6IG5ldmVyXG4gICAgICAgICAgICAgICAgICAgIDogbmV2ZXJcbiAgICAgICAgICAgICAgICA6IG5ldmVyO1xuXG4vKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xuZXhwb3J0IHR5cGUgRkFueUZ1bmN0aW9uID0gKC4uLkFyZ3VtZW50czogYW55KSA9PiBhbnk7XG5cbmV4cG9ydCB0eXBlIFRSZWNvcmROb25OdWxsYWJsZTxSZWNvcmRUeXBlIGV4dGVuZHMgRlJlY29yZD4gPVxue1xuICAgIFsgS2V5IGluIGtleW9mIFJlY29yZFR5cGUgXTogTm9uTnVsbGFibGU8UmVjb3JkVHlwZVtLZXldPjtcbn07XG5cbmV4cG9ydCB0eXBlIFRBcnJheU5vbmVtcHR5PFR5cGUgPSB1bmtub3duPiA9IFsgVHlwZSwgLi4uVEFycmF5PFR5cGU+IF07XG5cbmV4cG9ydCB0eXBlIFRNYXRyaXg8VHlwZT4gPSBUQXJyYXk8VEFycmF5PFR5cGU+PjtcbmV4cG9ydCB0eXBlIFRTYWZlTWF0cml4PFR5cGU+ID0gVEFycmF5Tm9uZW1wdHk8VEFycmF5Tm9uZW1wdHk8VHlwZT4+O1xuXG5leHBvcnQgdHlwZSBURXh0cmFjdEZ1bmN0aW9uPFR5cGU+ID1cbiAgICBUeXBlIGV4dGVuZHMgeyAoLi4uQXJndW1lbnRzOiBpbmZlciBBcmd1bWVudFZlY3RvclR5cGUpOiBpbmZlciBSZXR1cm5UeXBlIH1cbiAgICAgICAgPyAoLi4uQXJndW1lbnRzOiBBcmd1bWVudFZlY3RvclR5cGUpID0+IFJldHVyblR5cGVcbiAgICAgICAgOiBuZXZlcjtcblxuZXhwb3J0IHR5cGUgVFByb21pc2VUaGVuRnVuY3Rpb248UGFyYW1ldGVyVHlwZSA9IHVua25vd24sIFJldHVyblR5cGUgPSB1bmtub3duPiA9XG4gICAgKFZhbHVlOiBQYXJhbWV0ZXJUeXBlKSA9PiBSZXR1cm5UeXBlO1xuXG5leHBvcnQgdHlwZSBUUHJvbWlzZUNhdGNoRnVuY3Rpb248VHlwZSA9IHVua25vd24+ID1cbiAgICBQYXJhbWV0ZXJzPFRFeHRyYWN0RnVuY3Rpb248UHJvbWlzZTxUeXBlPltcImNhdGNoXCJdPj5bMF07XG5cbmV4cG9ydCB0eXBlIEZQYXRoS2V5ID0gbnVtYmVyIHwgc3RyaW5nO1xuZXhwb3J0IHR5cGUgRlBhdGhSZWNvcmQgPSBSZWNvcmQ8RlBhdGhLZXksIHVua25vd24+O1xuXG50eXBlIFRSZWNvcmRQcm9wZXJ0eTxLZXlUeXBlIGV4dGVuZHMgRlBhdGhLZXk+ID0gYC4keyBLZXlUeXBlIH1gO1xuXG50eXBlIFRSZWNvcmRQYXRoUGFydDxQcm9wZXJ0eUtleVR5cGUgZXh0ZW5kcyBrZXlvZiBQYXJlbnRUeXBlLCBQYXJlbnRUeXBlIGV4dGVuZHMgRlBhdGhSZWNvcmQ+ID1cbiAgICBQcm9wZXJ0eUtleVR5cGUgZXh0ZW5kcyBGUGF0aEtleVxuICAgICAgICA/IFBhcmVudFR5cGVbUHJvcGVydHlLZXlUeXBlXSBleHRlbmRzIEZQYXRoUmVjb3JkXG4gICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHN0eWxpc3RpYy9tYXgtbGVuICovXG4gICAgICAgICAgICA/IGAkeyBUUmVjb3JkUHJvcGVydHk8UHJvcGVydHlLZXlUeXBlPiB9JHsgVFJlY29yZFBhdGhQYXJ0PGtleW9mIFBhcmVudFR5cGVbUHJvcGVydHlLZXlUeXBlXSwgUGFyZW50VHlwZVtQcm9wZXJ0eUtleVR5cGVdPiB9YFxuICAgICAgICAgICAgOiBgJHsgVFJlY29yZFByb3BlcnR5PFByb3BlcnR5S2V5VHlwZT4gfWBcbiAgICAgICAgOiBuZXZlcjtcblxuZXhwb3J0IHR5cGUgVE9iamVjdFBhdGg8XG4gICAgUmVjb3JkVHlwZSBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICAgIE9iamVjdE5hbWVUeXBlIGV4dGVuZHMgc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkPiA9XG4gICAgICAgIE9iamVjdE5hbWVUeXBlIGV4dGVuZHMgc3RyaW5nXG4gICAgICAgICAgICA/IGAkeyBPYmplY3ROYW1lVHlwZSB9JHsgVFJlY29yZFBhdGhQYXJ0PGtleW9mIFJlY29yZFR5cGUsIFJlY29yZFR5cGU+IH1gXG4gICAgICAgICAgICA6IFRSZWNvcmRQYXRoUGFydDxrZXlvZiBSZWNvcmRUeXBlLCBSZWNvcmRUeXBlPiBleHRlbmRzIGAuJHsgaW5mZXIgT3V0VHlwZSB9YFxuICAgICAgICAgICAgICAgID8gT3V0VHlwZVxuICAgICAgICAgICAgICAgIDogbmV2ZXI7XG5cbnR5cGUgRlN0cmluZ051bU1hcCA9XG57XG4gICAgXCIwXCI6IDA7XG4gICAgXCIxXCI6IDE7XG4gICAgXCIyXCI6IDI7XG4gICAgXCIzXCI6IDM7XG4gICAgXCI0XCI6IDQ7XG4gICAgXCI1XCI6IDU7XG4gICAgXCI2XCI6IDY7XG4gICAgXCI3XCI6IDc7XG4gICAgXCI4XCI6IDg7XG4gICAgXCI5XCI6IDk7XG59O1xuXG50eXBlIFRTdHJpbmdUb051bTxUeXBlPiA9IFR5cGUgZXh0ZW5kcyBrZXlvZiBGU3RyaW5nTnVtTWFwXG4gICAgPyBGU3RyaW5nTnVtTWFwW1R5cGVdXG4gICAgOiBUeXBlO1xuXG4vLyAvKiBlc2xpbnQtZGlzYWJsZSBAc3R5bGlzdGljL21heC1sZW4gKi9cbi8vIGV4cG9ydCB0eXBlIFRUeXBlRnJvbVBhdGg8XG4vLyAgICAgUGF0aFR5cGUgZXh0ZW5kcyBzdHJpbmcsXG4vLyAgICAgVHlwZSBleHRlbmRzIEZQYXRoUmVjb3JkPiA9XG4vLyAgICAgUGF0aFR5cGUgZXh0ZW5kcyBgJHsgaW5mZXIgS2V5VHlwZU9uZSB9LiR7IGluZmVyIEtleVR5cGVUd28gfS4keyBpbmZlciBLZXlUeXBlVGhyZWUgfS4keyBpbmZlciBLZXlUeXBlRm91ciB9LiR7IGluZmVyIEtleVR5cGVGaXZlIH1gXG4vLyAgICAgICAgIC8vID8gS2V5VHlwZU9uZSBleHRlbmRzIGAkeyBFeGNsdWRlPGtleW9mIFR5cGUsIHN5bWJvbD4gfWBcbi8vICAgICAgICAgLy8gICAgID8gS2V5VHlwZVR3byBleHRlbmRzIGAkeyBFeGNsdWRlPGtleW9mIFR5cGVbS2V5VHlwZU9uZV0sIHN5bWJvbD4gfWBcbi8vICAgICAgICAgLy8gICAgICAgICA/IEtleVR5cGVUd28gZXh0ZW5kcyBrZXlvZiBUeXBlW0tleVR5cGVPbmVdXG4vLyAgICAgICAgIC8vICAgICAgICAgICAgID8gS2V5VHlwZVRocmVlIGV4dGVuZHMgYCR7IEV4Y2x1ZGU8a2V5b2YgVHlwZVtLZXlUeXBlT25lXVtLZXlUeXBlVHdvXSwgc3ltYm9sPiB9YFxuLy8gICAgICAgICA/IFRTdHJpbmdUb051bTxLZXlUeXBlT25lPiBleHRlbmRzIGtleW9mIFR5cGVcbi8vICAgICAgICAgICAgID8gVFN0cmluZ1RvTnVtPEtleVR5cGVUd28+IGV4dGVuZHMga2V5b2YgVHlwZVtUU3RyaW5nVG9OdW08S2V5VHlwZU9uZT5dXG4vLyAgICAgICAgICAgICAgICAgPyBUU3RyaW5nVG9OdW08S2V5VHlwZVRocmVlPiBleHRlbmRzIGtleW9mIFR5cGVbVFN0cmluZ1RvTnVtPEtleVR5cGVPbmU+XVtUU3RyaW5nVG9OdW08S2V5VHlwZVR3bz5dXG4vLyAgICAgICAgICAgICAgICAgICAgID8gVFN0cmluZ1RvTnVtPEtleVR5cGVGb3VyPiBleHRlbmRzIGtleW9mIFR5cGVbVFN0cmluZ1RvTnVtPEtleVR5cGVPbmU+XVtUU3RyaW5nVG9OdW08S2V5VHlwZVR3bz5dW1RTdHJpbmdUb051bTxLZXlUeXBlVGhyZWU+XVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgPyBUU3RyaW5nVG9OdW08S2V5VHlwZUZpdmU+IGV4dGVuZHMga2V5b2YgVHlwZVtUU3RyaW5nVG9OdW08S2V5VHlwZU9uZT5dW1RTdHJpbmdUb051bTxLZXlUeXBlVHdvPl1bVFN0cmluZ1RvTnVtPEtleVR5cGVUaHJlZT5dW1RTdHJpbmdUb051bTxLZXlUeXBlRm91cj5dXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBUeXBlW1RTdHJpbmdUb051bTxLZXlUeXBlT25lPl1bVFN0cmluZ1RvTnVtPEtleVR5cGVUd28+XVtUU3RyaW5nVG9OdW08S2V5VHlwZVRocmVlPl1bVFN0cmluZ1RvTnVtPEtleVR5cGVGb3VyPl1bVFN0cmluZ1RvTnVtPEtleVR5cGVGaXZlPl1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG5ldmVyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICA6IG5ldmVyXG4vLyAgICAgICAgICAgICAgICAgICAgIDogbmV2ZXJcbi8vICAgICAgICAgICAgICAgICA6IG5ldmVyXG4vLyAgICAgICAgICAgICA6IG5ldmVyXG4vLyAgICAgICAgIDogUGF0aFR5cGUgZXh0ZW5kcyBgJHsgaW5mZXIgS2V5VHlwZU9uZSB9LiR7IGluZmVyIEtleVR5cGVUd28gfS4keyBpbmZlciBLZXlUeXBlVGhyZWUgfS4keyBpbmZlciBLZXlUeXBlRm91ciB9YFxuLy8gICAgICAgICAgICAgPyBUU3RyaW5nVG9OdW08S2V5VHlwZU9uZT4gZXh0ZW5kcyBrZXlvZiBUeXBlXG4vLyAgICAgICAgICAgICAgICAgPyBUU3RyaW5nVG9OdW08S2V5VHlwZVR3bz4gZXh0ZW5kcyBrZXlvZiBUeXBlW1RTdHJpbmdUb051bTxLZXlUeXBlT25lPl1cbi8vICAgICAgICAgICAgICAgICAgICAgPyBUU3RyaW5nVG9OdW08S2V5VHlwZVR3bz4gZXh0ZW5kcyBrZXlvZiBUeXBlW1RTdHJpbmdUb051bTxLZXlUeXBlT25lPl1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgID8gVFN0cmluZ1RvTnVtPEtleVR5cGVUaHJlZT4gZXh0ZW5kcyBrZXlvZiBUeXBlW1RTdHJpbmdUb051bTxLZXlUeXBlT25lPl1bVFN0cmluZ1RvTnVtPEtleVR5cGVUd28+XVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gVFN0cmluZ1RvTnVtPEtleVR5cGVGb3VyPiBleHRlbmRzIGtleW9mIFR5cGVbVFN0cmluZ1RvTnVtPEtleVR5cGVPbmU+XVtUU3RyaW5nVG9OdW08S2V5VHlwZVR3bz5dW1RTdHJpbmdUb051bTxLZXlUeXBlVGhyZWU+XVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFR5cGVbVFN0cmluZ1RvTnVtPEtleVR5cGVPbmU+XVtUU3RyaW5nVG9OdW08S2V5VHlwZVR3bz5dW1RTdHJpbmdUb051bTxLZXlUeXBlVGhyZWU+XVtUU3RyaW5nVG9OdW08S2V5VHlwZUZvdXI+XVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG5ldmVyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlclxuLy8gICAgICAgICAgICAgICAgICAgICA6IG5ldmVyXG4vLyAgICAgICAgICAgICAgICAgOiBuZXZlclxuLy8gICAgICAgICAgICAgOiBQYXRoVHlwZSBleHRlbmRzIGAkeyBpbmZlciBLZXlUeXBlT25lIH0uJHsgaW5mZXIgS2V5VHlwZVR3byB9LiR7IGluZmVyIEtleVR5cGVUaHJlZSB9YFxuLy8gICAgICAgICAgICAgICAgID8gVFN0cmluZ1RvTnVtPEtleVR5cGVPbmU+IGV4dGVuZHMga2V5b2YgVHlwZVxuLy8gICAgICAgICAgICAgICAgICAgICA/IFRTdHJpbmdUb051bTxLZXlUeXBlVHdvPiBleHRlbmRzIGtleW9mIFR5cGVbVFN0cmluZ1RvTnVtPEtleVR5cGVPbmU+XVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgPyBUU3RyaW5nVG9OdW08S2V5VHlwZVR3bz4gZXh0ZW5kcyBrZXlvZiBUeXBlW1RTdHJpbmdUb051bTxLZXlUeXBlT25lPl1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFRTdHJpbmdUb051bTxLZXlUeXBlVGhyZWU+IGV4dGVuZHMga2V5b2YgVHlwZVtUU3RyaW5nVG9OdW08S2V5VHlwZU9uZT5dW1RTdHJpbmdUb051bTxLZXlUeXBlVHdvPl1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBUeXBlW1RTdHJpbmdUb051bTxLZXlUeXBlT25lPl1bVFN0cmluZ1RvTnVtPEtleVR5cGVUd28+XVtUU3RyaW5nVG9OdW08S2V5VHlwZVRocmVlPl1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuZXZlclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbmV2ZXJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIDogbmV2ZXJcbi8vICAgICAgICAgICAgICAgICAgICAgOiBuZXZlclxuLy8gICAgICAgICAgICAgICAgIDogUGF0aFR5cGUgZXh0ZW5kcyBgJHsgaW5mZXIgS2V5VHlwZU9uZSB9LiR7IGluZmVyIEtleVR5cGVUd28gfWBcbi8vICAgICAgICAgICAgICAgICAgICAgPyBUU3RyaW5nVG9OdW08S2V5VHlwZU9uZT4gZXh0ZW5kcyBrZXlvZiBUeXBlXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICA/IFRTdHJpbmdUb051bTxLZXlUeXBlVHdvPiBleHRlbmRzIGtleW9mIFR5cGVbVFN0cmluZ1RvTnVtPEtleVR5cGVPbmU+XVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gVHlwZVtUU3RyaW5nVG9OdW08S2V5VHlwZU9uZT5dW1RTdHJpbmdUb051bTxLZXlUeXBlVHdvPl1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG5ldmVyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICA6IG5ldmVyXG4vLyAgICAgICAgICAgICAgICAgICAgIDogUGF0aFR5cGUgZXh0ZW5kcyBrZXlvZiBUeXBlXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICA/IFR5cGVbUGF0aFR5cGVdXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICA6IG5ldmVyO1xuLy8gLyogZXNsaW50LWVuYWJsZSBAc3R5bGlzdGljL21heC1sZW4gKi9cblxuZXhwb3J0IHR5cGUgRkNvbG9yID0gYCMkeyBzdHJpbmcgfWA7XG5leHBvcnQgdHlwZSBUUmVmPFR5cGU+ID0geyBSZWY6IFR5cGUgfCB1bmRlZmluZWQgfTtcblxuZXhwb3J0IHR5cGUgRlR5cGVvZiA9XG4gICAgfCBcIm9iamVjdFwiXG4gICAgfCBcInN0cmluZ1wiXG4gICAgfCBcIm51bWJlclwiXG4gICAgfCBcImJpZ2ludFwiXG4gICAgfCBcImJvb2xlYW5cIlxuICAgIHwgXCJmdW5jdGlvblwiXG4gICAgfCBcInN5bWJvbFwiXG4gICAgfCBcInVuZGVmaW5lZFwiO1xuXG5leHBvcnQgdHlwZSBUTWFwUmVjb3JkVHJhbnNmb3JtZXI8S2V5VHlwZSBleHRlbmRzIFByb3BlcnR5S2V5LCBQcm9wZXJ0eVR5cGUsIEVsZW1lbnRUeXBlPiA9XG4gICAgKEtleTogS2V5VHlwZSwgUHJvcGVydHk6IFByb3BlcnR5VHlwZSwgSW5kZXg6IG51bWJlcikgPT4gRWxlbWVudFR5cGU7XG5cbmV4cG9ydCB0eXBlIFRGbGF0TWFwUmVjb3JkVHJhbnNmb3JtZXI8S2V5VHlwZSBleHRlbmRzIFByb3BlcnR5S2V5LCBQcm9wZXJ0eVR5cGUsIEVsZW1lbnRUeXBlPiA9XG4gICAgKEtleTogS2V5VHlwZSwgUHJvcGVydHk6IFByb3BlcnR5VHlwZSwgSW5kZXg6IG51bWJlcikgPT4gRWxlbWVudFR5cGUgfCBBcnJheTxFbGVtZW50VHlwZT47XG4iLCIvKiBGaWxlOiAgICAgIFV0aWxpdHkudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7XG4gICAgRkFueUZ1bmN0aW9uLFxuICAgIEZQYXRoUmVjb3JkLFxuICAgIFRGbGF0TWFwUmVjb3JkVHJhbnNmb3JtZXIsXG4gICAgVE1hcFJlY29yZFRyYW5zZm9ybWVyLFxuICAgIFRSZWYgfSBmcm9tIFwiLi9VdGlsaXR5LlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IEZCb3gsIEZSZWNvcmQsIFRSZWNvcmQgfSBmcm9tIFwiQHNvcnJlbGx3bS93aW5kb3dzXCI7XG5pbXBvcnQgdHlwZSB7IEZSZWplY3RGdW5jdGlvbiwgVFJlc29sdmVGdW5jdGlvbiB9IGZyb20gXCIuL0Z1bmN0aW9uYWwuVHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgRkxvZ2dlciB9IGZyb20gXCIuLi8uLi9TaGFyZWRcIjtcbmltcG9ydCB7IEdldExvZ2dlciB9IGZyb20gXCJAL0xvZ1wiO1xuaW1wb3J0IHR5cGUgeyBUUGF0aCwgVEdldFR5cGUgfSBmcm9tIFwiLi9PYmplY3QuVHlwZXNcIjtcblxuY29uc3QgTG9nOiBGTG9nZ2VyID0gR2V0TG9nZ2VyKFwiVXRpbGl0eVwiKTtcblxudHlwZSBITW9uaXRvciA9IHtcbiAgICBIYW5kbGU6IG51bWJlcjtcbn07XG5cbnR5cGUgSFdpbmRvdyA9IHtcbiAgICBIYW5kbGU6IHN0cmluZztcbn07XG5cbmV4cG9ydCBjb25zdCBHZXRFbXB0eU1vbml0b3IgPSAoKTogSE1vbml0b3IgPT5cbntcbiAgICByZXR1cm4ge1xuICAgICAgICBIYW5kbGU6IC0xXG4gICAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBHZXRFbXB0eVdpbmRvdyA9ICgpOiBIV2luZG93ID0+XG57XG4gICAgcmV0dXJuIHtcbiAgICAgICAgSGFuZGxlOiBcIlwiXG4gICAgfTtcbn07XG5cbi8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLWZ1bmN0aW9uLXR5cGUsIEBzdHlsaXN0aWMvYnJhY2Utc3R5bGUgKi9cbmNvbnN0IEFzeW5jRnVuY3Rpb246IEZ1bmN0aW9uID0gKGFzeW5jIGZ1bmN0aW9uICgpIHsgfSkuY29uc3RydWN0b3I7XG5cbmV4cG9ydCBmdW5jdGlvbiBJc0FzeW5jRnVuY3Rpb24oVmFsdWU6IHVua25vd24pOiBWYWx1ZSBpcyAoLi4uQXJndW1lbnRzOiBUQXJyYXk8dW5rbm93bj4pID0+IFByb21pc2U8dW5rbm93bj5cbntcbiAgICByZXR1cm4gdHlwZW9mIFZhbHVlID09PSBcImZ1bmN0aW9uXCIgJiYgVmFsdWUuY29uc3RydWN0b3IgPT09IEFzeW5jRnVuY3Rpb247XG59XG5cbmV4cG9ydCBjb25zdCBDYWxsTWF5YmVBc3luYyA9IGFzeW5jIDxcbiAgICBJblJldHVyblR5cGUsXG4gICAgSW5QYXJhbWV0ZXJzIGV4dGVuZHMgUGFyYW1ldGVyczxGQW55RnVuY3Rpb24+LFxuICAgIEZ1bmN0aW9uVHlwZSBleHRlbmRzICgoLi4uQXJndW1lbnRWZWN0b3I6IEluUGFyYW1ldGVycykgPT4gSW5SZXR1cm5UeXBlKT4oXG4gICAgRnVuY3Rpb246IEZ1bmN0aW9uVHlwZSxcbiAgICAuLi5Bcmd1bWVudFZlY3RvcjogSW5QYXJhbWV0ZXJzXG4pOiBQcm9taXNlPEluUmV0dXJuVHlwZT4gPT5cbntcbiAgICBpZiAoSXNBc3luY0Z1bmN0aW9uKEZ1bmN0aW9uKSlcbiAgICB7XG4gICAgICAgIHJldHVybiBhd2FpdCBGdW5jdGlvbiguLi5Bcmd1bWVudFZlY3Rvcik7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIHJldHVybiBGdW5jdGlvbiguLi5Bcmd1bWVudFZlY3Rvcik7XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IFplcm9Cb3g6IEZCb3ggPVxue1xuICAgIEhlaWdodDogMCxcbiAgICBXaWR0aDogMCxcbiAgICBYOiAwLFxuICAgIFk6IDBcbn07XG5cbmV4cG9ydCBjb25zdCBFeHRyYWN0RnJvbVJlY29yZEFycmF5ID0gPFxuICAgIEtleVR5cGUgZXh0ZW5kcyBQcm9wZXJ0eUtleSA9IFByb3BlcnR5S2V5LFxuICAgIFJlY29yZFR5cGUgZXh0ZW5kcyBSZWNvcmQ8S2V5VHlwZSwgdW5rbm93bj4gPSBSZWNvcmQ8S2V5VHlwZSwgdW5rbm93bj4+KFxuICAgIEtleTogS2V5VHlwZSxcbiAgICBJbkFycmF5OiBUQXJyYXk8UmVjb3JkVHlwZT5cbik6IFRBcnJheTxSZWNvcmRUeXBlW0tleVR5cGVdPiA9Plxue1xuICAgIHJldHVybiBJbkFycmF5Lm1hcCgoUmVjb3JkOiBSZWNvcmRUeXBlKTogUmVjb3JkVHlwZVtLZXlUeXBlXSA9PlxuICAgIHtcbiAgICAgICAgcmV0dXJuIFJlY29yZFtLZXldO1xuICAgIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IEdldEJ5S2V5ID0gPFJlY29yZFR5cGUgZXh0ZW5kcyBGUmVjb3JkLCBLZXlUeXBlIGV4dGVuZHMga2V5b2YgUmVjb3JkVHlwZT4oXG4gICAgS2V5OiBLZXlUeXBlXG4pOiAoKEluOiBSZWNvcmRUeXBlKSA9PiBSZWNvcmRUeXBlW0tleVR5cGVdKSA9Plxue1xuICAgIHJldHVybiAoUmVjb3JkOiBSZWNvcmRUeXBlKTogUmVjb3JkVHlwZVtLZXlUeXBlXSA9PlxuICAgIHtcbiAgICAgICAgcmV0dXJuIFJlY29yZFtLZXldO1xuICAgIH07XG59O1xuXG5leHBvcnQgY29uc3QgRGVsYXkgPSBhc3luYyAoRHVyYXRpb246IG51bWJlcik6IFByb21pc2U8dm9pZD4gPT5cbntcbiAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKFJlc29sdmU6IFRSZXNvbHZlRnVuY3Rpb248dm9pZD4sIF9SZWplY3Q6IEZSZWplY3RGdW5jdGlvbik6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIHNldFRpbWVvdXQoUmVzb2x2ZSwgRHVyYXRpb24pO1xuICAgIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IFJldHJ5VW50aWxGdWxmaWxsZWQgPSBhc3luYyA8VHlwZT4oXG4gICAgSW46ICgoKSA9PiBQcm9taXNlPFR5cGU+KSxcbiAgICBOdW1UcmllczogbnVtYmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkLFxuICAgIER1cmF0aW9uVG9Ucnk6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuKTogUHJvbWlzZTxUeXBlIHwgdW5kZWZpbmVkPiA9Plxue1xuICAgIGxldCBTdGFydFRpbWU6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICAgIGxldCBMYXN0Q29tcGxldGlvblRpbWU6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBsZXQgTnVtQXR0ZW1wdHM6IG51bWJlciA9IDA7XG5cbiAgICBjb25zdCBIYXNFeGNlZWRlZExpbWl0cyA9ICgpOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICBjb25zdCBFeGNlZWRlZE51bUF0dGVtcHRzOiBib29sZWFuID0gKE51bVRyaWVzICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICA/IE51bUF0dGVtcHRzID09PSBOdW1Ucmllc1xuICAgICAgICAgICAgOiBmYWxzZTtcblxuICAgICAgICBjb25zdCBBcmVEdXJhdGlvblZhcmlhYmxlc0luaXRpYWxpemVkOiBib29sZWFuID0gKFxuICAgICAgICAgICAgRHVyYXRpb25Ub1RyeSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICBMYXN0Q29tcGxldGlvblRpbWUgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgU3RhcnRUaW1lICE9PSB1bmRlZmluZWRcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoU3RhcnRUaW1lICE9PSB1bmRlZmluZWQgJiYgTGFzdENvbXBsZXRpb25UaW1lICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIFN0YXJ0VGltZSA9IExhc3RDb21wbGV0aW9uVGltZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IEV4Y2VlZGVkRHVyYXRpb25Ub1RyeTogYm9vbGVhbiA9IEFyZUR1cmF0aW9uVmFyaWFibGVzSW5pdGlhbGl6ZWRcbiAgICAgICAgICAgID8gKChMYXN0Q29tcGxldGlvblRpbWUgYXMgbnVtYmVyKSAtIChTdGFydFRpbWUgYXMgbnVtYmVyKSkgPj0gKER1cmF0aW9uVG9UcnkgYXMgbnVtYmVyKVxuICAgICAgICAgICAgOiBmYWxzZTtcblxuICAgICAgICByZXR1cm4gRXhjZWVkZWROdW1BdHRlbXB0cyB8fCBFeGNlZWRlZER1cmF0aW9uVG9Ucnk7XG4gICAgfTtcblxuICAgIHdoaWxlIChIYXNFeGNlZWRlZExpbWl0cygpKVxuICAgIHtcbiAgICAgICAgdHJ5XG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IE91dDogVHlwZSA9IGF3YWl0IEluKCk7XG4gICAgICAgICAgICByZXR1cm4gT3V0O1xuICAgICAgICB9XG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnMgKi9cbiAgICAgICAgY2F0Y2ggKF9FcnJvcjogdW5rbm93bilcbiAgICAgICAge1xuICAgICAgICAgICAgTGFzdENvbXBsZXRpb25UaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICBpZiAoTnVtVHJpZXMgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBOdW1BdHRlbXB0cysrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbmV4cG9ydCBjb25zdCBTZXRQcm9wZXJ0eUZyb21QYXRoID0gPFxuICAgIFJlY29yZFR5cGUgZXh0ZW5kcyBGUGF0aFJlY29yZCxcbiAgICBQYXRoVHlwZSBleHRlbmRzIFRQYXRoPFJlY29yZFR5cGU+XG4+KFxuICAgIE9iamVjdFJlZjogVFJlZjxSZWNvcmRUeXBlPixcbiAgICBQYXRoOiBQYXRoVHlwZSxcbiAgICBWYWx1ZTogVEdldFR5cGU8UmVjb3JkVHlwZSwgUGF0aFR5cGU+XG4pOiB2b2lkID0+XG57XG4gICAgdHlwZSBGUHJvcGVydHkgPSBUR2V0VHlwZTxSZWNvcmRUeXBlLCBQYXRoVHlwZT47XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShQYXRoKSlcbiAgICB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNldFByb3BlcnR5RnJvbVBhdGggZG9lcyBub3Qgc3VwcG9ydCBBcnJheS1iYXNlZCBwYXRocyB5ZXQuXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IFBhdGhTcGxpdDogQXJyYXk8c3RyaW5nPiA9IFBhdGguc3BsaXQoXCIuXCIpO1xuXG4gICAgY29uc3QgTGFzdDogc3RyaW5nIHwgdW5kZWZpbmVkID0gUGF0aFNwbGl0LnBvcCgpO1xuICAgIGlmIChMYXN0ID09PSB1bmRlZmluZWQpXG4gICAge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKFBhdGhTcGxpdC5sZW5ndGggPT09IDApXG4gICAge1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoUGF0aCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgICgoT2JqZWN0UmVmLlJlZiBhcyBUUmVjb3JkPHN0cmluZywgdW5rbm93bj4pWyhQYXRoIGFzIHN0cmluZyldKSA9IFZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgUmVjdXJyZW5jZSA9IChJbjogVFJlZjx1bmtub3duPik6IFRSZWY8dW5rbm93bj4gfCB1bmRlZmluZWQgPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IE5leHRQcm9wZXJ0eU5hbWVCYXNlOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBQYXRoU3BsaXQuc2hpZnQoKTtcblxuICAgICAgICBMb2coXCJOZXh0UHJvcGVydHlOYW1lQmFzZVwiLCBOZXh0UHJvcGVydHlOYW1lQmFzZSk7XG5cbiAgICAgICAgaWYgKE5leHRQcm9wZXJ0eU5hbWVCYXNlICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IE5leHRQcm9wZXJ0eU5hbWU6IHN0cmluZyB8IG51bWJlciA9IGlzTmFOKHBhcnNlSW50KE5leHRQcm9wZXJ0eU5hbWVCYXNlKSlcbiAgICAgICAgICAgICAgICA/IE5leHRQcm9wZXJ0eU5hbWVCYXNlXG4gICAgICAgICAgICAgICAgOiBwYXJzZUludChOZXh0UHJvcGVydHlOYW1lQmFzZSk7XG5cbiAgICAgICAgICAgIExvZyhcIk5leHRQcm9wZXJ0eU5hbWVcIiwgTmV4dFByb3BlcnR5TmFtZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IE91dDogVFJlZjx1bmtub3duPiA9IE1ha2VSZWY8dW5rbm93bj4oKTtcbiAgICAgICAgICAgIE91dC5SZWYgPSAoSW4uUmVmIGFzIFRSZWNvcmQ8c3RyaW5nLCB1bmtub3duPilbTmV4dFByb3BlcnR5TmFtZV0gYXMgdW5rbm93bjtcbiAgICAgICAgICAgIHJldHVybiBSZWN1cnJlbmNlKE91dCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gSW47XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgUHJvcGVydHlSZWY6IFRSZWY8RlByb3BlcnR5PiA9IFJlY3VycmVuY2UoT2JqZWN0UmVmKSBhcyBUUmVmPEZQcm9wZXJ0eT47XG4gICAgY29uc3QgTGFzdFR5cGVkOiBzdHJpbmcgfCBudW1iZXIgPSBpc05hTihwYXJzZUludChMYXN0KSlcbiAgICAgICAgPyBMYXN0XG4gICAgICAgIDogcGFyc2VJbnQoTGFzdCk7XG5cbiAgICAoUHJvcGVydHlSZWYuUmVmIGFzIFRSZWNvcmQ8c3RyaW5nLCB1bmtub3duPilbTGFzdFR5cGVkXSA9IFZhbHVlO1xufTtcblxuZXhwb3J0IGNvbnN0IEdldFByb3BlcnR5RnJvbVBhdGggPSA8XG4gICAgUmVjb3JkVHlwZSBleHRlbmRzIFRSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbiAgICBQYXRoVHlwZSBleHRlbmRzIFRQYXRoPFJlY29yZFR5cGU+XG4+KFxuICAgIFJlY29yZDogUmVjb3JkVHlwZSxcbiAgICBQYXRoOiBQYXRoVHlwZVxuKTogVEdldFR5cGU8UmVjb3JkVHlwZSwgUGF0aFR5cGU+ID0+XG57XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoUGF0aCkpXG4gICAge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTZXRQcm9wZXJ0eUZyb21QYXRoIGRvZXMgbm90IHN1cHBvcnQgQXJyYXktYmFzZWQgcGF0aHMgeWV0LlwiKTtcbiAgICB9XG5cbiAgICBjb25zdCBQYXRoU3BsaXQ6IEFycmF5PHN0cmluZz4gPSBQYXRoLnNwbGl0KFwiLlwiKTtcbiAgICBjb25zdCBSZWN1cnJlbmNlID0gKEluOiB1bmtub3duLCBJbmRleDogbnVtYmVyID0gMCk6IHVua25vd24gPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IEtleTogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkID0gaXNOYU4ocGFyc2VJbnQoUGF0aFNwbGl0W0luZGV4XSB8fCBcIlwiKSlcbiAgICAgICAgICAgID8gUGF0aFNwbGl0W0luZGV4XVxuICAgICAgICAgICAgOiBwYXJzZUludChQYXRoU3BsaXRbSW5kZXhdIHx8IFwiXCIpO1xuXG4gICAgICAgIGlmIChLZXkgIT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgTmV4dDogdW5rbm93biA9IChJbiBhcyBUUmVjb3JkPHN0cmluZywgdW5rbm93bj4pW0tleV07XG4gICAgICAgICAgICBpZiAoSW5kZXggIT09IFBhdGhTcGxpdC5sZW5ndGggLSAxKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBSZWN1cnJlbmNlKE5leHQsIEluZGV4ICsgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBSZWN1cnJlbmNlKFJlY29yZCkgYXMgVEdldFR5cGU8UmVjb3JkVHlwZSwgUGF0aFR5cGU+O1xufTtcblxuZXhwb3J0IGNvbnN0IE1ha2VSZWYgPSA8VHlwZT4oKTogVFJlZjxUeXBlPiA9Plxue1xuICAgIHJldHVybiB7XG4gICAgICAgIFJlZjogdW5kZWZpbmVkXG4gICAgfSBhcyBUUmVmPFR5cGU+O1xufTtcblxuZXhwb3J0IGNvbnN0IElkZW50aXR5ID0gPFR5cGU+KC4uLkFyZ3VtZW50czogVEFycmF5PFR5cGU+KSA9PiBBcmd1bWVudHM7XG5cbmV4cG9ydCBjb25zdCBNYXBSZWNvcmQgPSA8S2V5VHlwZSBleHRlbmRzIFByb3BlcnR5S2V5LCBQcm9wZXJ0eVR5cGUsIEVsZW1lbnRUeXBlPihcbiAgICBJbjogUmVjb3JkPEtleVR5cGUsIFByb3BlcnR5VHlwZT4sXG4gICAgRnVuY3Rpb246IFRNYXBSZWNvcmRUcmFuc2Zvcm1lcjxLZXlUeXBlLCBQcm9wZXJ0eVR5cGUsIEVsZW1lbnRUeXBlPlxuKTogQXJyYXk8RWxlbWVudFR5cGU+ID0+XG57XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKEluKS5tYXAoKEluS2V5OiBzdHJpbmcsIEluZGV4OiBudW1iZXIpOiBFbGVtZW50VHlwZSA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgS2V5OiBLZXlUeXBlID0gSW5LZXkgYXMgS2V5VHlwZTtcbiAgICAgICAgcmV0dXJuIEZ1bmN0aW9uKEtleSwgSW5bS2V5XSwgSW5kZXgpO1xuICAgIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IEZsYXRNYXBSZWNvcmQgPSA8S2V5VHlwZSBleHRlbmRzIFByb3BlcnR5S2V5LCBQcm9wZXJ0eVR5cGUsIEVsZW1lbnRUeXBlPihcbiAgICBJbjogUmVjb3JkPEtleVR5cGUsIFByb3BlcnR5VHlwZT4sXG4gICAgRnVuY3Rpb246IFRGbGF0TWFwUmVjb3JkVHJhbnNmb3JtZXI8S2V5VHlwZSwgUHJvcGVydHlUeXBlLCBFbGVtZW50VHlwZT5cbik6IEFycmF5PEVsZW1lbnRUeXBlPiA9Plxue1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhJbikuZmxhdE1hcCgoSW5LZXk6IHN0cmluZywgSW5kZXg6IG51bWJlcik6IEFycmF5PEVsZW1lbnRUeXBlPiA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgS2V5OiBLZXlUeXBlID0gSW5LZXkgYXMgS2V5VHlwZTtcbiAgICAgICAgY29uc3QgVHJhbnNmb3JtOiBFbGVtZW50VHlwZSB8IEFycmF5PEVsZW1lbnRUeXBlPiA9IEZ1bmN0aW9uKEtleSwgSW5bS2V5XSwgSW5kZXgpO1xuICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShUcmFuc2Zvcm0pXG4gICAgICAgICAgICA/IFRyYW5zZm9ybVxuICAgICAgICAgICAgOiBbIFRyYW5zZm9ybSBdO1xuICAgIH0pO1xufTtcbiIsIi8qIEZpbGU6ICAgICAgaW5kZXgudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5leHBvcnQgKiBmcm9tIFwiLi9BcnJheVwiO1xuZXhwb3J0ICogZnJvbSBcIi4vRnVuY3Rpb25hbC5UeXBlc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vVXRpbGl0eVwiO1xuZXhwb3J0ICogZnJvbSBcIi4vVXRpbGl0eS5UeXBlc1wiO1xuIiwiLyogRmlsZTogICAgICBpbmRleC50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjUgR2FnZSBTb3JyZWxsXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmV4cG9ydCAqIGZyb20gXCIuL0V2ZW50XCI7XG5leHBvcnQgKiBmcm9tIFwiLi9LZXlib2FyZFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vS2V5Ym9hcmQuVHlwZXNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL0xvZy5UeXBlc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vU2V0dGluZ3NcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1NoYXJlZC5UeXBlc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vU3RvcmVcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1N0b3JlLlR5cGVzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9UcmVlLlR5cGVzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9Ub2tlbnNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL1V0aWxpdHlcIjtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==