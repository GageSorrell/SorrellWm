/**
 * @file      Utility.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Code } from "@sorrell/cli-utilities/format";

export/** The name of this package. */
const CodeAuger: "code-auger" = "code-auger" as const;

export/**
       * The {@link CodeAuger | "code-auger"} package name, formatted for the terminal.
       */
const CodeAugerText: string = Code(CodeAuger);
