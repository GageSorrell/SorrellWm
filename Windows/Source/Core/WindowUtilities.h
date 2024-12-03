/* File:      WindowUtilities.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include "Globals.h"
#include "Core.h"
#include <string>
#include <sstream>
#include <gdiplus.h>
#include <iostream>
#include "String.h"
#include "Utility.h"

DECLARE_EXPORTED_FUNCTION(GetFocusedWindow)
DECLARE_EXPORTED_FUNCTION(CaptureWindowScreenshot)
DECLARE_EXPORTED_FUNCTION(GetWindowLocationAndSize)
DECLARE_EXPORTED_FUNCTION(GetTitlebarHeight)
DECLARE_EXPORTED_FUNCTION(SetForegroundWindowNode)
DECLARE_EXPORTED_FUNCTION(GetWindowByName)
DECLARE_EXPORTED_FUNCTION(TestFun)
DECLARE_EXPORTED_FUNCTION(GetIsLightMode)
DECLARE_EXPORTED_FUNCTION(GetThemeColor)

Napi::Object EncodeHandle(const Napi::Env& Environment, HWND Handle);
HWND DecodeHandle(const Napi::Object& Object);
std::string CaptureWindowScreenshot_Internal(HWND hwnd);
