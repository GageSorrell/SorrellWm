/* File:      Callback.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Channel } from "../Channel/Channel.Types.js";
import type { EmptyRequestParameterType } from "./Callback.Types.ts.old";
import type { MainOwner } from "../Decl.Types.js";
import type { PackageKeys } from "../Internal/Registrar.Types.js";
import type { ReactiveEventChannel } from "../Channel/Channel.Internal.Types.js";

export function GetInternalResponseChannel<PackageKey extends PackageKeys>(
    Channel: Channel.Response<PackageKey, MainOwner>
): ReactiveEventChannel<PackageKey, typeof Channel>
{
    return `${ Channel }__ReactiveEventResponse`;
}
