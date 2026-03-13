/* File:      SideEffects.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-nocheck

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
    import("../BrowserWindow");
    import("../CheckAdmin");
    import("../MainWindow");
    import("./Electron");
    import("./Tray");
    import("../WinEvent");
    import("../BorderManager");
    import("../WindowTracker");
    import("../Development/SetupPrimaryMonitor");
    import("../Settings/Settings");
    import("../Store");

    // Require("../Source/Main/Core/Initialization.ts");
    // Require("../Source/Main/Core/Tray");
    // Require("../Source/Main/WinEvent");

    // Require("../Source/Main/Development/SetupPrimaryMonitor");
});
