/**
 * @file      Validate.Command.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ReadonlyRecord } from "effect/Record";
import type { TFunction } from "@sorrell/utilities/functional";
import type { Validator } from "../Validate.Command.Types.js";

export type ErrorDescriptions =
    ReadonlyRecord<
        Validator.ErrorKind,
        | string
        | TFunction<Validator.Argument, string>
    >;
