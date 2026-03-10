/* File:      About.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { ReactElement } from "react";
import { SettingsScreen } from "./SettingsScreen";

export const About = (): ReactElement =>
{
    return (
        <SettingsScreen Title="About">
            About Screen
        </SettingsScreen>
    );
};
