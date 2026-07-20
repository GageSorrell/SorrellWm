/**
 * @file      Utility.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { type DependencyLogger, GetDependencyLogger } from "@sorrell/utilities/dependency";

export const Logger: DependencyLogger = GetDependencyLogger("ts-tag", 12, "TS_TAG_NO_LOG");
