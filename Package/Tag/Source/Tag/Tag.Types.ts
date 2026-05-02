/**
 * @file      Tag.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Registrar } from "../Registrar/Registrar.Types.ts";

export type Tag = keyof Registrar;
