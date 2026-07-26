/**
 *
 *
 * @module @sorrell/ink-ui/Showcase/Stories/TimelineData
 *
 * @file      TimelineData.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { TimelineEvent } from "../../Source/index.js";

export const Event: TimelineEvent = {
    Detail: { attempt: 1 },
    DurationMilliseconds: 84,
    Id: "one",
    Request: { method: "GET", url: "https://example.com" },
    Response: { body: { ok: true }, status: 200 },
    Status: 200,
    Timestamp: new Date(),
    Title: "Fetched example data"
};

export const Events: ReadonlyArray<TimelineEvent> = [
    Event,
    {
        DurationMilliseconds: 136,
        Id: "two",
        Status: 404,
        Timestamp: new Date(Date.now() - 4_000),
        Title: "Checked missing resource"
    }
];
