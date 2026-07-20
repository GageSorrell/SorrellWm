/**
 * @file      Format.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Formatter } from "./Format.Types.js";

/** The result of parsing a {@link FormatRules} object. */
export type FormatRulesParsed = Map<string | RegExp, Formatter>;
