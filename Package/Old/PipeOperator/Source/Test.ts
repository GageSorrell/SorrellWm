/**
 * @file      Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { P } from "./PipeOperator";

function OperateOnNumber(In: number): string
{
    return In.toString();
}

function Capitalize(In: string): string
{
    return In.toUpperCase();
}

function Main(): void
{
    "use tsover";
    const Value: number = 5;

    return Value % P(OperateOnNumber);
}

Main();
