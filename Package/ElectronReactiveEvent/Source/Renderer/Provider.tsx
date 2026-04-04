/* File:      Provider.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { ReactNode } from "react";
import { ReactiveEventInternalContext } from "./Provider.Internal.js";
import type { ReactiveEventProviderProps } from "./Provider.Types.js";

export function ReactiveEventProvider(
    { children, value }: ReactiveEventProviderProps
): ReactNode
{
    return (
        <ReactiveEventInternalContext.Provider { ...{ value } }>
            { children }
        </ReactiveEventInternalContext.Provider>
    );
}
