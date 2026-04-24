/**
 * @file      Functional.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Argon2Algorithm } from "node:crypto";
import type { TMaybeAsync } from "../Async/Async.Types.js";

export type TExtractFunction<Type> =
    Type extends { (...ArgumentVector: infer ArgumentVectorType): infer ReturnType }
        ? (...ArgumentVector: ArgumentVectorType) => ReturnType
        : never;

export type TFunction<
    ArgumentVectorType extends Array<unknown> = [ ],
    ReturnType = void
> =
    [ ArgumentVectorType ] extends [ never ]
        ? {
            (): ReturnType;
        }
        : {
            (...ArgumentVector: ArgumentVectorType): ReturnType;
        };

export namespace TFunction
{
    export type MaybeAsync<
        ArgumentVectorType extends Array<unknown> = [ ],
        ReturnType = void
    > =
        TMaybeAsync<TFunction<ArgumentVectorType, ReturnType>>;
}

