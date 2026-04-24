/**
 * @file      Update.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { EffectFactory } from "../Effect/Effect.Types.js";
import type { NpmError } from "./Update.Internal.js";
import type { UpdateConfig, UpdateError, UpdateOptions } from "./Update.Types.js";

/**
 * @module UpdateInternalTypes
 * Internal types for the {@link Update} module.
 *
 * @internal
 */

export interface UpdateCommandResult
{
    readonly ExitCode: number;
    readonly Output: string;
}

export type UpdateEffect = Effect.Effect<void, UpdateError, UpdateConfig>;

export type NpmConfig =
    Pick<
        UpdateOptions,
        | "Package"
        | "Silent"
    >;

export type NpmCommandEffect = Effect.Effect<UpdateCommandResult, NpmError, never>;

export type NpmUninstallCommandFactory = EffectFactory<never, void, NpmError>;
export type NpmInstallCommandFactory = EffectFactory<string, void, NpmError>;
