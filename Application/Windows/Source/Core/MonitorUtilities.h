/* File:      MonitorUtilities.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include "Core.h"

int32_t GetRefreshRateFromWindow(HWND HWnd);

DECLARE_NAPI_FUNCTION(GetMonitors, TArray<FMonitorInfo>)
DECLARE_NAPI_FUNCTION(InitializeMonitors, TArray<FMonitorInfo>)
DECLARE_NAPI_FUNCTION(GetMonitorFriendlyName, string | undefined, Handle, HMonitor)

int GetLeastRefreshRateOverRect(const RECT& InputRectangle);
