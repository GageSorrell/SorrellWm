/* File:      BlurWorker.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

import { InitializeBlurWorker } from "@sorrellwm/windows";

const DoInitialize = (): void =>
{
    InitializeBlurWorker(() => { });
};

DoInitialize();
