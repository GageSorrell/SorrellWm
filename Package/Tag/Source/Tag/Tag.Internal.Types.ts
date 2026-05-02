/**
 * @file      Tag.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { TagTag } from "./Tag.Internal.ts";

type TagDeclBase =
    {
        _Tag: typeof TagTag;
        Value: string;
        Description: string | undefined;
        Source: string;
    };

export type TagDecl =
    TagDeclBase &
    (
        | {
            Deprecated?: false;
        }
        | {
            Deprecated: true;
            DeprecatedBy: TagDecl;
        }
    );
