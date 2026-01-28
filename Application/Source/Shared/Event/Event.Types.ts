/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FAnnotatedPanel, FFocusChange, FPanel } from "#/Tree.Types";
import type {
    FBringIntoPanelErrorCode,
    FGetAnnotatedPanelsErrorCode,
    FGetCurrentPanelErrorCode,
    FGetFocusDataErrorCode,
    FGetInsertableWindowDataErrorCode,
    FGetPanelScreenshotsErrorCode,
    FLogErrorCode,
    FOnChangeFocusErrorCode,
    FReadyForRouteErrorCode } from "./ErrorCodes.Types";
import type { TIpcBackendEvent, TIpcEventsBase, TIpcFrontendEvent } from "./EventBase.Types";
import type { FFocusData } from "?/Event/Focus.Types";
import type { FInsertableWindowData } from "./Insert.Types";

// @TODO Create proper string unions for the error codes for each event.
export type FIpcFrontendEvents = TIpcEventsBase<{
    BringIntoPanel: TIpcFrontendEvent<
        FAnnotatedPanel,
        undefined,
        FBringIntoPanelErrorCode
    >;
    GetAnnotatedPanels: TIpcFrontendEvent<
        undefined,
        Array<FAnnotatedPanel>,
        FGetAnnotatedPanelsErrorCode
    >;
    GetCurrentPanel: TIpcFrontendEvent<
        undefined,
        FPanel,
        FGetCurrentPanelErrorCode
    >;
    GetFocusData: TIpcFrontendEvent<
        undefined,
        FFocusData,
        FGetFocusDataErrorCode
    >;
    GetPanelScreenshots: TIpcFrontendEvent<
        undefined,
        Array<string>,
        FGetPanelScreenshotsErrorCode
    >;
    GetInsertableWindowData: TIpcFrontendEvent<
        undefined,
        Array<FInsertableWindowData>,
        FGetInsertableWindowDataErrorCode
    >;
    Log: TIpcFrontendEvent<
        Array<unknown>,
        undefined,
        FLogErrorCode
    >;
    OnChangeFocus: TIpcFrontendEvent<
        FFocusChange,
        undefined,
        FOnChangeFocusErrorCode
    >;
    ReadyForRoute: TIpcFrontendEvent<
        undefined,
        undefined,
        FReadyForRouteErrorCode
    >;
}>;

export type FIpcBackendEvents = TIpcEventsBase<{
    Activate: TIpcBackendEvent<
        boolean,
        undefined,
        string
    >;
    TearDown: TIpcBackendEvent<
        undefined,
        undefined,
        string
    >;
}>;
