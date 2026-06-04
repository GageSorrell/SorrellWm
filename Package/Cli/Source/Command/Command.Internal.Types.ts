/**
 * @file      Command.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { And, InvalidData, MissingData, Or, SourceUnavailable, Unsupported } from "effect/ConfigError";
import type { ValidationError } from "@sorrell/effect/unstable/cli/ValidationError";

export type TEffectError<ErrorType> =
    | ErrorType
    | ValidationError
    | And
    | Or
    | InvalidData
    | MissingData
    | SourceUnavailable
    | Unsupported;
