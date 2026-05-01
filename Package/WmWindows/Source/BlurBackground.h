/* File:      BlurBackground.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include "Core/Core.h"

DECLARE_NAPI_FUNCTION(BlurBackground, HWindow, Bounds, FBox, SourceHandle, HWindow);
DECLARE_NAPI_FUNCTION(UnblurBackground, void);
DECLARE_NAPI_FUNCTION(KillOrphans, void);
void InitializeBlurBackground();
