/**
 *
 *
 * @module @sorrell/effect-ink/Component/TempFile/Types
 * @internal
 *
 * @file      TempFile.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Internal from "../../../Internal/Prompt.ts";
import type * as Prompt from "../../../Prompt.ts";
import type { Field } from "../../index.ts";

export type TempFileProps = Field.Props<Internal.TempFileState, Prompt.TempFileOptions>;

export type TempFileState = object;
