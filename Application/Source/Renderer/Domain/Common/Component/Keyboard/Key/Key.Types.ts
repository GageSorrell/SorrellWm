/**
 * @file      Key.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 */

import type { FKeyId } from "../../../../../../Shared/Keyboard.Types";

export type PKey =
{
    Disabled?: boolean;
    KeyId: FKeyId;
    Small?: boolean;
};
