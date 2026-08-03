/**
 * Ink presentation components for retained global log values.
 *
 * @module @sorrell/log-client/Global
 *
 * @file      Global.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Duration } from "effect";
import {
    useEffect,
    useState
} from "react";
import {
    Box,
    Text,
    useInput
} from "ink";
import {
    GradientBadge,
    useTheme
} from "@sorrell/ink-ui";
import type { GlobalLogValue } from "@sorrell/log/Global";

/** Fixed terminal height of one global value card, including its border. */
export const GlobalValueCardHeight = 5;

/** Properties for the numeric range visualization. */
export interface GlobalNumberBarProps
{
    readonly MaximumValue: number;
    readonly MinimumValue: number;
    readonly Value: number;
    readonly Width: number;
}

/** Properties for one retained global value card. */
export interface GlobalValueCardProps
{
    readonly Value: GlobalLogValue;
    readonly Width: number;
}

/** Properties for the responsive global value grid. */
export interface GlobalValueGridProps
{
    readonly Active?: boolean;
    readonly MaximumRows?: number;
    readonly Values: ReadonlyArray<GlobalLogValue>;
    readonly Width: number;
}

const MinimumCardWidth = 24;
const MaximumColumns = 4;
const CardGap = 1;

/**
 * Calculate the responsive number of global cards in each terminal row.
 *
 * @category Layout
 * @since 1.0.0
 */
export function GlobalGridColumnCount(Width: number): number
{
    return Math.max(
        1,
        Math.min(
            MaximumColumns,
            Math.floor((Math.max(1, Width) + CardGap)
                / (MinimumCardWidth + CardGap))
        )
    );
}

/**
 * Calculate the number of rows needed for a responsive global value grid.
 *
 * @category Layout
 * @since 1.0.0
 */
export function GlobalGridRowCount(
    ValueCount: number,
    Width: number
): number
{
    return Math.ceil(Math.max(0, ValueCount) / GlobalGridColumnCount(Width));
}

/**
 * Select the DateTime refresh cadence required by the displayed duration unit.
 *
 * Sub-second durations refresh four times per second, seconds refresh every
 * second, and larger durations refresh once per leading unit.
 *
 * @category DateTime
 * @since 1.0.0
 */
export function GlobalDateTimeRefreshMilliseconds(
    Value: string,
    Now = Date.now()
): number
{
    const Timestamp = new Date(Value).getTime();
    const Difference = Number.isNaN(Timestamp)
        ? 86_400_000
        : Math.max(0, Now - Timestamp);

    if (Difference < 1_000)
    {
        return 250;
    }
    if (Difference < 60_000)
    {
        return 1_000;
    }
    if (Difference < 3_600_000)
    {
        return 60_000;
    }
    if (Difference < 86_400_000)
    {
        return 3_600_000;
    }
    return 86_400_000;
}

/**
 * Format the elapsed Effect Duration between a DateTime value and the present.
 *
 * @category DateTime
 * @since 1.0.0
 */
export function FormatGlobalDuration(
    Value: string,
    Now = Date.now()
): string
{
    const Timestamp = new Date(Value).getTime();
    if (Number.isNaN(Timestamp))
    {
        return "unknown";
    }

    return Duration.format(Duration.millis(Math.max(0, Now - Timestamp)));
}

function FormatValue(Value: GlobalLogValue["Value"]): string
{
    if (Value === null)
    {
        return "null";
    }
    if (typeof Value === "string"
        || typeof Value === "number"
        || typeof Value === "boolean")
    {
        return String(Value);
    }

    switch (Value._tag)
    {
        case "BigInt":
            return `${ Value.Value }n`;
        case "Date":
            return Value.Value;
        case "Redacted":
            return Value.Label === undefined
                ? "[REDACTED]"
                : `[REDACTED: ${ Value.Label }]`;
        case "Unavailable":
            return `[Unavailable: ${ Value.Reason }]`;
        case "Truncated":
            return `[Truncated: ${ Value.Reason }]`;
        default:
            return JSON.stringify(Value);
    }
}

/**
 * Displays a bounded numeric value as a filled, color-interpolated range bar.
 *
 * @category Global values
 * @since 1.0.0
 */
export const GlobalNumberBar = ({
    MaximumValue,
    MinimumValue,
    Value,
    Width
}: GlobalNumberBarProps): React.JSX.Element =>
{
    const Theme = useTheme();
    const SafeWidth = Math.max(1, Width);
    const Ratio = Math.max(
        0,
        Math.min(1, (Value - MinimumValue) / (MaximumValue - MinimumValue))
    );
    const Filled = Math.round(Ratio * SafeWidth);
    const Characters = Array.from(
        { length: SafeWidth },
        (_Unused: unknown, Index: number) => Index < Filled ? "█" : "░"
    );

    return (
        <GradientBadge
            From={ Theme.Primary }
            Text={ Characters.join("") }
            To={ Theme.Secondary } />
    );
};


