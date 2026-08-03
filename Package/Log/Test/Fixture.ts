/**
 * Test fixtures for `@sorrell/log`.
 *
 * @module @sorrell/log/Test/Fixture
 *
 * @file      Fixture.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Category from "../Source/Category.js";
import type { LogRecord } from "../Source/LogRecord.js";


export function RecordFixture(Overrides: Partial<LogRecord> = { }): LogRecord
{
    return {
        Annotations: { },
        Category: Category.Make("Application.Test"),
        Level: "Info",
        Message: [ "message" ],
        SchemaVersion: 1,
        Sequence: 1,
        Source: "JavaScript",
        Spans: [],
        Timestamp: "2026-07-23T21:42:08.153Z",
        ...Overrides
    };
}
