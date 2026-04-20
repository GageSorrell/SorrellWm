/**
 * @file      Event.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { IBackendEventRegistrar, IFrontendEventRegistrar } from "../Event.Types";
import type { TIpcEventsBase } from "./EventBase.Types";

/* eslint-disable @stylistic/brace-style, @typescript-eslint/no-empty-object-type */

export type FIpcFrontendEvents = TIpcEventsBase<IFrontendEventRegistrar>;

export type FIpcBackendEvents = TIpcEventsBase<IBackendEventRegistrar>;
