/* File:      Screenshot.h
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include "Core/Core.h"
#include <gdiplus.h>

// DEFINE_LOG_CATEGORY(Screenshot)

DECLARE_NAPI_FUNCTION(GetScreenshot, string, Bounds, FBox)
DECLARE_NAPI_FUNCTION(CaptureScreenSectionToTempPngFile, string, Bounds, FBox)
DECLARE_NAPI_FUNCTION(WriteTaskbarIconToPng, string, Window, HWindow)

BOOL TakeScreenshotRect(const RECT& CaptureRect, std::vector<BYTE>* PixelData);
void GetScreenshotNew(RECT CaptureArea, std::vector<BYTE>* ScreenshotData);
std::unique_ptr<Gdiplus::Bitmap> CaptureScreenSectionAsBitmap(const RECT &captureArea);
