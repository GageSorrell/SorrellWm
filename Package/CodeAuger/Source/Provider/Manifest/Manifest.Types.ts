/**
 * @file      Manifest.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ConfigRecord, WithCustomOptions } from "../../Shared/Config/Config.Types.js";
import type { ManifestBase } from "./Manifest.Internal.Types.js";

export type ModuleDecl =
    {
        Path: string;
    };

export type Manifest<OptionsType extends ConfigRecord = never> =
    WithCustomOptions<ManifestBase, OptionsType>;
