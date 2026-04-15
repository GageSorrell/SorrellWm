/* File:      Listener.Internal.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EmptyOverloadParameterValue } from "./Listener.Internal";

/** This type is used internally by overloaded (private) signatures. */
export type EmptyOverloadParameter = typeof EmptyOverloadParameterValue;
