/**
 *
 *
 * @module @sorrell/effect-ink/Component/File/File
 * @internal
 *
 * @file      File.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type * as React from "react";
import type { FileProps } from "./File.Types.ts";
import { RenderFile } from "./RenderFile.tsx";
import { UseFileState } from "./UseFileState.ts";
import { flow } from "effect";

export const File: React.FC<FileProps> = flow(UseFileState, RenderFile);
