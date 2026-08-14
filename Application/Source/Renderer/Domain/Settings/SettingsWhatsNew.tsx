/**
 * The Settings window's "What's new" section, reachable from the sidebar footer.
 *
 * @module @sorrell/wm/Renderer/SettingsWhatsNew
 *
 * @file      SettingsWhatsNew.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Text } from "@fluentui/react-components";

export/** Render the sidebar footer's "what's new" page. */
const SettingsWhatsNew = (): React.JSX.Element => (
    <Text>
        Release notes for SorrellWm will show up here.
    </Text>
);