const DateTimeValue = ({
    DisplayTimeSince,
    Value
}: {
    readonly DisplayTimeSince: boolean;
    readonly Value: string;
}): React.JSX.Element =>
{
    const [ Now, SetNow ] = useState(Date.now());

    useEffect(() =>
    {
        if (!DisplayTimeSince)
        {
            return undefined;
        }

        const Timer = setTimeout(
            () => SetNow(Date.now()),
            GlobalDateTimeRefreshMilliseconds(Value, Now)
        );
        return (): void => clearTimeout(Timer);
    }, [ DisplayTimeSince, Now, Value ]);

    return (
        <Text wrap="truncate-end">
            { Value }
            { DisplayTimeSince ? ` (${ FormatGlobalDuration(Value, Now) } ago)` : "" }
        </Text>
    );
};

/**
 * Displays one retained global value with type-specific presentation.
 *
 * @category Global values
 * @since 1.0.0
 */
export const GlobalValueCard = ({
    Value,
    Width
}: GlobalValueCardProps): React.JSX.Element =>
{
    const Theme = useTheme();
    const Definition = Value.Definition;
    const IsNumber = (Definition.Type === "Integer" || Definition.Type === "Number")
        && typeof Value.Value === "number";
    const HasRange = IsNumber
        && Definition.MinimumValue !== undefined
        && Definition.MaximumValue !== undefined;
    const DisplayValue = Definition.Type === "Integer"
        && typeof Value.Value === "number"
        && Definition.MaximumValue !== undefined
        ? `${ Value.Value } / ${ Definition.MaximumValue }`
        : FormatValue(Value.Value);

    return (
        <Box
            borderColor={ Theme.Border }
            borderStyle="round"
            flexDirection="column"
            height={ GlobalValueCardHeight }
            paddingX={ 1 }
            width={ Width }>
            <Text
                bold
                color={ Theme.Primary }
                wrap="truncate-end">
                { Definition.Name }
            </Text>
            { Definition.Type === "DateTime" && typeof Value.Value === "string"
                ? (
                    <DateTimeValue
                        DisplayTimeSince={ Definition.DisplayTimeSince === true }
                        Value={ Value.Value } />
                )
                : <Text wrap="truncate-end">{ DisplayValue }</Text> }
            { HasRange && (
                <GlobalNumberBar
                    MaximumValue={ Definition.MaximumValue as number }
                    MinimumValue={ Definition.MinimumValue as number }
                    Value={ Value.Value as number }
                    Width={ Math.max(1, Width - 4) } />
            ) }
        </Box>
    );
};

/**
 * Arranges retained global values into centered responsive rows of up to four cards.
 *
 * When constrained by `MaximumRows`, arrow and page keys scroll the row
 * viewport while the grid is active.
 *
 * @category Global values
 * @since 1.0.0
 */
export const GlobalValueGrid = ({
    Active = true,
    MaximumRows,
    Values,
    Width
}: GlobalValueGridProps): React.JSX.Element =>
{
    const Columns = GlobalGridColumnCount(Width);
    const Rows: ReadonlyArray<ReadonlyArray<GlobalLogValue>> = Array.from(
        { length: Math.ceil(Values.length / Columns) },
        (_Unused: unknown, Index: number) =>
            Values.slice(Index * Columns, (Index + 1) * Columns)
    );
    const VisibleRows = Math.max(
        1,
        Math.min(Rows.length, MaximumRows ?? Rows.length)
    );
    const MaximumOffset = Math.max(0, Rows.length - VisibleRows);
    const [ Offset, SetOffset ] = useState(0);
    const CardWidth = Math.max(
        1,
        Math.floor((Math.max(1, Width) - CardGap * (Columns - 1)) / Columns)
    );

    useEffect(() =>
    {
        SetOffset((Current: number) => Math.min(Current, MaximumOffset));
    }, [ MaximumOffset ]);

    useInput((_Input, Key) =>
    {
        if (Key.upArrow)
        {
            SetOffset((Current: number) => Math.max(0, Current - 1));
        }
        else if (Key.downArrow)
        {
            SetOffset((Current: number) => Math.min(MaximumOffset, Current + 1));
        }
        else if (Key.pageUp)
        {
            SetOffset((Current: number) => Math.max(0, Current - VisibleRows));
        }
        else if (Key.pageDown)
        {
            SetOffset((Current: number) =>
                Math.min(MaximumOffset, Current + VisibleRows));
        }
    }, {
        isActive: Active && MaximumOffset > 0
    });

    if (Rows.length === 0)
    {
        return <></>;
    }

    return (
        <Box flexDirection="column">
            { Rows.slice(Offset, Offset + VisibleRows).map((
                Row: ReadonlyArray<GlobalLogValue>,
                RowIndex: number
            ) => (
                <Box
                    gap={ CardGap }
                    justifyContent="center"
                    key={ Row[0]?.Definition.Key ?? RowIndex }
                    width={ Width }>
                    { Row.map((Value: GlobalLogValue) => (
                        <GlobalValueCard
                            Value={ Value }
                            Width={ CardWidth }
                            key={ Value.Definition.Key } />
                    )) }
                </Box>
            )) }
            { MaximumOffset > 0 && (
                <Text dimColor>
                    global rows { Offset + 1 }–
                    { Math.min(Rows.length, Offset + VisibleRows) } / { Rows.length }
                </Text>
            ) }
        </Box>
    );
};
