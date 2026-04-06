/* File:      Error.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { ErrorKey, PackageKeys, Registrar } from "./index.js";
import type { EventErrorUnknownAdvancedDecl, RendererOwner } from "../Decl.Types.js";
import type { Channel } from "../Channel/Channel.Types.js";

/**
 * "Homogenize" the ErrorDecl property of the event declaration.
 */
export type ReactiveEventError<
    PackageKey extends PackageKeys,
    ChannelType extends Channel.Any<PackageKey, RendererOwner>> =
    Registrar[PackageKey][ChannelType][ErrorKey] extends string
        ? {
            Message: Registrar[PackageKey][ChannelType][ErrorKey];
            // @Todo Add `Payload: undefined;` here?
        }
        : Registrar[PackageKey][ChannelType][ErrorKey] extends [ string, unknown ]
            ? {
                Message: Registrar[PackageKey][ChannelType][ErrorKey][0];
                Payload: Registrar[PackageKey][ChannelType][ErrorKey][1];
            }
            : Registrar[PackageKey][ChannelType][ErrorKey] extends EventErrorUnknownAdvancedDecl
                ? Registrar[PackageKey][ChannelType][ErrorKey]
                : never;
