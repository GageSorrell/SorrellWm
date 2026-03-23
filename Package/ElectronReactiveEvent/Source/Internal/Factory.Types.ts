/* File:      Factory.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention */

import type { RequestDeclKey, ResponseDeclKey } from "./index.js";
import type { EmptyEventParameter } from "../index.js";

export type ResponseInternal =
    {
        Data?: unknown;
        Error: unknown;
    };

export type RendererResponseInternal =
    {
        Data?: unknown;
        Error: unknown;
        IsPending: boolean;
    };

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
