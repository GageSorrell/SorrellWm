/**
 * Displays one timestamped event in a compact timeline row.
 *
 * @module @sorrell/ink-ui/Timeline/TimelineEntry
 *
 * @file      TimelineEntry.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { Badge } from "../Badge/Badge.tsx";
import { FormatTimestamp } from "./FormatTimestamp.ts";
import type { TimelineEvent } from "./TimelineEvent.ts";
import { useTheme } from "../Theme.tsx";

/** {@inheritDoc TimelineEntry} */
export interface TimelineEntryProps
{
    readonly Event: TimelineEvent;
    readonly Selected?: boolean;
}

export/**
       * Displays one timestamped event in a compact timeline row.
       *
       * @category Timeline
       * @since 1.0.0
       */
const TimelineEntry = ({
    Event,
    Selected = false
}: TimelineEntryProps): React.ReactNode =>
{
    const Theme = useTheme();

    return (
        <Ink.Box gap={ 1 }>
            <Ink.Text color={ Selected ? Theme.Primary : Theme.TextMuted }>
                { Selected ? "›" : "│" }
            </Ink.Text>
            <Ink.Text color={ Theme.TextMuted }>{ FormatTimestamp(Event.Timestamp) }</Ink.Text>
            <Ink.Text
                bold={ Selected }
                color={ Selected ? Theme.Primary : Theme.Text }>
                { Event.Title }
            </Ink.Text>
            { Event.Status !== undefined && (
                <Badge Color={ typeof Event.Status === "number" && Event.Status >= 400
                    ? Theme.Error
                    : Theme.Success }>
                    { Event.Status }
                </Badge>
            ) }
            { Event.DurationMilliseconds !== undefined && (
                <Ink.Text color={ Theme.TextMuted }>
                    { Event.DurationMilliseconds }ms
                </Ink.Text>
            ) }
        </Ink.Box>
    );
};
