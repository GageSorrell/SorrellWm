/* File:      MessageLoop.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

import { InitializeMessageLoop } from "Windows";

/** This file must be side-effect imported by `Main`. */

/** @TODO */
const OnError = (Argument: unknown): void =>
{
    console.error("OnError", Argument);
};

/** @TODO */
const OnOk = (Argument: unknown): void =>
{
    console.log("OnOK", Argument);
};

/** @TODO */
const OnProgress = (Argument: unknown): void =>
{
    console.log("OnProgress", Argument);
};

const RunInitializeMessageLoop = (): void =>
{
    InitializeMessageLoop(OnOk, OnError, OnProgress);
};

RunInitializeMessageLoop();
