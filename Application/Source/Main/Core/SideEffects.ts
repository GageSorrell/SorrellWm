/* File:      SideEffects.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import "../MessageLoop";
import "../Hook";
import "../NodeIpc";
import "../Keyboard";
import "../Monitor";
import "../Tree";

setTimeout((): void =>
{
    import("../MainWindow");
    import("../RendererFunctions.Generated");
    import("./Initialization");
    import("./Tray");
});

