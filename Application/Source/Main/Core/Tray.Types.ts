/* File:      Tray.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { TRef } from "./Core.Types";
import type { Tray } from "electron";

export type FTray = TRef<Tray | undefined>;
