/**
 * @file      serializer.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ListrTestRendererOptions, ListrTestRendererTask } from "./renderer.interface.js";
import type {
    TestRendererSerializerOutput,
    TestRendererSerializerTaskKeys } from "./serializer.interface.js";
import type { ListrTaskEventMap } from "@interfaces/index.js";
import type { ListrTaskEventType } from "@constants/index.js";

export class TestRendererSerializer
{
    constructor(public options?: ListrTestRendererOptions) { }

    public serialize<T extends ListrTaskEventType>(
        event: T,
        data: ListrTaskEventMap[T],
        task?: ListrTestRendererTask
    ): string
    {
        return JSON.stringify(this.generate(event, data, task));
    }

    public generate<EventType extends ListrTaskEventType>(
        Event: EventType,
        Data: ListrTaskEventMap[EventType],
        Task?: ListrTestRendererTask
    ): TestRendererSerializerOutput<EventType>
    {
        const Output: TestRendererSerializerOutput<EventType> =
            {
                Data,
                Event
            };

        if (typeof this.options?.Task !== "boolean")
        {
            const t: NonNullable<TestRendererSerializerOutput<EventType>["Task"]> =
                Object.fromEntries(
                    this.options.Task.map((Entity: TestRendererSerializerTaskKeys) =>
                    {
                        const property: unknown = Task[Entity];

                        if (typeof property === "function")
                        {
                            return [ Entity, property.call(Task) ];
                        }

                        return [ Entity, property ];
                    })
                ) as NonNullable<TestRendererSerializerOutput<EventType>["Task"]>;

            if (Object.keys(Task).length > 0)
            {
                Output.Task = t;
            }
        }

        return Output;
    }
}
