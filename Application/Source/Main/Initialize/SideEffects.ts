/* File:      SideEffects.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

/**
 * Webpack complains about the use of `import()`, despite being able to resolve the modules.
 */
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import "../MessageLoop";
import "../Hook";

setTimeout(async (): Promise<void> =>
{
    // process.on("uncaughtExceptionMonitor", function (Error, Origin)
    // {
    //     process.stdout.write("uncaughtExceptionMonitor");
    //     process.stdout.write("Origin:", Origin);
    //     process.stdout.write(Error);
    // });

    // process.on("uncaughtException", function (Error, Origin)
    // {
    //     process.stdout.write("uncaughtException");
    //     process.stdout.write("Origin:", Origin);
    //     process.stdout.write(Error);
    // });

    // process.on("unhandledRejection", function (Reason)
    // {
    //     process.stdout.write("unhandledRejection");
    //     process.stdout.write(Reason);
    // });
    await import("../Development/Log/Log");
    await import("../Initialize/Initialize");
    await import("../Event/NodeIpc");
    // await import("../Keyboard/Keyboard");
    await import("../Monitor");
    await import("../Tree/Tree");
    await import("../Settings/InitializeSettings");
    await import("../Notification");

    import("../Window/BrowserWindow/BrowserWindow");
    import("../CheckAdmin");
    import("../Window/Overlay/InitializeOverlayWindow");
    import("./Electron");
    import("../Tray/InitializeTray");
    import("../WinEvent");
    // import("../BorderManager");
    import("../WindowTracker");
    import("../Window/Settings/SettingsWindow");
    import("../Store");
    // import("../Development/DummyWindows");

    // import("../Development/SetupPrimaryMonitor");
    // Require("../Source/Main/Core/Initialization.ts");
    // Require("../Source/Main/Core/Tray");
    // Require("../Source/Main/WinEvent");

    // Require("../Source/Main/Development/SetupPrimaryMonitor");
});
