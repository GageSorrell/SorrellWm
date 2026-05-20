/**
 * @file      Config.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ModulesConfig, ProviderOptions } from "./Config.Types.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

export type AnyProviderConfig =
    Readonly<Partial<{
        Modules: ModulesConfig<any>;
        Options: ProviderOptions<any>;
    }>>;

/* eslint-enable @typescript-eslint/no-explicit-any */

export type AnyProviderConfigs =
    Readonly<Record<string, AnyProviderConfig>>;

export type ModulesConfigBasePart =
    Readonly<Partial<{
        Enabled: boolean;
    }>>;
