/**
 * Built-in client argument tests.
 *
 * @module @sorrell/log-client/Test/Arguments.test
 *
 * @file      Arguments.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, expect, it } from "vitest";
import {
    ClientArgumentError,
    ParseArguments
} from "../Source/Arguments.js";

describe("client arguments", () =>
{
    it("accepts automatic, positional, and named port selection", () =>
    {
        expect(ParseArguments([])).toEqual({ Help: false });
        expect(ParseArguments([ "4317" ])).toEqual({
            Help: false,
            Port: 4_317
        });
        expect(ParseArguments([ "--port", "4318" ])).toEqual({
            Help: false,
            Port: 4_318
        });
        expect(ParseArguments([ "--port=4319" ])).toEqual({
            Help: false,
            Port: 4_319
        });
    });

    it("reports invalid and duplicate ports", () =>
    {
        expect(() => ParseArguments([ "--port", "0" ]))
            .toThrow(ClientArgumentError);
        expect(() => ParseArguments([ "4317", "4318" ]))
            .toThrow("Only one log port");
    });
});
