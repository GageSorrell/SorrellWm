/**
 * @file      Listr.Experimental.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ExitSymbol, FailureSymbol, SuccessSymbol } from "./Listr.Experimental.Internal.js";

type Exit = typeof ExitSymbol;
type Failure = typeof FailureSymbol;
type Success = typeof SuccessSymbol;

export type Return =
    {
        Exit: Exit;
        Failure: Failure;
        Subtasks:
            {
                <NewContextType>(Subtasks: Array<ListrTask<NewContextType>>): void;
            };
        Success: Success;
    };

export type ListrCtorArgument<ContextType> =
    {

    };
