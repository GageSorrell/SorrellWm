/**
 * @file      renderer.interface.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ListrLogLevels, RendererLoggerOptions } from "@utils/index.js";
import type { ListrRendererTask, ListrTaskMessage } from "@interfaces/index.js";
import type { ListrTaskState } from "@constants/index.js";
import type { TestRenderer } from "./renderer.js";
import type { TestRendererSerializerTaskKeys } from "./serializer.interface.js";

export type ListrTestRendererTask = ListrRendererTask<typeof TestRenderer>;

export interface ListrTestRendererOptions extends RendererLoggerOptions<ListrLogLevels>
{
    /**
     * Log subtasks.
     *
     * @default `true`
     */
    Subtasks?: boolean

    /**
     * Log given task states.
     */
    State?: Array<ListrTaskState>

    /**
     * Log output.
     */
    Output?: boolean

    /**
     * Log prompt.
     */
    Prompt?: boolean

    /**
     * Log title changes.
     */
    Title?: boolean

    /**
     * Log given messages.
     */
    Messages?: Array<keyof ListrTaskMessage>;

    /**
     * Log given messages to stderr instead of stdout.
     */
    MessagesToStderr?: Array<keyof ListrTaskMessage>;

    /**
     * Serialize the given properties of the task inside the logs.
     */
    Task?: false | Array<TestRendererSerializerTaskKeys>;
}

export type ListrTestRendererTaskOptions = never;
