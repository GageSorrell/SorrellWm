/* File:      LogTest.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable sort-keys, @typescript-eslint/no-unused-vars */

import type { FLogger } from "../../../Shared";
import { Format } from "./LogFormat";
import { GetLogger } from "./Log";

const Log: FLogger = GetLogger("Log");

const TestString: string = "All the king's men could not save him.";
const TestNum: number = -900_299_183_200;
const TestNull: null = null;
const TestUndefined: undefined = undefined;
const TestBoolean: boolean = true;

const TestFunction = (_Foo: unknown, _Bar: unknown): unknown =>
{
    return [ _Foo, _Bar ];
};

const LargeRecord: Record<PropertyKey, unknown> =
{
    Foo: TestFunction,
    Bar: 900,
    Baz: "My Baz String Test.",
    Bazzar: TestUndefined
};

const SmallRecord: Record<PropertyKey, unknown> =
{
    Foo: 1,
    Bar: 2
};

const TestLargeArray: TArray<unknown> =
[
    TestFunction,
    900,
    "My Baz String Test.",
    TestUndefined
];

const TestSmallArray: TArray<unknown> = [ 1, 2, 3 ];
const TestLargeSet: Set<unknown> = new Set<unknown>(TestLargeArray);
const TestSmallSet: Set<unknown> = new Set<unknown>(TestSmallArray);

const TestLargeMap: TMap<PropertyKey, unknown> = ((): TMap<PropertyKey, unknown> =>
{
    const Out: TMap<PropertyKey, unknown> = new Map<PropertyKey, unknown>();
    Out.set("Foo", 10292);
    Out.set(19, [ 1, 3 ]);
    Out.set(20, [ -10, 92, "Foo", "BarBaz", 100_000, -10_198, "FooBarBazBashBing" ]);
    Out.set("Bar Baz Foo", true);
    Out.set("Bar Baz Foobar", TestNum);
    return Out;
})();

const TestSmallMap: TMap<PropertyKey, unknown> = ((): TMap<PropertyKey, unknown> =>
{
    const Out: TMap<PropertyKey, unknown> = new Map<PropertyKey, unknown>();
    Out.set("MyMap", 1);
    Out.set(19, 2);
    return Out;
})();

// Log(Format(LargeRecord));
// Log(Format(SmallRecord));

// Log(Format(TestString));
// Log(Format(TestNum));
// Log(Format(TestNull));
// Log(Format(TestUndefined));
// Log(Format(TestBoolean));
// Log(Format(TestFunction));

// Log(Format(TestLargeArray));
// Log(Format(TestSmallArray));
// Log(Format(TestLargeSet));
// Log(Format(TestSmallSet));
setTimeout((): void =>
{
    Log(Format(TestLargeMap));
}, 2000);
// Log(Format(TestSmallMap));

export const Foo: string = "Foo";
