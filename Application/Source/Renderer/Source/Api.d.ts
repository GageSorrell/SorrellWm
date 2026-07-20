/**
 *
 *
 * @module @sorrell/wm/Renderer/ApplicationProgrammingInterface
 *
 * @file      ApplicationProgrammingInterface.d.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { IApplicationApi } from "../../Shared/Api.js";

declare global
{
    /* The interface name is fixed by the DOM global being augmented. */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Window
    {
        readonly sorrell: IApplicationApi;
    }
}
