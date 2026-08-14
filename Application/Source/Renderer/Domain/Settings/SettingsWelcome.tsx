/**
 * The Settings window's "Welcome to SorrellWm" section, reachable from the sidebar footer.
 *
 * @module @sorrell/wm/Renderer/SettingsWelcome
 *
 * @file      SettingsWelcome.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Text } from "@fluentui/react-components";

export/** Render the sidebar footer's welcome page. */
const SettingsWelcome = (): React.JSX.Element => (
    <Text>
        Welcome to SorrellWm! This window is where you can configure window management,
        keybinds, and the overlay to fit how you work.
    </Text>
);
