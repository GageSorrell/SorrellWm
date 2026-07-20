/**
 * @file      PipeOperator.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { PipedArgumentValue } from "./PipeOperator.Internal";
import type { ReplaceAtIndex } from "./PipeOperator.Internal.Types";

export type BaseFunction = (...ArgumentVector: Array<unknown>) => unknown;

export type PipedArgument = typeof PipedArgumentValue;

export type ArgumentVector<FunctionType extends BaseFunction> =
    {
        [ Index in Extract<keyof Parameters<FunctionType>, `${ number }`> ]:
        ReplaceAtIndex<Parameters<FunctionType>, Index>;
    }[ Extract<keyof Parameters<FunctionType>, `${ number }`> ];

