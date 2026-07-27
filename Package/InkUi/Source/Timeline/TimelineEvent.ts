/**
 * An event in a timeline.
 *
 * @module @sorrell/ink-ui/Timeline/TimelineEvent
 *
 * @file      TimelineEvent.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * An event in a timeline.
 *
 * @since 1.0.0
 */
export interface TimelineEvent
{
    readonly Detail?: unknown;
    readonly DurationMilliseconds?: number;
    readonly Id: string;
    readonly Request?: unknown;
    readonly Response?: unknown;
    readonly Status?: number | string;
    readonly Timestamp: Date | number | string;
    readonly Title: string;
}
