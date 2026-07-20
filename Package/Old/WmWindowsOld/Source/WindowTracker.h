/* File:      WindowTracker.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include "Core/Core.h"

DECLARE_NAPI_FUNCTION(InitializeWindowTracker, void)
DECLARE_NAPI_FUNCTION(UpdateTiledList, void, In, Array<HWindow>)
bool IsWindowTiled(HWND Window);
