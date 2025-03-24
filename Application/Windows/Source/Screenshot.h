/* File:      Screenshot.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

#pragma once

#include "Core/Core.h"

DECLARE_LOG_CATEGORY(Screenshot)

DECLARE_NAPI_FUNCTION(GetScreenshot, string, Bounds, FBox)
DECLARE_NAPI_FUNCTION(CaptureScreenSectionToTempPngFile, string, Bounds, FBox)

std::unique_ptr<Gdiplus::Bitmap> CaptureScreenSectionAsBitmap(const RECT &captureArea);
