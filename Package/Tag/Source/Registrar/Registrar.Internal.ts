/**
 * @file      Registrar.Internal.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Logger } from "../Utility/Utility.js";
import type { Tag } from "../Tag/Tag.Types.js";

const TagOwners: Map<Tag, string> = new Map<Tag, string>();

export function CheckCollision(
    CurrentTags: ReadonlyArray<string>,
    Dependent: string
): ((NewTag: string) => void)
{
    return function(NewTag: string): void
    {
        if (CurrentTags.includes(NewTag))
        {
            Logger.warn(
                `The tag ${ NewTag } was registered by ${ Dependent }, but the tag was already registered ` +
                `by ${ TagOwners.get(NewTag) || "TAG_OWNER_NOT_FOUND" }.  This may cause issues when ` +
                "debugging, but the behavior in production mode is unaffected."
            );
        }
    };
}
