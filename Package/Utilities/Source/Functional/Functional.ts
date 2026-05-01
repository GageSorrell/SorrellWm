/**
 * @file      Functional.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { CurriedArgument } from "./Functional.Internal";
import type { FCurriedArgument } from "./Functional.Internal.Types";
import type { TFunction } from "./Functional.Types";

export function Identity<Type>(...Arguments: Array<Type>)
{
    return Arguments;
}
