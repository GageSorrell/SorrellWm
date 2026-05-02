/**
 * @file      Registrar.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { CheckCollision } from "./Registrar.Internal.js";
import type { Tag } from "../Tag/Tag.Types.js";

const Tags: Array<Tag> = [ ];

export function RegisterTagsRuntime(
    Dependent: string,
    ...InTags: ReadonlyArray<string>
): void
{
    InTags.forEach(CheckCollision(Tags, Dependent));
}
