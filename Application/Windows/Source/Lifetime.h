/* File:      Lifetime.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include "Core/Core.h"

DECLARE_NAPI_FUNCTION(GetRunOnStartup, void, ExecutablePath, string, Callback, unknown);
DECLARE_NAPI_FUNCTION(GetIsElevated, boolean);
DECLARE_NAPI_FUNCTION(SetRunOnStartup, void, Enabled, boolean, ExecutablePath, string, Callback, unknown);
DECLARE_NAPI_FUNCTION(GetTaskExistsAsync, Promise<unknown>);

