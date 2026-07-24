/**
 * Generic timeline components ported from Noodle's response history views.
 *
 * @module @sorrell/ink-ui/Timeline
 *
 * @file      Timeline.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Ink from "ink";
import * as React from "react";
import { FormatTimestamp } from "./FormatTimestamp.ts";
import { HeaderTable } from "../Header/HeaderTable.tsx";
import { JsonBodyViewer } from "../CodeEditor/JsonBodyViewer.tsx";
import { Overlay } from "../Overlay/Overlay.tsx";
import { Tabs } from "../Tabs.tsx";
import type { TimelineEvent } from "./TimelineEvent.ts";
import { useRoutedInput } from "../Interaction/Shortcut.ts";

/** {@inheritDoc TimelineDetailOverlay} */
export interface TimelineDetailOverlayProps
{
    readonly Event: TimelineEvent;
    readonly OnClose?: () => void;
}

type DetailTab =
    | "detail"
    | "request"
    | "response";

export/**
       * Displays summary, request, and response data for a timeline event.
       *
       * @category Timeline
       * @since 1.0.0
       */
const TimelineDetailOverlay = ({
    Event,
    OnClose
}: TimelineDetailOverlayProps): React.ReactNode =>
{
    const [ Tab, SetTab ] = React.useState<DetailTab>("detail");

    useRoutedInput((_Input: string, Key: Ink.Key) =>
    {
        if (Key.escape)
        {
            OnClose?.();
            return true;
        }
        return false;
    });

    const Value = Tab === "request"
        ? Event.Request
        : Tab === "response"
            ? Event.Response
            : Event.Detail;

    return (
        <Overlay Title={ Event.Title }>
            <Tabs
                Items={ [
                    { Id: "detail", Label: "Detail" },
                    { Id: "request", Label: "Request" },
                    { Id: "response", Label: "Response" }
                ] }
                OnChange={ (Id: string) => SetTab(Id as DetailTab) }
                Value={ Tab } />
            { Tab === "detail" && (
                <HeaderTable Rows={ [
                    { Name: "Time", Value: FormatTimestamp(Event.Timestamp) },
                    { Name: "Status", Value: String(Event.Status ?? "—") },
                    {
                        Name: "Duration",
                        Value: Event.DurationMilliseconds === undefined
                            ? "—"
                            : `${ Event.DurationMilliseconds }ms`
                    }
                ] } />
            ) }
            { Value !== undefined && <JsonBodyViewer Value={ Value } /> }
        </Overlay>
    );
};
