/**
 *
 *
 * @module @sorrell/wm/Shared/ApplicationProgrammingInterface
 *
 * @file      ApplicationProgrammingInterface.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * Runtime versions that are safe to expose to a renderer.
 */
export interface IApplicationVersions
{
    readonly chrome: string;
    readonly electron: string;
    readonly node: string;
}

/**
 * The deliberately small, typed bridge exposed by the preload process.
 */
export interface IApplicationApi
{
    readonly ping: () => Promise<string>;
    readonly platform: string;
    readonly versions: IApplicationVersions;
}

/**
 * IPC channel names shared by the main and preload processes.
 */
const ApplicationIpcChannel: { readonly Ping: "application:ping" } = {
    Ping: "application:ping"
} as const;

export { ApplicationIpcChannel };
