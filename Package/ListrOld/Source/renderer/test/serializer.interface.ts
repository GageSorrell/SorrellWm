/**
 * @file      serializer.interface.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ListrRendererTask, ListrTaskEventMap } from "@interfaces/index.js";
import type { ListrTaskEventType } from "@constants/index.js";
import type { TestRenderer } from "./renderer.js";

export interface TestRendererSerializerOutput<Task extends ListrTaskEventType>
{
    Event: Task;
    Data: ListrTaskEventMap[Task];
    Task?: Partial<Record<TestRendererSerializerTaskKeys, unknown>>;
}

export type TestRendererSerializerTaskKeys =
    Extract<
        keyof ListrRendererTask<typeof TestRenderer>,
        | "HasSubtasks"
        | "HasFinalized"
        | "IsPending"
        | "IsStarted"
        | "IsSkipped"
        | "IsCompleted"
        | "HasFailed"
        | "IsRollingBack"
        | "HasRolledBack"
        | "IsRetrying"
        | "HasReset"
        | "IsEnabled"
        | "HasTitle"
        | "IsPrompt"
        | "IsPaused"
        | "Title"
        | "Path"
    >;
