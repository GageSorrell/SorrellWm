/**
 * @file      Validate.Command.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ErrorDescriptions } from "./Validate.Command.Internal.Types.js";
import type { TFunction } from "@sorrell/utilities/functional";
import type { Validator } from "../Validate.Command.Types.js";
import type { Values } from "@sorrell/utilities/record";

export function MakeGetErrorDescription(
    Descriptions: ErrorDescriptions,
    Options: Validator.Argument
): TFunction.Safe<readonly [ Validator.ErrorKind ], string>
{
    return function(Kind: Validator.ErrorKind): string
    {
        const DescriptionValue: Values<ErrorDescriptions> = Descriptions[Kind];

        if (typeof DescriptionValue === "string")
        {
            return DescriptionValue;
        }
        else
        {
            return DescriptionValue(Options);
        }
    };
}
