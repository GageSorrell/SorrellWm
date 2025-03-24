/* File:      BlurBackground.cpp
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

#pragma once

#include "Core/Core.h"

DECLARE_NAPI_FUNCTION(BlurBackground_DEPRECATED, void);
DECLARE_NAPI_FUNCTION(UnblurBackground_DEPRECATED, void);
void InitializeBlurBackground_DEPRECATED();

DEFINE_LOG_CATEGORY(Blur)
