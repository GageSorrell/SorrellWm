/* File:      BlurBackground.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */

#pragma once

#include "Core/Core.h"

DECLARE_NAPI_FUNCTION(BlurBackground, void, Bounds, FBox, SourceHandle, HWindow);
DECLARE_NAPI_FUNCTION(UnblurBackground, void);
void InitializeBlurBackground();
