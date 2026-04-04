/* File:      Callback.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EmptyRequestParameterType } from "./Callback.Types.js";

export function GetSendResponseChannel(Channel: string): string
{
    return `${ Channel }Response`;
}

export const EmptyRequestParameter: EmptyRequestParameterType =
    {
        EmptyEventParameter: "EmptyRequestParameter"
    } as const;
