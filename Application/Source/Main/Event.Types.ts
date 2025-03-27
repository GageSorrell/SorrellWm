/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

export type FIpcChannel =
    | "BringIntoPanel"
    | "GetAnnotatedPanels"
    | "GetCurrentPanel"
    | "GetFocusData"
    | "GetPanelScreenshots"
    | "Log"
    | "OnChangeFocus"
    | "TearDown";
