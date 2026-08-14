/**
 * Format strings with style functions powered by `chalk`.
 *
 * @module @sorrell/cli-utility/Format
 *
 * @file      Format.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import Chalk from "chalk";
import { pipe } from "effect";

export const Code = (In: string): string => pipe(
    [ In ],
    Chalk.bold,
    Chalk.red
);

