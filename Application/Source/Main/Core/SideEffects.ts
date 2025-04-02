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
    import("../MainWindow");
    import("../RendererFunctions.Generated");
    import("./Initialization");
    import("./Tray");
    import("../WinEvent");
});

