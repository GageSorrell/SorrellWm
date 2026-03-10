/* File:      Keyboard.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { Checkbox } from "@fluentui/react-components";
import type { ReactElement } from "react";
import { SettingsScreen } from "./SettingsScreen";

export const Keyboard = (): ReactElement =>
{
    return (
        <SettingsScreen Title="Keyboard">
            Keyboard Screen
            <Checkbox/>
        </SettingsScreen>
    );
};
