/**
 * @file      PipeOperator.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { ArgumentVector, BaseFunction } from "./PipeOperator.Types";
import { Operator } from "tsover-runtime";
import type { OriginalArgument } from "./PipeOperator.Internal.Types";

class PipeMedium<FunctionType extends BaseFunction>
{
    public constructor(
        private readonly Function: FunctionType,
        private readonly ArgumentVector: ArgumentVector<typeof Function>
    ) { }

    [Operator.percent](
        Left: OriginalArgument<typeof this.Function, typeof this.ArgumentVector>,
        Right: PipeMedium<FunctionType>
    )
    {

    }
}

export function P<FunctionType extends BaseFunction>(
    Function: FunctionType,
    ...ArgumentVector: ArgumentVector<typeof Function>
): PipeMedium<typeof Function>
{
    return new PipeMedium(Function, ArgumentVector);
}
