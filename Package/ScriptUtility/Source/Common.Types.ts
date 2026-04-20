/**
 * @file      Common.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 */

export type TTask<T> = () => Promise<T>;
export type TTaskTuple<T> = [ TTask<T>, string ];

export type TRef<T> =
{
    Current: T | undefined;
};

/** A set of common paths, which you might wish to reference via a script. */
export type FCommonPath =
    /** The `Configuration` directory at the root of the monorepo. */
    | "Configuration"
    /** The directory within `Source` that is executed in the main thread. */
    | "Main"
    /** The directory containing the source that is not the Win32 (C++) source. */
    | "Source"
    /** The `Package` directory at the root of the monorepo. */
    | "Package"
    /** The directory within `Source` that is executed in the renderer thread. */
    | "Renderer"
    /** The `Script` directory at the root of the monorepo. */
    | "Script"
    /** The root of the `@sorrellwm/windows` package. */
    | "Windows";
