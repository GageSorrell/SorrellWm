/* File:      Core.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include <napi.h>
#include <string>
#include <Windows.h>
#include <psapi.h>
#include <winver.h>
#include "js_native_api_types.h"
#include <iostream>
#include "Log.h"
#include "Typedefs.h"
#include "Globals.h"

#pragma comment(lib, "Gdiplus.lib")
#pragma comment(lib, "dwmapi.lib")
#pragma comment(lib, "Version.lib")
