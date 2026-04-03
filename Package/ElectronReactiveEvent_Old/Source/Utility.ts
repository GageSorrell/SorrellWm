/* File:      Utility.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/**
 * `electron` provides `invoke`/`handle` for events sent from `main`, but
 * not for events that are sent from the `renderer`.  `electron-reactive-event`
 * provides this behavior for events sent from the `renderer` by sending the output
 * of `main` callbacks to the `renderer` via the channel name that comes from this function.
 *
 * @param Channel The channel of the `renderer` event that `main` will reply to via this function's output.
 * @returns The patched `Channel` name.
 */
export function GetResponseChannel(Channel: string): string
{
    return `${ Channel }__Response`;
}
