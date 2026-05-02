/**
 * @file      Dependency.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ConsoleLogFunctionKey } from "./Dependency.Internal.Types";

export type DependencyLogger = Pick<typeof console, ConsoleLogFunctionKey>;
