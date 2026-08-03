/**
 * Tests core behavior for `@sorrell/log`.
 *
 * @module @sorrell/log/Test/Core.test
 *
 * @file      Core.test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { LogLevel } from "effect";
import { describe, expect, it } from "vitest";
import * as Category from "../Source/Category.js";
import * as Filter from "../Source/Filter.js";
import * as Loggable from "../Source/Loggable.js";
import { Normalize } from "../Source/Normalize.js";
import { Redacted } from "../Source/Redacted.js";

describe("Category", () =>
{
    it("validates, composes, and compares hierarchical categories", () =>
    {
        const Parent = Category.Make("Application.WindowManager");
        const Child = Category.Child(Parent, "Layout.Grid");

        expect(Category.ToString(Child)).toBe("Application.WindowManager.Layout.Grid");
        expect(Category.IsWithin(Child, Parent)).toBe(true);
        expect(Category.IsWithin(Parent, Child)).toBe(false);
        expect(() => Category.Make("Application..Window")).toThrow(TypeError);
        expect(() => Category.Make(".")).toThrow(TypeError);
    });
});

describe("Normalize", () =>
{
    it("normalizes primitives and special JavaScript values", () =>
    {
        expect(Normalize(1n)).toEqual({ _tag: "BigInt", Value: "1" });
        expect(Normalize(new Date("2026-07-23T00:00:00.000Z"))).toEqual({
            _tag: "Date",
            Value: "2026-07-23T00:00:00.000Z"
        });
        expect(Normalize(Symbol.for("shared"))).toEqual({
            _tag: "Symbol",
            Description: "shared",
            GlobalKey: "shared"
        });
        expect(Normalize(Number.POSITIVE_INFINITY)).toMatchObject({
            _tag: "Unavailable",
            Type: "Number"
        });
        expect(Normalize(function Named(): void { })).toEqual({
            _tag: "Function",
            Name: "Named"
        });
    });

    it("handles arrays, maps, sets, typed arrays, cycles, and shared values", () =>
    {
        const Cyclic: { Self?: unknown; } = { };
        Cyclic.Self = Cyclic;
        expect(Normalize(Cyclic)).toMatchObject({
            _tag: "Object",
            Value: {
                Self: { _tag: "CircularReference", Path: "$" }
            }
        });

        const Shared = { Value: 1 };
        const SharedResult = Normalize({ Left: Shared, Right: Shared });
        expect(JSON.stringify(SharedResult)).not.toContain("CircularReference");

        expect(Normalize(new Map([ [ "key", 1 ] ]))).toMatchObject({ _tag: "Map" });
        expect(Normalize(new Set([ 1, 2 ]))).toMatchObject({ _tag: "Set" });
        expect(Normalize(new Uint8Array([ 1, 2 ]))).toMatchObject({
            _tag: "Array",
            Type: "Uint8Array"
        });
    });

    it("does not invoke getters unless explicitly configured", () =>
    {
        let Invocations = 0;
        const Value = Object.defineProperty({ }, "Danger", {
            enumerable: true,
            get: (): string =>
            {
                Invocations += 1;
                throw new Error("getter");
            }
        });

        expect(Normalize(Value)).toMatchObject({
            _tag: "Object",
            Value: {
                Danger: { _tag: "Unavailable", Reason: "Getter not invoked" }
            }
        });
        expect(Invocations).toBe(0);
        expect(Normalize(Value, { InvokeGetters: true })).toMatchObject({
            _tag: "Object",
            Value: {
                Danger: { _tag: "Unavailable", Reason: "Getter threw" }
            }
        });
        expect(Invocations).toBe(1);
    });

    it("uses the Loggable protocol before generic inspection and catches defects", () =>
    {
        class Rectangle implements Loggable.Loggable
        {
            public readonly Secret = "not inspected";

            public readonly [Loggable.TypeId] = (
                Context: Loggable.LoggableContext
            ): unknown => ({
                Height: 20,
                Token: Context.Redacted("Token"),
                Type: "Rectangle",
                Width: 10
            });
        }

        expect(Normalize(new Rectangle())).toMatchObject({
            _tag: "Object",
            Value: {
                Height: 20,
                Token: { _tag: "Redacted", Label: "Token" },
                Type: "Rectangle",
                Width: 10
            }
        });

        const Throwing = {
            [Loggable.TypeId](): never
            {
                throw new Error("unavailable");
            }
        };
        expect(Normalize(Throwing)).toMatchObject({
            _tag: "Unavailable",
            Reason: "Loggable protocol threw"
        });
    });

    it("normalizes errors, limits, throwing proxies, and explicit redaction", () =>
    {
        const ErrorValue = new Error("outer", { cause: new TypeError("inner") });
        expect(Normalize(ErrorValue)).toMatchObject({
            _tag: "Error",
            Cause: {
                _tag: "Error",
                Message: "inner",
                Name: "TypeError"
            },
            Message: "outer"
        });

        expect(Normalize([ 1, 2, 3 ], { MaximumCollectionLength: 2 })).toMatchObject({
            _tag: "Array",
            Value: [ 1, 2, { _tag: "Truncated" } ]
        });
        expect(Normalize({ A: { B: 1 } }, { MaximumDepth: 0 })).toMatchObject({
            _tag: "Object",
            Value: { A: { _tag: "Truncated" } }
        });

        const ProxyValue = new Proxy({ }, {
            ownKeys(): never
            {
                throw new Error("proxy");
            }
        });
        expect(Normalize(ProxyValue)).toMatchObject({
            _tag: "Unavailable",
            Reason: "Object property enumeration threw"
        });

        const Sensitive = { Password: "secret" };
        const Result = Normalize(Redacted(Sensitive, "Password"));
        expect(Result).toEqual({ _tag: "Redacted", Label: "Password" });
        expect(JSON.stringify(Result)).not.toContain("secret");
    });
});

describe("Filter", () =>
{
    it("uses Effect ordering and longest-prefix category overrides", () =>
    {
        const Options: Filter.FilterOptions = {
            CategoryMinimumLevels: {
                "Application.Native": "Warn",
                "Application.Window": "Debug",
                "Application.Window.Layout": "Trace"
            },
            MinimumLevel: "Info"
        };

        expect(Filter.Accepts("Debug", "Application.Other", Options)).toBe(false);
        expect(Filter.Accepts("Info", "Application.Other", Options)).toBe(true);
        expect(Filter.Accepts("Info", "Application.Native.Hotkeys", Options)).toBe(false);
        expect(Filter.Accepts("Debug", "Application.Window.Tree", Options)).toBe(true);
        expect(Filter.Accepts("Trace", "Application.Window.Layout.Grid", Options)).toBe(true);
        expect(Filter.Accepts("Trace", "Application.Window.Tree", Options)).toBe(false);
        expect(LogLevel.isGreaterThanOrEqualTo("Error", "Info")).toBe(true);
        expect(Filter.Accepts("Trace", "Application", { MinimumLevel: "All" })).toBe(true);
        expect(Filter.Accepts("Fatal", "Application", { MinimumLevel: "None" })).toBe(false);
    });
});
