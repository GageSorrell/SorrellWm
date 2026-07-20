/**
 *
 *
 * @module @sorrell/effect-ink/Component/Confirm/Confirm
 * @internal
 *
 * @file      Confirm.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ConfirmProps } from "./Confirm.Types.ts";
import type { FC } from "react";
import { RenderConfirm } from "./RenderConfirm.tsx";
import { UseConfirmState } from "./UseConfirm.ts";
import { flow } from "effect";

export const Confirm: FC<ConfirmProps> = flow(UseConfirmState, RenderConfirm);
