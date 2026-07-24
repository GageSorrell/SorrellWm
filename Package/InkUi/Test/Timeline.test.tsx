/**
 * Timeline component tests.
 *
 * @module @sorrell/ink-ui/Test/Timeline
 *
 * @file      Timeline.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, expect, it } from "vitest";
import { render } from "ink-testing-library";
import {
    ThemeProvider,
    TimelineDetailOverlay,
    TimelineEntry,
    TimelineTab,
    type TimelineEvent
} from "../Source/index.js";

const Event: TimelineEvent = {
    Detail: { attempt: 1 },
    DurationMilliseconds: 42,
    Id: "event",
    Request: { path: "/" },
    Response: { status: 200 },
    Status: 200,
    Timestamp: "2026-01-01T00:00:00Z",
    Title: "Completed request"
};

const Render = (Value: React.ReactElement): string =>
    render(<ThemeProvider>{ Value }</ThemeProvider>).lastFrame() ?? "";

describe("timeline components", () =>
{
    it("TimelineEntry renders event metadata", () =>
    {
        expect(Render(<TimelineEntry Event={ Event } />)).toContain("Completed request");
    });

    it("TimelineTab renders its events", () =>
    {
        expect(Render(<TimelineTab Active={ false }
            Events={ [ Event ] } />))
            .toContain("Completed request");
    });

    it("TimelineDetailOverlay renders event details", () =>
    {
        const Value = Render(<TimelineDetailOverlay Event={ Event } />);
        expect(Value).toContain("Completed request");
        expect(Value).toContain("Duration");
    });
});
