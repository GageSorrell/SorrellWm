/**
 * @file      Utility.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import type { HMonitor, HWindow } from "@sorrellwm/windows";

export type HHandle =
    | HWindow
    | HMonitor;
