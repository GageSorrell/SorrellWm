/* File:      Utility.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { HMonitor, HWindow } from "@sorrellwm/windows";

export type HHandle =
    | HWindow
    | HMonitor;
