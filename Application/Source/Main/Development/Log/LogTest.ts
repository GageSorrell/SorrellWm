/* File:      LogTest.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable sort-keys */

import type { FLogger } from "?/Log.Types";
import { GetLogger } from "./Log";
import { LogFormat } from "./LogUtility";

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

const TestLargeArray: Array<unknown> =
[
    TestFunction,
    900,
    "My Baz String Test.",
    TestUndefined
];

const TestSmallArray: Array<unknown> = [ 1, 2, 3 ];
const TestLargeSet: Set<unknown> = new Set<unknown>(TestLargeArray);
const TestSmallSet: Set<unknown> = new Set<unknown>(TestSmallArray);

const TestLargeMap: Map<PropertyKey, unknown> = ((): Map<PropertyKey, unknown> =>
{
    const Out: Map<PropertyKey, unknown> = new Map<PropertyKey, unknown>();
    Out.set("Foo", 10292);
    Out.set(19, [ 1, 3 ]);
    Out.set("Bar Baz Foo", true);
    Out.set("Bar Baz Foobar", TestNum);
    return Out;
})();

const TestSmallMap: Map<PropertyKey, unknown> = ((): Map<PropertyKey, unknown> =>
{
    const Out: Map<PropertyKey, unknown> = new Map<PropertyKey, unknown>();
    Out.set("MyMap", 1);
    Out.set(19, 2);
    return Out;
})();

Log(LogFormat(LargeRecord));
Log(LogFormat(SmallRecord));
Log(LogFormat(TestString));
Log(LogFormat(TestNum));
Log(LogFormat(TestNull));
Log(LogFormat(TestUndefined));
Log(LogFormat(TestBoolean));
Log(LogFormat(TestFunction));
Log(LogFormat(TestLargeArray));
Log(LogFormat(TestSmallArray));
Log(LogFormat(TestLargeSet));
Log(LogFormat(TestSmallSet));
Log(LogFormat(TestLargeMap));
Log(LogFormat(TestSmallMap));

export const Foo: string = "Foo";
