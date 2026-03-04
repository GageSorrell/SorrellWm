/* File:      SideEffects.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import "../MessageLoop";
import "../Hook";
import "../NodeIpc";
import "../Keyboard";
import "../Monitor";
import "../Tree";
import "../Settings/InitializeSettings";
import "../Notification";

setTimeout((): void =>
{
    /* @ts-expect-error Webpack. */
    import("../MainWindow");
    /* @ts-expect-error Webpack. */
    import("./Initialization");
    /* @ts-expect-error Webpack. */
    import("./Tray");
    /* @ts-expect-error Webpack. */
    import("../WinEvent");
    /* @ts-expect-error Webpack. */
    import("../Development/SetupPrimaryMonitor");

    // Require("../Source/Main/Core/Initialization.ts");
    // Require("../Source/Main/Core/Tray");
    // Require("../Source/Main/WinEvent");

    // Require("../Source/Main/Development/SetupPrimaryMonitor");
});
