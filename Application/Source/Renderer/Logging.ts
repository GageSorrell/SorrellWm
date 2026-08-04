/**
 * Structured renderer logging forwarded through the sandboxed preload bridge.
 *
 * @module @sorrell/wm/Renderer/Logging
 *
 * @file      Logging.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type {
    RendererLogCategory,
    RendererLogEntry,
    RendererLogLevel
} from "../Shared/Logging.js";
import type { Thunk } from "@sorrell/utility/Function";

const DescribeCause = (Cause: unknown): string =>
    Cause instanceof globalThis.Error
        ? Cause.stack ?? `${ Cause.name }: ${ Cause.message }`
        : String(Cause);

export/** Forward one structured renderer event without disrupting the user interface. */
const Log = (
    Level: RendererLogLevel,
    Category: RendererLogCategory,
    Message: string,
    Cause?: unknown
): void =>
{
    const Entry: RendererLogEntry = {
        Category,
        Level,
        Message,
        ...(Cause === undefined ? { } : { Details: DescribeCause(Cause) })
    };

    try
    {
        window.sorrell.log.write(Entry);
    }
    catch
    {
        // Logging must never replace the renderer failure it is reporting.
    }
};

export/** Forward a renderer debug event. */
const Debug = (Category: RendererLogCategory, Message: string): void =>
    Log("Debug", Category, Message);

export/** Forward a renderer informational event. */
const Info = (Category: RendererLogCategory, Message: string): void =>
    Log("Info", Category, Message);

export/** Forward a renderer warning event. */
const Warning = (
    Category: RendererLogCategory,
    Message: string,
    Cause?: unknown
): void => Log("Warning", Category, Message, Cause);

export/** Forward a renderer error event. */
const Error = (
    Category: RendererLogCategory,
    Message: string,
    Cause?: unknown
): void => Log("Error", Category, Message, Cause);

export/** Log a rejected renderer promise and preserve its rejection. */
const ReportRejection = (
    Category: RendererLogCategory,
    Message: string
) => (Cause: unknown): void =>
{
    Error(Category, Message, Cause);
};

export/** Install process-wide browser error and rejection reporting. */
const InstallGlobalHandlers = (): Thunk =>
{
    const OnError = (EventValue: ErrorEvent): void =>
    {
        Error(
            "Application",
            "An uncaught renderer error occurred.",
            EventValue.error ?? EventValue.message
        );
    };
    const OnUnhandledRejection = (EventValue: PromiseRejectionEvent): void =>
    {
        Error(
            "Application",
            "An unhandled renderer promise rejection occurred.",
            EventValue.reason
        );
    };

    window.addEventListener("error", OnError);
    window.addEventListener("unhandledrejection", OnUnhandledRejection);

    return (): void =>
    {
        window.removeEventListener("error", OnError);
        window.removeEventListener("unhandledrejection", OnUnhandledRejection);
    };
};
