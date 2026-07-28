/**
 * Augments the `Window` with the application API.
 *
 * @module @sorrell/wm/Renderer/Api
 *
 * @file      ApplicationProgrammingInterface.d.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

declare global
{
    /* The interface name is fixed by the DOM global being augmented. */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Window
    {
        readonly sorrell: AppApi;
    }
}

export { };
