/**
 * @file      DevSettings.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as DevSettings from "../../../Configuration/Development/DevSettings.json";
import type { FDevSettings } from "./DevSettings.Types";

export const GetDevSettings = (): FDevSettings =>
{
    const { $schema: _, ...Settings } = DevSettings;
    return Settings as FDevSettings;
};
