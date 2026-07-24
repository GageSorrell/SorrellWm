/**
 *
 *
 * @module @sorrell/ink-ui/Timeline/TimelineTab
 *
 * @file      TimelineTab.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { ScrollArea } from "../ScrollArea.js";
import { TimelineEntry } from "./TimelineEntry.js";
import type { TimelineEvent } from "./TimelineEvent.js";
import { useTheme } from "../Theme.js";

/** {@inheritDoc TimelineTab} */
export interface TimelineTabProps
{
    readonly Active?: boolean;
    readonly Events: ReadonlyArray<TimelineEvent>;
    readonly Height?: number;
    readonly OnOpen?: ((Event: TimelineEvent) => void) | undefined;
}

export/**
       * Renders a keyboard-navigable history of timeline events.
       *
       * @category Timeline
       * @since 1.0.0
       */
const TimelineTab = ({
    Active = true,
    Events,
    Height = 8,
    OnOpen
}: TimelineTabProps): React.ReactNode =>
{
    const Theme = useTheme();
    const [ Selected, SetSelected ] = React.useState(0);

    if (Events.length === 0)
    {
        return <Ink.Text color={ Theme.TextMuted }>No timeline events.</Ink.Text>;
    }

    return (
        <ScrollArea
            Active={ Active }
            Height={ Height }
            Items={ Events }
            OnSelect={ OnOpen }
            RenderItem={ (
                Event: TimelineEvent,
                _Index: number,
                IsSelected: boolean
            ) => (
                <TimelineEntry
                    Event={ Event }
                    Selected={ IsSelected } />
            ) }
            Index={ Selected }
            OnChangeIndex={ SetSelected } />
    );
};
