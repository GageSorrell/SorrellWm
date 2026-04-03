/* File:      Callback.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Callback, Channel } from "../index.js";
import type { Internal } from "./index.js";
import type { Shared } from "../Shared/index.js";

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-namespace */

// @TODO WHERE TO PICK BACK UP
//
// 1. Move this module back into the `Internal` directory.
// 2. Move types used in internal and non-internal modules
//    into the `Shared` directory and `Shared` namespace.
// 3. Move types in all remaining modules into new namespaces
// 4. Move all contents of internal modules into new namespaces
//    in the `Internal` namespace
// 5. Fix all other errors until the package builds and is linted.
// 6. While previewing the documentation website, go through every
//    export and write JSDoc comments for everything.

export namespace Argument
{
    export type Renderer<
        ChannelType extends Channel.Channel<Registrar>,
        Registrar extends Internal.Registrar.IRegistrarBase
    > =
        Shared.Callback.Argument.Base.Renderer &
        Shared.Callback.Argument.RequestPart<ChannelType, Registrar>;

    export type Main<
        ChannelType extends Channel.Channel<Registrar>,
        Registrar extends Internal.Registrar.IRegistrarBase
    > =
        Shared.Callback.Argument.Base.Main &
        Shared.Callback.Argument.RequestPart<ChannelType, Registrar>;

}

export type Main<
    ChannelType extends Channel.Channel<Registrar>,
    Registrar extends Internal.Registrar.IRegistrarBase
> =
    (Argument: Argument.Main<ChannelType, Registrar>)
    => Callback.ReturnType<ChannelType, Registrar>;

export type Renderer<
    ChannelType extends Channel.Channel<Registrar>,
    Registrar extends Internal.Registrar.IRegistrarBase
> =
    (Argument: Argument.Renderer<ChannelType, Registrar>)
    => Callback.ReturnType<ChannelType, Registrar>;
