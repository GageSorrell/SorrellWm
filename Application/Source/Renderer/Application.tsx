/**
 * Route to the correct "application window."
 *
 * @module @sorrell/wm/Renderer/Application
 *
 * @file      Application.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { BackdropApplication } from "./BackdropApplication.js";
import { OverlayApplication } from "./OverlayApplication.js";
import { SettingsApplication } from "./Settings.js";

/**
 * Render the surface associated with the current logical browser window.
 *
 * @throws {Error} When a window value is not specified via URL params.
 *
 * @since 1.0.0
 */
export function Application(): React.JSX.Element
{
    switch (new URLSearchParams(window.location.search).get("window"))
    {
        case "Backdrop":
            return <BackdropApplication />;
        case "Overlay":
            return <OverlayApplication />;
        case "Settings":
            return <SettingsApplication />;
    }

    throw new Error("Window was not specified in the \"window\" URL param.");
}
