/**
 * The Settings window's "Give feedback" section, reachable from the sidebar footer.
 *
 * @module @sorrell/wm/Renderer/SettingsGiveFeedback
 *
 * @file      SettingsGiveFeedback.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Text } from "@fluentui/react-components";

export/** Render the sidebar footer's "give feedback" page. */
const SettingsGiveFeedback = (): React.JSX.Element => (
    <Text>
        Ways to send feedback about SorrellWm will show up here.
    </Text>
);
