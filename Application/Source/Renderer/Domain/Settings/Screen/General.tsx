/* File:      General.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { Checkbox } from "@fluentui/react-components";
import type { ReactElement } from "react";
import { SettingsScreen } from "./SettingsScreen";

export const General = (): ReactElement =>
{
    return (
        <SettingsScreen Title="General">
            Run on Startup
            <Checkbox/>
        </SettingsScreen>
    );
};
