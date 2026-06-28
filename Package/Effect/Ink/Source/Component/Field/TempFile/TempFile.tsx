/**
 *
 *
 * @module @sorrell/effect-ink/Component/TempFile/TempFile
 * @internal
 *
 * @file      TempFile.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as React from "react";
import { RenderTempFile } from "./RenderTempFile.tsx";
import type { TempFileProps } from "./TempFile.Types.ts";
import { UseTempFileState } from "./UseTempFileState.ts";
import { flow } from "effect";

export const TempFile: React.FC<TempFileProps> = flow(UseTempFileState, RenderTempFile);
