/**
 * @file      listr-events.constants.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * Events that are triggered by Listr.
 *
 * These are stateful and singleton events by being attached to the main
 * `Listr` class and propagating to the subtasks.
 *
 * @see {@link https://listr2.kilic.dev/listr/events.html}
 */
export enum ListrEventType
{
    /** Indicates that underlying renderer should refresh the current render. */
    SHOULD_REFRESH_RENDER = "SHOULD_REFRESH_RENDER"
}
