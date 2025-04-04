/* File:      Miscellaneous.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include "../Core/Core.h"

// DECLARE_NAPI_FUNCTION(SpawnNotepadInstances, Array<HWindow>, NumWindows, number)
DECLARE_NAPI_FUNCTION(GetNotepadHandles, Array<HWindow>)
DECLARE_NAPI_FUNCTION(KillNotepadInstances, void)
