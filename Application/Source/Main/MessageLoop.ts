/* File:      MessageLoop.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

/** This file must be side-effect imported by `Main`. */

import { InitializeMessageLoop } from "@sorrellwm/windows";

const RunInitializeMessageLoop = (): void =>
{
    InitializeMessageLoop(() => { });
};

RunInitializeMessageLoop();
