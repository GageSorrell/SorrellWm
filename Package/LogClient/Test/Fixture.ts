/**
 * Shared log-client test fixtures.
 *
 * @module @sorrell/log-client/Test/Fixture
 *
 * @file      Fixture.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    Category,
    type LogRecord
} from "@sorrell/log";

/** Deterministic record used by the client rendering and pipe tests. */
export const Record: LogRecord = {
    Annotations: { },
    Category: Category.Make("Application.ClientTest"),
    Level: "Info",
    Message: [ "streamed message" ],
    SchemaVersion: 1,
    Sequence: 1,
    Source: "JavaScript",
    Spans: [],
    Timestamp: "2026-07-24T05:00:00.000Z"
};
