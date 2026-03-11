/* File:      Keyboard.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { KeybindSet } from "../Component/Keyboard/KeybindSet";
import type { ReactElement } from "react";
import { SettingsScreen } from "./SettingsScreen";
import { SparkleActionRegular } from "@fluentui/react-icons";

export const Keyboard = (): ReactElement =>
{
    /** Where to pick up: Make components for displaying and recording keybinds. */
    return (
        <SettingsScreen Title="Keyboard">
            Keyboard Screen
            <KeybindSet
                ActionKeys={ [ "Primary[0]", "Primary[1]", "Primary[2]", "Primary[3]" ] }
                Icon={ SparkleActionRegular }
                KeyIds={ [ "F", "G", "C", "R" ] }
                Subtitle="The primary action keys."
                Title="Primary"
            />
        </SettingsScreen>
    );
};
