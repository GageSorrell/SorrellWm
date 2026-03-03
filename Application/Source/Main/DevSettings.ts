/* File:      DevSettings.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import * as DevSettings from "../../DevSettings.json";
import type { FDevSettings } from "./DevSettings.Types";

export const GetDevSettings = (): FDevSettings =>
{
    const { $schema: _, ...Settings } = DevSettings;
    return Settings as FDevSettings;
};
