/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

export type FIpcChannel =
    | "BringIntoPanel"
    | "GetAnnotatedPanels"
    | "GetCurrentPanel"
    | "GetFocusData"
    | "GetPanelScreenshots"
    | "Log"
    | "Navigate"
    | "OnChangeFocus"
    | "ReadyForRoute"
    | "TearDown";
