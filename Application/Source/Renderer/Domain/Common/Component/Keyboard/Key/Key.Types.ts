/* File:      Key.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

import type { FKeyId } from "../../../../../../Shared/Keyboard.Types";

export type PKey =
{
    Disabled?: boolean;
    KeyId: FKeyId;
};
