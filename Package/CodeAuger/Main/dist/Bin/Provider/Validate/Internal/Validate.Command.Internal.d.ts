/**
 * @file      Validate.Command.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
import type { ErrorDescriptions } from "./Validate.Command.Internal.Types.js";
import type { TFunction } from "@sorrell/utilities/functional";
import type { Validator } from "../Validate.Command.Types.js";
export declare function MakeGetErrorDescription(Descriptions: ErrorDescriptions, Options: Validator.Argument): TFunction.Safe<readonly [Validator.ErrorKind], string>;
//# sourceMappingURL=Validate.Command.Internal.d.ts.map