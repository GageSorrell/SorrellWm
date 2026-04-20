/**
 * @file      MessageLoop.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 */

/** This file must be side-effect imported by `Main`. */

import { InitializeMessageLoop } from "@sorrellwm/windows";

const RunInitializeMessageLoop = (): void =>
{
    InitializeMessageLoop(() =>
    {

    });
};

RunInitializeMessageLoop();
