/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FInsertableWindowData } from "?/Transaction.Types";
import type { TFunction } from "?/Shared.Types";

type FArgumentVectorBase = [ unknown, ...Array<unknown> ];

type TIpcEventPart<
    TBackend extends FArgumentVectorBase = [ unknown ],
    TFrontend extends FArgumentVectorBase = [ unknown ]
> =
{
    Backend: TBackend;
    Frontend: TFrontend;
};

/**
 * Define an IPC event by the data sent by the Backend and Frontend.
 * Assumes that, for a given channel, only one of the frontend/backend
 * initiates, then the backend/frontend responds via the same channel.
 */
export type FIpcEvents =
{
    BringIntoPanel: TIpcEventPart;
    GetAnnotatedPanels: TIpcEventPart;
    GetCurrentPanel: TIpcEventPart;
    GetFocusData: TIpcEventPart<[ number ], [ undefined ]>;
    GetPanelScreenshots: TIpcEventPart<[ string, number ], [ string, number ]>;
    GetInsertableWindowData: TIpcEventPart<[ Array<FInsertableWindowData> ]>;
    Log: TIpcEventPart;
    Navigate: TIpcEventPart;
    OnChangeFocus: TIpcEventPart;
    ReadyForRoute: TIpcEventPart;
    TearDown: TIpcEventPart;
};

export type FIpcChannel = keyof FIpcEvents;

type TIpcBackendPayloadBase<T extends FIpcChannel> = FIpcEvents[T]["Backend"];
type TIpcFrontendPayloadBase<T extends FIpcChannel> = FIpcEvents[T]["Frontend"];

type TFlatten<T> = T extends [ infer R ] ? R : T;

/** Data sent by the frontend for a given event. */
export type TIpcFrontendPayload<T extends FIpcChannel> = TFlatten<TIpcFrontendPayloadBase<T>>;

/** Data sent by the backend for a given event. */
export type TIpcBackendPayload<T extends FIpcChannel> = TFlatten<TIpcBackendPayloadBase<T>>;

export type TEnsureVector<T> = T extends FArgumentVectorBase
    ? T
    : [ T ];

export type TIpcFrontendFunction<T extends FIpcChannel> =
    TFunction<TEnsureVector<TIpcBackendPayload<T>>, Promise<void>>;

export type TIpcBackendFunction<T extends FIpcChannel> =
    TFunction<TEnsureVector<TIpcFrontendPayload<T>>, Promise<void>>;
