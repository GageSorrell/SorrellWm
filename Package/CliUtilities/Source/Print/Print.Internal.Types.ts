/* File:      Print.Internal.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { Formatter } from "./Print.Types.js";

/** The result of parsing a {@link FormatRules} object. */
export type FormatRulesParsed = Map<string | RegExp, Formatter>;
