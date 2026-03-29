/* File:      Event.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { EmptyEventParameter, EventDecl } from "../../../../Package/ElectronReactiveEvent/Distribution/index.inner";

export type GetData = EventDecl<"Main", EmptyEventParameter, number, "GetNah">;

export type SetData = EventDecl<"Renderer", number, EmptyEventParameter, "SetNah">;
