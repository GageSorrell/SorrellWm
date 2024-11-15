/* File:      Core.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#pragma once

// @TODO `#include` everything that *every* file should `#include`.
#include <napi.h>
#include <Windows.h>
#include "js_native_api_types.h"
#include "Typedefs.h"
#include "Log.h"

#pragma comment(lib, "Gdiplus.lib")
#pragma comment(lib, "dwmapi.lib")

