/**
 * @file      SideEffects.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable sort-imports */

/**
 * Webpack complains about the use of `import()`, despite being able to resolve the modules.
 */
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import type { FLogger } from "../../Shared";
import { GetLogger } from "#/Development/Log/Log";
import { C } from "#/Development/Log/LogStyleShorthands";

const Log: FLogger = GetLogger("SideEffects");

Log(`Importing ${ C("MessageLoop") }...`);
import "../MessageLoop";
Log(`Importing ${ C("Hook") }...`);
import "../Hook";

setTimeout(async (): Promise<void> =>
{
    Log(`Normal side-effect imports are finished.  Performing ${ C("await import") }s...`);

    Log(`${ C("await import") }ing ${ C("../Development/Log/Log") }...`);
    await import("../Development/Log/Log");
    Log(`${ C("await import") }ing ${ C("../Initialize/Initialize") }...`);
    await import("../Initialize/Initialize");
    Log(`${ C("await import") }ing ${ C("../Event/NodeIpc") }...`);
    await import("../Event/NodeIpc");
    Log(`${ C("await import") }ing ${ C("../Keyboard/Keyboard") }...`);
    await import("../Keyboard/Keyboard");
    Log(`${ C("await import") }ing ${ C("../Monitor") }...`);
    await import("../Monitor");
    Log(`${ C("await import") }ing ${ C("../Tree/Tree") }...`);
    await import("../Tree/Tree");
    Log(`${ C("await import") }ing ${ C("../Settings/InitializeSettings") }...`);
    await import("../Settings/InitializeSettings");
    Log(`${ C("await import") }ing ${ C("../Notification") }...`);
    await import("../Notification");

    Log(`${ C("await import") }s are finished.  Performing non-awaited ${ C("import") }s...`);

    Log(`${ C("import") }ing ${ C("../Window/BrowserWindow/BrowserWindow") }...`);
    import("../Window/BrowserWindow/BrowserWindow");
    Log(`${ C("import") }ing ${ C("../CheckAdmin") }...`);
    import("../CheckAdmin");
    Log(`${ C("import") }ing ${ C("../Window/Overlay/InitializeOverlayWindow") }...`);
    import("../Window/Overlay/InitializeOverlayWindow");
    Log(`${ C("import") }ing ${ C("./Electron") }...`);
    import("./Electron");
    Log(`${ C("import") }ing ${ C("../Tray/InitializeTray") }...`);
    import("../Tray/InitializeTray");
    Log(`${ C("import") }ing ${ C("../WinEvent") }...`);
    import("../WinEvent");
    Log(`${ C("import") }ing ${ C("../BorderManager") }...`);
    import("../BorderManager");
    Log(`${ C("import") }ing ${ C("../WindowTracker") }...`);
    import("../WindowTracker");
    Log(`${ C("import") }ing ${ C("../Window/Settings/SettingsWindow") }...`);
    import("../Window/Settings/SettingsWindow");
    Log(`${ C("import") }ing ${ C("../Store") }...`);
    import("../Store");
    Log(`${ C("import") }ing ${ C("../Development/DummyWindows") }...`);
    import("../Development/DummyWindows");

    Log("All side-effect imports are complete!");
});
