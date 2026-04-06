/* File:      Channel.Internal.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Channel } from "./Channel.Types";
import type { EventOwner } from "../Decl.Types";
import type { PackageKeys } from "../Internal";

export type ReactiveEventChannel<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Any<PackageKey, EventOwner>
> = `${ ChannelType }__ReactiveEventResponse`;
