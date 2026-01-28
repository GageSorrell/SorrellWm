/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { FIpcFrontendEvents, TRichEventUndefined } from "?/Event";

export type TIpcState<T extends keyof FIpcFrontendEvents> =
{
    Data: TRichEventUndefined<FIpcFrontendEvents[T]> | undefined,
    Error: FIpcFrontendEvents[T]["Response"]["Error"] | undefined
};

export type TUseSendIpcEventReturnType<T extends keyof FIpcFrontendEvents> = Readonly<TIpcState<T>>;
