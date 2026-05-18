/**
 * @file      FileSystem.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { FDeleteProgress } from "./FileSystem.Internal.Types.js";
import type { TFunction } from "@sorrell/utilities/functional";

/**
 * @property {TFunction<FDeleteProgress>} OnProgress - The callback that is called
 * upon deleting files.
 * @property {boolean} ShouldRenderTerminalProgress - Should the progress be rendered
 * in the terminal (default is `true`).
 * @property {AbortSignal} Signal - A signal to abort the deletion.
 */
export type FDeleteWithProgressOptions =
    {
        OnProgress?: TFunction<FDeleteProgress>;
        ShouldRenderTerminalProgress?: boolean;
        Signal?: AbortSignal;
    };
