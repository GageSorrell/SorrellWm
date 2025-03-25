/* File:      BlurBackground.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

#pragma once

#include "Core/Core.h"

DECLARE_NAPI_FUNCTION(BlurBackground, void, Bounds, FBox);
DECLARE_NAPI_FUNCTION(UnblurBackground, void);

// DEFINE_LOG_CATEGORY(Blur)
