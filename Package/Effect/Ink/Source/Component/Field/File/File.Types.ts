/**
 *
 *
 * @module @sorrell/effect-ink/Component/File/Types
 * @internal
 *
 * @file      File.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as Internal from "../../../Internal/Prompt.ts";
import type { Field } from "../../index.ts";

export type FileProps = Field.Props<Internal.FileState, Internal.FileOptionsInternal>;

export type FileState = object;
