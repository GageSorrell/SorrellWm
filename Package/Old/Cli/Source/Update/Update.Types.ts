/**
 * @file      Update.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Args, Options } from "@sorrell/effect/unstable/cli";
import type { NpmError } from "./Update.Internal.js";
import type { TCommand } from "../Command/Command.Types.js";
import type { TConfig } from "../Config/Config.Types.js";
import type { TLocalOptions } from "../Options/Options.Types.js";

/**
 * The options passed to the main internal function of the
 * {@link UpdateCommand}.
 */
export type UpdateOptions = TLocalOptions<UpdateConfig>;

export type SaveConfig = TConfig<{
    NoSave: Options.Options<boolean>;
    Save: Options.Options<boolean>;
    SaveDev: Options.Options<boolean>;
    SaveOptional: Options.Options<boolean>;
    SavePeer: Options.Options<boolean>;
    SaveProd: Options.Options<boolean>;
}>;

export type UpdateConfig =
    SaveConfig &
    TConfig<{
        Package: Args.Args<string>;
    }>;

export type UpdateError =
    | NpmError
    | Error;

export type FUpdateCommand = TCommand<
    "update",
    UpdateConfig,
    UpdateError
>;
