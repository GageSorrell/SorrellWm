/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FAnnotatedPanel, FFocusChange, FPanel } from "#/Tree.Types";
import type { FFocusData, FInsertableWindowData } from "./Transaction.Types";
import type { FNotFunction } from "./Shared.Types";

type FIpcEventInitiator =
    | "Backend"
    | "Frontend";

type TIpcEvent<
    TInitiator extends FIpcEventInitiator,
    TRequestData extends FNotFunction,
    TResponseData extends FNotFunction
> =
{
    Initiator: TInitiator;
    RequestData: TRequestData;
    ResponseData: TResponseData;
};

// export type TIpcRequestData<T extends >
type FUnknownIpcEvent = TIpcEvent<FIpcEventInitiator, FNotFunction, FNotFunction>;

export type TIpcEventsBase<T> = T extends Record<string, FUnknownIpcEvent>
    ? T
    : never;

export type FIpcEvents = TIpcEventsBase<{
    BringIntoPanel: TIpcEvent<"Frontend", FAnnotatedPanel, undefined>;
    GetAnnotatedPanels: TIpcEvent<"Frontend", undefined, Array<FAnnotatedPanel>>;
    GetCurrentPanel: TIpcEvent<"Frontend", undefined, FPanel>;
    GetFocusData: TIpcEvent<"Frontend", undefined, FFocusData>;
    GetPanelScreenshots: TIpcEvent<"Frontend", undefined, Array<string>>;
    GetInsertableWindowData: TIpcEvent<"Frontend", undefined, Array<FInsertableWindowData>>;
    Log: TIpcEvent<"Frontend", Array<unknown>, undefined>;
    Activate: TIpcEvent<"Backend", boolean, undefined>;
    OnChangeFocus: TIpcEvent<"Frontend", FFocusChange, undefined>;
    ReadyForRoute: TIpcEvent<"Frontend", undefined, undefined>;
    TearDown: TIpcEvent<"Backend", undefined, undefined>;
}>;

export type FIpcChannel = keyof FIpcEvents;

export type FIpcFrontendChannel = keyof
{
    [ Channel in FIpcChannel as FIpcEvents[Channel]["Initiator"] extends "Frontend"
        ? Channel
        : never
    ]: unknown;
};

export type FIpcBackendChannel = keyof
{
    [ Channel in FIpcChannel as FIpcEvents[Channel]["Initiator"] extends "Backend"
        ? Channel
        : never
    ]: unknown;
};

export type TRequestData<T extends FIpcChannel> = FIpcEvents[T]["RequestData"];
export type TResponseData<T extends FIpcChannel> = FIpcEvents[T]["ResponseData"];

export type TIpcHandler<T extends FIpcChannel> =
    (Data: TRequestData<T> | undefined) => Promise<TResponseData<T>>;

export type TIpcCallback<T extends FIpcChannel> =
    (Data: TResponseData<T> | undefined) => Promise<void>;
