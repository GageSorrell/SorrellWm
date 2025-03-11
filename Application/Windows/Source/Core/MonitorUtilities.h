/* File:      MonitorUtilities.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

#pragma once

#include "Core.h"

int32_t GetRefreshRateFromWindow(HWND HWnd);

DECLARE_NAPI_FUNCTION(GetMonitors, Array<FMonitorInfo>)
DECLARE_NAPI_FUNCTION(InitializeMonitors, Array<FMonitorInfo>)
