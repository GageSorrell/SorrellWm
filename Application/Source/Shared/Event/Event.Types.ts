/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { TIpcEventsBase } from "./EventBase.Types";

/* eslint-disable @stylistic/brace-style, @typescript-eslint/no-empty-object-type */

export interface IFrontendEventRegistrar { };

export type FIpcFrontendEvents = TIpcEventsBase<IFrontendEventRegistrar>;

export interface IBackendEventRegistrar { };

export type FIpcBackendEvents = TIpcEventsBase<IBackendEventRegistrar>;
