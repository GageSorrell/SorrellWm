/* File:      Factory.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-namespace */

import type { RequestDeclKey, ResponseDeclKey } from "./Event.Types.js";
import type { EmptyEventParameter } from "../index.js";

export namespace Response
{
    export type Main =
        {
            Data?: unknown;
            Error: unknown;
        };

    export type Renderer =
        {
            Data?: unknown;
            Error: unknown;
            IsPending: boolean;
        };
}

export type DeclHasResponseType<ChannelType extends keyof Registrar, Registrar> =
    ResponseDeclKey extends keyof Registrar[ChannelType]
        ? Registrar[ChannelType][ResponseDeclKey] extends EmptyEventParameter
            ? false
            : true
        : never;

export type DeclHasRequestType<ChannelType extends keyof Registrar, Registrar> =
    RequestDeclKey extends keyof Registrar[ChannelType]
        ? Registrar[ChannelType][RequestDeclKey] extends EmptyEventParameter
            ? false
            : true
        : never;
